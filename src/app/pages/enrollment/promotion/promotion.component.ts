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
import { forkJoin } from 'rxjs';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { LookupService } from '../../../core/services/lookup.service';
import { UserContextService } from '../../../core/services/user-context';
import { ConfirmService } from '../../../core/services/confirm.service';
import {
  NewEnrollment,
  UpdateEnrollment,
  DeleteEnrollment,
  UpdateEnrollmentStatus,
  GetEnrollmentParams,
} from '../../../core/models/enrollment.model';

// Update this interface based on actual API response
interface Enrollment {
  id: number;
  enrollmentId: string;
  studentId: string;
  studentName: string;
  programmeId: string;
  academicSession: string;
  academicTerm: string;
  classId: string;
  subClassId: string;
  enrollmentDate: string;
  status: 'ENABLED' | 'DISABLED';
  selected?: boolean;
}

@Component({
  selector: 'app-promotion',
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
  templateUrl: './promotion.component.html',
  styleUrl: './promotion.component.css',
})
export class PromotionComponent implements OnInit {
  searchQuery: string = '';
  searchFilter: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];
  isModalOpen = false;
  enrollmentForm!: FormGroup;
  isLoading = false;
  loadingEnrollments = false;
  merchantId = '';
  isEditMode = false;
  currentEnrollment: Enrollment | null = null;
  isStatusModalOpen = false;
  selectedEnrollment: Enrollment | null = null;

  // Lookup data
  academicSessions: any[] = [];
  academicTerms: any[] = [];
  enrollmentStatuses: any[] = [];
  classes: any[] = [];
  programmes: any[] = [];
  students: any[] = [];
  loadingLookups = false;

  enrollments: Enrollment[] = [];
  selectedStudents: Enrollment[] = [];
  isSelcted = false;
  bulkEnrollMode = false;
  showUnenrolledOnly = true;
  isHeaderChecked = false;

  // New enrollment form data for bulk enrollment
  bulkEnrollmentData = {
    programmeId: '',
    academicSession: '',
    academicTerm: '',
    classId: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    enrollmentStatus: 'ENABLE',
  };

  //Get Selected Count
  get SelectedCount(): number {
    return this.selectedStudents.length;
  }

  //Filter students, show only unenroll student by default
  get filteredEnrollment(): Enrollment[] {
    let filtered = this.enrollments;
    if (this.showUnenrolledOnly) {
      filtered = filtered.filter((student) => !this.isStudentEnrolled(student));
    }

    return filtered;
  }

  // Helper method to determine if a student is enrolled
  isStudentEnrolled(student: Enrollment): boolean {
    return student.status === 'ENABLED';
  }

  // Get enrollment status text
  getEnrollmentStatus(student: Enrollment): string {
    return this.isStudentEnrolled(student) ? 'Enrolled' : 'Not Enrolled';
  }

  // Check if enrollment fields are empty
  hasEmptyEnrollmentFields(student: Enrollment): boolean {
    return (
      !student.programmeId &&
      !student.academicSession &&
      !student.academicTerm &&
      !student.classId &&
      !student.enrollmentDate
    );
  }

  // Get enrolled count from current data
  getEnrolledCount(): number {
    return this.enrollments.filter((student) => this.isStudentEnrolled(student))
      .length;
  }

  // Get unenrolled count from current data
  getUnenrolledCount(): number {
    return this.enrollments.filter(
      (student) => !this.isStudentEnrolled(student),
    ).length;
  }

  searchFilters = [
    { value: '', label: 'Search by...' },
    { value: 'studentId', label: 'Student ID' },
    { value: 'studentName', label: 'Student Name' },
    { value: 'programmeId', label: 'Programme ID' },
    { value: 'academicSession', label: 'Academic Session' },
    { value: 'enrolmentStatus', label: 'Status' },
  ];

  searchSession: string | null = null;
  searchTerm: string | null = null;
  searchProgramme: string | null = null;
  searchClasses: string | null = null;

  // This should return ALL students (both enrolled and unenrolled) to display
  get filteredEnrollments(): Enrollment[] {
    return this.enrollments;
  }

  // Get only unenrolled students from the displayed data
  get unenrolledStudents(): Enrollment[] {
    return this.filteredEnrollments.filter(
      (student) => !this.isStudentEnrolled(student),
    );
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

  isSelected(student: Enrollment): boolean {
    const isSelected = this.selectedStudents.some(
      (s) => s.studentId === student.studentId,
    );
    return isSelected;
  }

  toggleStudent(student: Enrollment, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const checked = checkbox.checked;

    // Prevent selecting enrolled students
    if (this.isStudentEnrolled(student)) {
      checkbox.checked = false;
      console.log('Student is enrolled, checkbox disabled');
      return;
    }

    if (checked) {
      // Add if not already selected
      if (!this.isSelected(student)) {
        this.selectedStudents.push(student);
        console.log('Student added to selection');
      }
    } else {
      this.selectedStudents = this.selectedStudents.filter(
        (s) => s.studentId !== student.studentId,
      );
      console.log('Student removed from selection');
    }
    this.isHeaderChecked =
      this.unenrolledStudents.length > 0 &&
      this.unenrolledStudents.every((u) =>
        this.selectedStudents.some((s) => s.studentId === u.studentId),
      );
  }

  areAllSelected(): boolean {
    const unenrolled = this.unenrolledStudents;
    return unenrolled.length > 0 && unenrolled.every((s) => s.selected);
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    this.unenrolledStudents.forEach((student) => {
      student.selected = checked;
    });

    this.syncSelectedStudents();
  }

  loadLookups(): void {
    this.loadingLookups = true;

    this.lookupService.getAcademicSession(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          this.academicSessions = res.data;
        } else {
          this.academicSessions = [];
        }
      },
      error: (err) => {
        console.error('Error fetching academic sessions:', err);
        this.academicSessions = [];
      },
    });

    this.lookupService.getAcademicTerm(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          this.academicTerms = res.data;
        } else {
          this.academicTerms = [];
        }
      },
      error: (err) => {
        console.error('Error fetching academic terms:', err);
        this.academicTerms = [];
      },
    });

    this.lookupService.getProgramme(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          this.programmes = res.data;
        } else {
          this.programmes = [];
        }
      },
      error: (err) => {
        console.error('Error fetching programmes:', err);
        this.programmes = [];
      },
    });

    this.lookupService.getStudentStatus(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.enrollmentStatuses = Array.isArray(res.data)
            ? res.data
            : [res.data];
        }
      },
      error: (err) => {
        console.error('Error fetching enrollment statuses:', err);
      },
    });

    this.lookupService.getClasses(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.classes = Array.isArray(res.data) ? res.data : [res.data];
          // this.loadingLookups = false;
        }
      },
      error: (err) => {
        console.error('Error fetching classes:', err);
        this.loadingLookups = false;
      },
    });

    this.enrollmentService
      .getStudent({
        MerchantId: this.merchantId,
      })
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.students = Array.isArray(res.data) ? res.data : [res.data];
          }
        },
        error: (err) => {
          console.log('Error fetching students', err);
          this.loadingLookups = false;
        },
      });
  }

  loadStudents(): void {
    this.loadingEnrollments = true;

    const params: any = {
      MerchantId: this.merchantId,
    };

    forkJoin({
      students: this.enrollmentService.getStudent(params),
      enrollments: this.enrollmentService.getEnrollment(params),
    }).subscribe({
      next: ({ students, enrollments }) => {
        const studentList: Enrollment[] =
          students.statusCode === 200 && students.data
            ? (Array.isArray(students.data)
                ? students.data
                : [students.data]
              ).map((s, i) => this.mapStudentToEnrollment(s, i))
            : [];

        const enrollmentList =
          enrollments.statusCode === 200 && enrollments.data
            ? Array.isArray(enrollments.data)
              ? enrollments.data
              : [enrollments.data]
            : [];

        let merged = this.mergeEnrollmentsWithStudents(
          studentList,
          enrollmentList,
        );

        if (this.searchQuery && this.searchFilter) {
          merged = merged.filter((e) =>
            (e as any)[this.searchFilter]
              ?.toString()
              .toLowerCase()
              .includes(this.searchQuery.toLowerCase()),
          );
        }

        if (this.searchSession) {
          merged = merged.filter(
            (e) => e.academicSession === this.searchSession,
          );
        }

        if (this.searchTerm) {
          merged = merged.filter((e) => e.academicTerm === this.searchTerm);
        }

        if (this.searchClasses) {
          merged = merged.filter((e) => e.classId === this.searchClasses);
        }

        this.enrollments = merged;
        this.loadingEnrollments = false;
      },
      error: (err) => {
        console.error('Load students error:', err);
        this.enrollments = [];
        this.loadingEnrollments = false;
      },
    });
  }

  syncSelectedStudents(): void {
    this.selectedStudents = this.enrollments.filter(
      (s) => s.selected && !this.isStudentEnrolled(s),
    );

    this.isHeaderChecked =
      this.unenrolledStudents.length > 0 &&
      this.unenrolledStudents.every((s) => s.selected);
  }

  private mergeEnrollmentsWithStudents(
    students: Enrollment[],
    enrollments: any[],
  ): Enrollment[] {
    return students.map((student) => {
      const enrollment = enrollments.find(
        (e) => e.studentId === student.studentId,
      );

      if (!enrollment) {
        return {
          ...student,
          status: 'DISABLED',
        };
      }

      return {
        ...student,
        enrollmentId: enrollment.enrollmentId ?? '',
        programmeId: enrollment.programmeId ?? '',
        academicSession: enrollment.academicSession ?? '',
        academicTerm: enrollment.academicTerm ?? '',
        classId: enrollment.classId ?? '',
        subClassId: enrollment.subClassId ?? '',
        enrollmentDate: enrollment.enrollmentDate
          ? new Date(enrollment.enrollmentDate).toLocaleDateString()
          : '',
        status:
          enrollment.enrolmentStatus === 'ENABLED' ? 'ENABLED' : 'DISABLED',
      };
    });
  }

  mapStudentToEnrollment(data: any, index: number): Enrollment {
    const studentName =
      data.studentName ||
      data.fullname ||
      [data.firstname, data.middlename, data.lastname]
        .filter(Boolean)
        .join(' ') ||
      '—';

    return {
      id: data.recId ?? index + 1,
      enrollmentId: '',
      studentId: data.studentId ?? '',
      studentName,

      programmeId: '',
      academicSession: '',
      academicTerm: '',
      classId: '',
      subClassId: '',

      enrollmentDate: '',
      status: 'DISABLED',
    };
  }

  onSearch(): void {
    console.log('Search triggered');
    this.loadStudents();
  }

  initializeForm(): void {
    this.enrollmentForm = this.fb.group({
      merchantId: [this.merchantId],
      enrollmentId: ['', Validators.required],
      studentId: ['', Validators.required],
      programmeId: ['', Validators.required],
      academicSession: ['', Validators.required],
      academicTerm: ['', Validators.required],
      classId: ['', Validators.required],
      subClassId: [''],
      enrollmentDate: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      enrolmentStatus: ['ENABLED', Validators.required],
    });
  }

  initializeColumns(): void {
    this.columns = [
      {
        field: 'select',
        header: '',
        width: '50px',
        isHeaderCheckbox: true,
      },
      {
        field: 'studentId',
        header: 'Student ID',
        sortable: true,
        width: '120px',
      },
      {
        field: 'enrollmentId',
        header: 'Enrollment ID',
        sortable: true,
        width: '140px',
      },
      { field: 'studentName', header: 'Student Name', sortable: true },
      {
        field: 'programmeId',
        header: 'Programme',
        sortable: true,
        width: '120px',
      },
      {
        field: 'academicSession',
        header: 'Session',
        sortable: true,
        width: '120px',
      },
      { field: 'academicTerm', header: 'Term', sortable: true, width: '100px' },
      { field: 'classId', header: 'Class', sortable: true, width: '100px' },
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
        command: (enrollment: Enrollment) => this.onEdit(enrollment),
      },
      {
        label: 'Update Status',
        icon: 'toggle-right',
        command: (enrollment: Enrollment) => this.onUpdateStatus(enrollment),
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (enrollment: Enrollment) => this.onDelete(enrollment),
      },
    ];
  }

  onNewEnrollment(): void {
    this.isEditMode = false;
    this.currentEnrollment = null;
    this.isModalOpen = true;

    this.enrollmentForm.reset({
      merchantId: this.merchantId,
      enrolmentStatus: 'ENABLED',
      enrollmentDate: new Date().toISOString().split('T')[0],
    });

    if (this.selectedStudents.length === 1) {
      const selectedStudent = this.selectedStudents[0];

      setTimeout(() => {
        this.enrollmentForm.patchValue({
          studentId: selectedStudent.studentId,
        });
      }, 0);
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentEnrollment = null;
    this.enrollmentForm.reset();
  }

  handleSubmit(): void {
    if (this.enrollmentForm.invalid) {
      this.markFormGroupTouched(this.enrollmentForm);
      return;
    }

    if (this.isEditMode) {
      this.updateEnrollment();
    } else {
      this.createEnrollment();
    }
  }

  createEnrollment(): void {
    if (!this.selectedStudents.length) {
      this.confirmService.showError(
        'No students selected',
        'Please select at least one unenrolled student',
      );
      return;
    }

    this.isLoading = true;

    // Converting enrollment date to ISO string
    const enrollmentDate = new Date(
      this.enrollmentForm.value.enrollmentDate,
    ).toISOString();

    // Mapping selected students into an array of NewEnrollment objects
    const payload: NewEnrollment[] = this.selectedStudents.map((student) => ({
      merchantId: this.merchantId,
      enrollmentId: '',
      studentId: student.studentId,
      programmeId: this.enrollmentForm.value.programmeId,
      academicSession: this.enrollmentForm.value.academicSession,
      academicTerm: this.enrollmentForm.value.academicTerm,
      classId: this.enrollmentForm.value.classId,
      subClassId: this.enrollmentForm.value.subClassId || '',
      enrollmentDate,
      enrolmentStatus: 'ENABLED',
    }));

    console.log('Bulk enrollment payload:', payload);

    // Sending a single POST request with the array
    this.enrollmentService.newEnrollment(payload).subscribe({
      next: () => {
        this.confirmService.showSuccess(
          'Success',
          `${payload.length} students enrolled successfully`,
        );

        this.selectedStudents = [];
        this.isHeaderChecked = false;

        this.closeModal();
        this.loadStudents();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Bulk enrollment error:', error);
        this.confirmService.showError(
          'Error',
          error.error?.message ||
            error.message ||
            'An error occurred during bulk enrollment',
        );
        this.isLoading = false;
      },
    });
  }

  updateEnrollment(): void {
    if (this.enrollmentForm.invalid) {
      this.markFormGroupTouched(this.enrollmentForm);
      return;
    }

    this.isLoading = true;

    const payload: UpdateEnrollment = {
      merchantId: this.merchantId,
      enrollmentId: this.enrollmentForm.value.enrollmentId,
      studentId: this.enrollmentForm.value.studentId,
      programmeId: this.enrollmentForm.value.programmeId,
      academicSession: this.enrollmentForm.value.academicSession,
      academicTerm: this.enrollmentForm.value.academicTerm,
      classId: this.enrollmentForm.value.classId,
      subClassId: this.enrollmentForm.value.subClassId || '',
      enrollmentDate: new Date(
        this.enrollmentForm.value.enrollmentDate,
      ).toISOString(),
    };

    console.log('Update payload:', payload);

    this.enrollmentService.updateEnrollment(payload).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.confirmService.showSuccess(
            'Success',
            response.message || 'Enrollment updated successfully!',
          );
          this.closeModal();
          this.loadStudents();
        } else {
          this.confirmService.showError(
            'Error',
            response.message || 'Failed to update enrollment',
          );
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating enrollment:', error);
        this.confirmService.showError(
          'Error',
          error.error?.message ||
            error.message ||
            'An error occurred while updating the enrollment',
        );
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
    const field = this.enrollmentForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onEdit(enrollment: Enrollment): void {
    this.isEditMode = true;
    this.currentEnrollment = enrollment;
    this.isModalOpen = true;

    // Convert enrollment date to YYYY-MM-DD format for the date input
    let enrollmentDate = '';
    if (enrollment.enrollmentDate) {
      try {
        const date = new Date(enrollment.enrollmentDate);
        if (!isNaN(date.getTime())) {
          enrollmentDate = date.toISOString().split('T')[0];
        }
      } catch (e) {
        enrollmentDate = '';
      }
    }

    this.enrollmentForm.patchValue({
      merchantId: this.merchantId,
      enrollmentId: enrollment.enrollmentId,
      studentId: enrollment.studentId,
      programmeId: enrollment.programmeId,
      academicSession: enrollment.academicSession,
      academicTerm: enrollment.academicTerm,
      classId: enrollment.classId,
      subClassId: enrollment.subClassId,
      enrollmentDate: enrollmentDate || new Date().toISOString().split('T')[0],
      enrolmentStatus: enrollment.status,
    });
  }

  onUpdateStatus(enrollment: Enrollment): void {
    this.selectedEnrollment = enrollment;
    this.isStatusModalOpen = true;
  }

  closeStatusModal(): void {
    this.isStatusModalOpen = false;
    this.selectedEnrollment = null;
  }

  async toggleEnrollmentStatus(): Promise<void> {
    if (!this.selectedEnrollment) return;

    const newStatus =
      this.selectedEnrollment.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';

    const confirmed = await this.confirmService.confirmSubmit(
      `Are you sure you want to ${
        newStatus === 'ENABLED' ? 'enable' : 'disable'
      } this enrollment?`,
      'Update Enrollment Status',
    );

    if (!confirmed) return;

    this.isLoading = true;

    const statusData: UpdateEnrollmentStatus = {
      merchantId: this.merchantId,
      enrollmentId: this.selectedEnrollment.enrollmentId,
      studentId: this.selectedEnrollment.studentId,
      studentName: this.selectedEnrollment.studentName,
      programmeId: this.selectedEnrollment.programmeId,
      academicSession: this.selectedEnrollment.academicSession,
      academicTerm: this.selectedEnrollment.academicTerm,
      classId: this.selectedEnrollment.classId,
      subClassId: this.selectedEnrollment.subClassId || '',
      enrolmentStatus: newStatus,
    };

    console.log('Sending status payload:', statusData);

    this.enrollmentService.updateEnrollmentStatus(statusData).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.confirmService.showSuccess(
            'Success',
            'Enrollment status updated successfully!',
          );

          this.selectedEnrollment!.status = newStatus;

          this.closeStatusModal();
          this.loadStudents();
        } else {
          this.confirmService.showError(
            'Error',
            response.message || 'Failed to update status',
          );
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Status update error:', error);
        this.confirmService.showError(
          'Error',
          error.error?.message || 'Error updating enrollment status',
        );
        this.isLoading = false;
      },
    });
  }

  async onDelete(enrollment: Enrollment): Promise<void> {
    const confirmed = await this.confirmService.confirmSubmit(
      `Are you sure you want to delete this enrollment?\n\nEnrollment ID: ${enrollment.enrollmentId}\nStudent ID: ${enrollment.studentId}\n\nThis action cannot be undone.`,
      'Delete Enrollment',
    );

    if (!confirmed) {
      return;
    }

    this.loadingEnrollments = true;
    const deleteData: DeleteEnrollment = {
      merchantId: this.merchantId,
      enrollmentId: enrollment.enrollmentId,
      studentId: enrollment.studentId,
      studentName: enrollment.studentName,
      programmeId: enrollment.programmeId,
      academicSession: enrollment.academicSession,
      academicTerm: enrollment.academicTerm,
      classId: enrollment.classId,
      subClassId: enrollment.subClassId,
      enrolmentStatus: enrollment.status,
    };

    this.enrollmentService.deleteEnrollment(deleteData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess(
            'Success',
            response.message || 'Enrollment deleted successfully!',
          );
          this.loadStudents();
        } else {
          this.confirmService.showError(
            'Error',
            response.message || 'Failed to delete enrollment',
          );
          this.loadingEnrollments = false;
        }
      },
      error: (error) => {
        console.error('Error deleting enrollment:', error);
        this.confirmService.showError(
          'Error',
          error.error?.message ||
            error.message ||
            'An error occurred while deleting the enrollment',
        );
        this.loadingEnrollments = false;
      },
    });
  }

  debugSelection(): void {
    console.log('=== DEBUG SELECTION ===');
    console.log('Total enrollments:', this.enrollments.length);
    console.log('Selected students:', this.selectedStudents.length);

    const enrolled = this.enrollments.filter((s) => this.isStudentEnrolled(s));
    const unenrolled = this.enrollments.filter(
      (s) => !this.isStudentEnrolled(s),
    );

    console.log('Enrolled students:', enrolled.length);
    console.log('Unenrolled students:', unenrolled.length);

    console.log('areAllSelected() returns:', this.areAllSelected());

    // Check each student
    this.enrollments.forEach((student) => {
      console.log(
        `Student ${student.studentId}: ` +
          `Status=${student.status}, ` +
          `Enrolled=${this.isStudentEnrolled(student)}, ` +
          `Selected=${this.isSelected(student)}`,
      );
    });
  }
}
