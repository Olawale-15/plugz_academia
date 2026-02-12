import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import {
  PrimeTableComponent,
  TableColumn,
  TableAction,
} from '../../../../shared/prime-table/prime-table.component';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { LookupService } from '../../../core/services/lookup.service';
import { UserContextService } from '../../../core/services/user-context';
import { ConfirmService } from '../../../core/services/confirm.service';
import {
  NewStudent,
  UpdateStudent,
  DeleteStudent,
  UpdateStudentStatus,
} from '../../../core/models/enrollment.model';

interface Student {
  id: number;
  studentId: string;
  firstname: string;
  middlename: string;
  lastname: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  alternateEmail?: string;
  telephone: string;
  alternateTelephone?: string;
  contactAddress: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive';
  photoUrl?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    IconComponent,
    ModalComponent,
    PrimeTableComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  searchQuery: string = '';
  searchFilter: string = ''; 
  columns: TableColumn[] = [];
  actions: TableAction[] = [];
  isModalOpen = false;
  studentForm!: FormGroup;
  isLoading = false;
  loadingStudents = false;
  merchantId = '';
  isEditMode = false;
  currentStudent: Student | null = null;
  isStatusModalOpen = false;
  selectedStudent: Student | null = null;
  selectedStatus: string = ''; 

  // Lookup data
  genders: any[] = [];
  studentStatuses: any[] = [];
  loadingLookups = false;

  students: Student[] = [];

  searchFilters = [
    { value: '', label: 'Search by...' },
    { value: 'studentname', label: 'Student Name' },
    { value: 'studentId', label: 'Student ID' },
    { value: 'email', label: 'Email' },
    { value: 'telephone', label: 'Telephone' },
    { value: 'studentStatus', label: 'Status' },
  ];

  // dropdown data
  sessions: string[] = ['2024', '2025', '2026'];
  terms: string[] = ['First Term', 'Second Term'];

  // selected values
  selectedSession: string = '';
  selectedTerm: string = '';

  get filteredStudents(): Student[] {
    return this.students;
  }

  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private lookupService: LookupService,
    private userContext: UserContextService,
    private confirmService: ConfirmService,
  ) {
    this.merchantId = this.userContext.merchantId || '';
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeActions();
    this.initializeForm();
    this.loadLookups();
    this.loadStudents(); 
  }

  loadLookups(): void {
    this.loadingLookups = true;

    this.lookupService.getGender(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.genders = Array.isArray(res.data) ? res.data : [res.data];
          console.log('genders', this.genders);
        }
      },
      error: (err) => {
        console.error('Error fetching genders:', err);
        this.loadingLookups = false;
      },
    });

    this.lookupService.getStudentStatus(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.studentStatuses = Array.isArray(res.data)
            ? res.data
            : [res.data];
          console.log('student statuses', this.studentStatuses);
          this.loadingLookups = false;
        }
      },
      error: (err) => {
        console.error('Error fetching student statuses:', err);
        this.loadingLookups = false;
      },
    });
  }

  loadStudents(): void {
    this.loadingStudents = true;

    const params: any = {
      MerchantId: this.merchantId,
    };

    // Existing text search
    if (this.searchQuery && this.searchQuery.trim() && this.searchFilter) {
      const filterMap: any = {
        studentname: 'Studentname',
        studentId: 'StudentId',
        email: 'Email',
        telephone: 'Telephone',
        studentStatus: 'StudentStatus',
      };

      const apiParamName = filterMap[this.searchFilter] || this.searchFilter;
      params[apiParamName] = this.searchQuery.trim();
    }

    if (this.selectedSession) {
      params['Session'] = this.selectedSession;
    }

    if (this.selectedTerm) {
      params['Term'] = this.selectedTerm;
    }

    this.enrollmentService.getStudent(params).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          this.students = Array.isArray(response.data)
            ? response.data.map((s) => this.mapStudentData(s))
            : [this.mapStudentData(response.data)];
        } else {
          this.students = [];
        }

        this.loadingStudents = false;
      },
      error: () => {
        this.students = [];
        this.loadingStudents = false;
      },
    });
  }

  mapStudentData(data: any): Student {
    const fullnameParts = (data.fullname || '').split(' ');
    const firstname = data.firstname || fullnameParts[0] || '';
    const lastname =
      data.lastname || fullnameParts[fullnameParts.length - 1] || '';
    const middlename =
      data.middlename ||
      (fullnameParts.length > 2 ? fullnameParts.slice(1, -1).join(' ') : '');

    return {
      id: data.recId || 0,
      studentId: data.studentId || '',
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      name: data.fullname || `${firstname} ${middlename} ${lastname}`.trim(),
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth).toLocaleDateString()
        : '',
      gender: data.gender || '',
      email: data.email || '',
      alternateEmail: data.alternateEmail || '',
      telephone: data.telephone || '',
      alternateTelephone: data.alternateTelephone || '',
      contactAddress: data.contactAddress || '',
      enrollmentDate: data.enrollmentDate
        ? new Date(data.enrollmentDate).toLocaleDateString()
        : '',
      status: data.studentStatus === 'ACTIVE' ? 'Active' : 'Inactive',
      photoUrl: data.photoUrl || data.photo || data.imageUrl || '',
    };
  }

  onSearch(): void {
    this.loadStudents();
  }

  initializeForm(): void {
    this.studentForm = this.fb.group({
      merchantId: [this.merchantId],
      studentId: ['', Validators.required],
      firstname: ['', Validators.required],
      middlename: [''],
      lastname: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      alternateEmail: ['', Validators.email],
      telephone: ['', Validators.required],
      alternateTelephone: [''],
      contactAddress: ['', Validators.required],
      enrollmentDate: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      studentStatus: ['ACTIVE', Validators.required],
    });
  }

  initializeColumns(): void {
    this.columns = [
      {
        field: 'studentId',
        header: 'Student ID',
        sortable: true,
        width: '140px',
      },
      {
        field: 'photoUrl',
        header: 'Picture',
        sortable: true,
        width: '80px',
      },
      { field: 'name', header: 'Name', sortable: true, width: '180px' },
      { field: 'gender', header: 'Gender', sortable: true, width: '100px' },
      {
        field: 'dateOfBirth',
        header: 'Date of Birth',
        sortable: true,
        width: '130px',
      },
      { field: 'email', header: 'Email', sortable: false, width: '200px' },
      { field: 'telephone', header: 'Phone', sortable: false, width: '140px' },
      {
        field: 'contactAddress',
        header: 'Address',
        sortable: false,
        width: '250px',
      },
      {
        field: 'enrollmentDate',
        header: 'Enrollment Date',
        sortable: true,
        width: '150px',
      },
      { field: 'status', header: 'Status', sortable: true, width: '100px' },
    ];
  }

  initializeActions(): void {
    this.actions = [
      {
        label: 'Edit',
        icon: 'edit-2',
        command: (student: Student) => this.onEdit(student),
      },
      {
        label: 'Upload Picture',
        icon: 'upload',
        command: (student: Student) => this.onUploadPic(student),
      },
      {
        label: 'Update Status',
        icon: 'upload',
        command: (student: Student) => this.onUploadPic(student),
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (student: Student) => this.onDelete(student),
      },
    ];
  }

  onNewStudent(): void {
    this.isEditMode = false;
    this.currentStudent = null;
    this.isModalOpen = true;
    this.studentForm.reset({
      merchantId: this.merchantId,
      studentStatus: 'ACTIVE',
      enrollmentDate: new Date().toISOString().split('T')[0],
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentStudent = null;
    this.studentForm.reset();
  }

  handleSubmit(): void {
    if (this.studentForm.invalid) {
      this.markFormGroupTouched(this.studentForm);
      return;
    }

    if (this.isEditMode) {
      this.updateStudent();
    } else {
      this.createStudent();
    }
  }

  createStudent(): void {
    this.isLoading = true;
    const formData: NewStudent = {
      ...this.studentForm.value,
      dateOfBirth: new Date(this.studentForm.value.dateOfBirth).toISOString(),
      enrollmentDate: new Date(
        this.studentForm.value.enrollmentDate,
      ).toISOString(),
    };

    this.enrollmentService.newStudent(formData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess(
            'Success',
            response.message || 'Student created successfully',
          );
          this.closeModal();
          this.loadStudents(); // Reload students after creation
        } else {
          this.confirmService.showError(
            'Error',
            response.message || 'Failed to create student',
          );
          this.loadStudents(); // Reload to ensure data is current
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating student:', error);
        this.confirmService.showError(
          'Error',
          error.error?.message ||
            error.message ||
            'An error occurred while creating the student',
        );
        this.loadStudents(); // Reload to ensure data is current
        this.isLoading = false;
      },
    });
  }

  updateStudent(): void {
    this.isLoading = true;
    const formData: UpdateStudent = {
      ...this.studentForm.value,
      dateOfBirth: new Date(this.studentForm.value.dateOfBirth).toISOString(),
      enrollmentDate: new Date(
        this.studentForm.value.enrollmentDate,
      ).toISOString(),
    };

    this.enrollmentService.updateStudent(formData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess(
            'Success',
            response.message || 'Student updated successfully',
          );
          this.closeModal();
          this.loadStudents(); // Reload students after update
        } else {
          this.confirmService.showError(
            'Error',
            response.message || 'Failed to update student',
          );
          this.loadStudents(); // Reload to ensure data is current
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating student:', error);
        this.confirmService.showError(
          'Error',
          error.error?.message ||
            error.message ||
            'An error occurred while updating the student',
        );
        this.loadStudents(); // Reload to ensure data is current
        this.isLoading = false;
      },
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.studentForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onEdit(student: Student): void {
    this.isEditMode = true;
    this.currentStudent = student;
    this.isModalOpen = true;

    // Convert date strings back to ISO format for form input
    const dateOfBirth = student.dateOfBirth
      ? this.convertToISODate(student.dateOfBirth)
      : '';
    const enrollmentDate = student.enrollmentDate
      ? this.convertToISODate(student.enrollmentDate)
      : '';

    this.studentForm.patchValue({
      merchantId: this.merchantId,
      studentId: student.studentId,
      firstname: student.firstname,
      middlename: student.middlename,
      lastname: student.lastname,
      dateOfBirth: dateOfBirth,
      gender: student.gender,
      email: student.email,
      alternateEmail: student.alternateEmail || '',
      telephone: student.telephone,
      alternateTelephone: student.alternateTelephone || '',
      contactAddress: student.contactAddress,
      enrollmentDate: enrollmentDate,
      studentStatus: student.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
    });
  }

  // Helper method to convert date string to ISO format for input[type="date"]
  private convertToISODate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  }

  async onDelete(student: Student): Promise<void> {
    const confirmed = await this.confirmService.confirmSubmit(
      `Are you sure you want to delete ${student.name}?\n\nStudent ID: ${student.studentId}\nEmail: ${student.email}\n\nThis action cannot be undone.`,
      'Delete Student',
    );

    if (!confirmed) {
      return;
    }

    this.loadingStudents = true;
    const deleteData: DeleteStudent = {
      merchantId: this.merchantId,
      studentId: student.studentId,
      studentname: student.name,
      email: student.email,
      telephone: student.telephone,
      studentStatus: student.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
    };

    this.enrollmentService.deleteStudent(deleteData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess(
            'Success',
            response.message || 'Student deleted successfully',
          );
          this.loadStudents(); // Reload students after deletion
        } else {
          this.confirmService.showError(
            'Error',
            response.message || 'Failed to delete student',
          );
          this.loadingStudents = false;
        }
      },
      error: (error) => {
        console.error('Error deleting student:', error);
        this.confirmService.showError(
          'Error',
          error.error?.message ||
            error.message ||
            'An error occurred while deleting the student',
        );
        this.loadingStudents = false;
      },
    });
  }

  onUploadPic(student: Student): void {
    this.selectedStudent = student;
    this.selectedStatus = student.status === 'Active' ? 'ACTIVE' : 'INACTIVE';
    this.isStatusModalOpen = true;
  }

  closeStatusModal(): void {
    this.isStatusModalOpen = false;
    this.selectedStudent = null;
    this.selectedStatus = '';
  }

  async toggleStudentStatus(): Promise<void> {
    if (!this.selectedStudent || !this.selectedStatus) return;

    const statusDisplay =
      this.selectedStatus === 'ACTIVE' ? 'Active' : 'Inactive';
    const confirmed = await this.confirmService.confirmSubmit(
      `Are you sure you want to update ${this.selectedStudent.name}'s status to ${statusDisplay}?`,
      'Update Student Status',
    );

    if (!confirmed) {
      return;
    }

    this.isLoading = true;
    const statusData: UpdateStudentStatus = {
      merchantId: this.merchantId,
      studentId: this.selectedStudent.studentId,
      studentname: this.selectedStudent.name,
      email: this.selectedStudent.email,
      telephone: this.selectedStudent.telephone,
      studentStatus: this.selectedStatus,
    };

    this.enrollmentService.updateStudentStatus(statusData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess(
            'Success',
            response.message || `Student status updated to ${statusDisplay}`,
          );
          this.closeStatusModal();
          this.loadStudents();
        } else {
          this.confirmService.showError(
            'Error',
            response.message || 'Failed to update student status',
          );
          this.loadStudents();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating student status:', error);
        this.confirmService.showError(
          'Error',
          error.error?.message ||
            error.message ||
            'An error occurred while updating the student status',
        );
        this.loadStudents();
        this.isLoading = false;
      },
    });
  }
}
