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
import { UserContextService } from '../../../core/services/user-context';
import { ConfirmService } from '../../../core/services/confirm.service';
import {
  NewGrading,
  UpdateGrade,
  GetGradeParams,
  DeleteGradeParams
} from '../../../core/models/grade.model';
import { GradeService } from '../../../core/services/grade.service';
import { LookupService } from '../../../core/services/lookup.service';

interface GradingSystem {
  id: number;
  merchantId: string;
  gradeId: string;
  programmeId: string;
  minMark: number;
  maxMark: number;
  gradePoint: number;
  remarks: string;
  createdBy: string;
  dateCreated: string;
  editedBy: string;
  dateEdited: string;
}

@Component({
  selector: 'app-gradingsystem',
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
  templateUrl: './gradingsystem.component.html',
  styleUrl: './gradingsystem.component.css',
})
export class GradingsystemComponent implements OnInit {
  searchQuery: string = '';
  searchFilter: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];
  isModalOpen = false;
  gradingForm!: FormGroup;
  isLoading = false;
  loadingGrades = false;
  merchantId = '';
  isEditMode = false;
  currentGrade: GradingSystem | null = null;

  grades: GradingSystem[] = [];

  searchFilters = [
    { value: '', label: 'Search by...' },
    { value: 'gradeId', label: 'Grade ID' },
  ];

  get filteredGrades(): GradingSystem[] {
    if (!this.searchQuery || !this.searchFilter) {
      return this.grades;
    }

    return this.grades.filter((grade) => {
      const value = (grade as any)[this.searchFilter];
      return value
        ?.toString()
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
    });
  }

  // LookUp Data
  programmes: any[] = [];
  loadingLookUps = false;


  constructor(
    private fb: FormBuilder,
    private userContext: UserContextService,
    private confirmService: ConfirmService,
    private gradeService: GradeService,
    private lookUpService: LookupService,
  ) {
    this.merchantId = this.userContext.merchantId || '';
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeActions();
    this.initializeForm();

    // MerchantId already exists here (used by loadGrades)
    if (!this.merchantId) {
      console.error('MerchantId is not set');
      return;
    }

    this.loadGrades();
    console.log('MerchantId used for lookup:', this.merchantId);
    this.loadLookUps();
  }

  loadLookUps(): void {
    if (!this.merchantId) {
      console.error('MerchantId not set — cannot fetch programmes');
      return;
    }

    console.log('Fetching programmes for MerchantId:', this.merchantId);

    this.loadingLookUps = true;
    this.lookUpService.getProgramme(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          this.programmes = res.data;
          console.log('Programmes loaded:', this.programmes);
        } else {
          this.programmes = [];
          console.warn('No programme found for MerchantId:', this.merchantId);
        }
        this.loadingLookUps = false;
      },
      error: (err) => {
        console.error('Error fetching programmes:', err);
        this.programmes = [];
        this.loadingLookUps = false;
      },
    });
  }

  loadGrades(): void {
    this.loadingGrades = true;
    const params: any = {
      MerchantId: this.merchantId,
    };

    this.gradeService.getGrade(params).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          this.grades = Array.isArray(response.data)
            ? response.data.map((g: any) => ({
                ...g,
                id: g.recId,
              }))
            : [{ ...response.data, id: response.data.recId }];
        } else {
          this.grades = [];
        }
        this.loadingGrades = false;
      },
      error: (error) => {
        this.grades = [];
        this.loadingGrades = false;
      },
    });
  }

  initializeForm(): void {
    this.gradingForm = this.fb.group({
      merchantId: [this.merchantId],
      gradeId: ['', Validators.required],
      programmeId: ['', Validators.required],
      minMark: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      maxMark: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      gradePoint: [
        0,
        [Validators.required, Validators.min(0), Validators.max(4)],
      ],
      remarks: [''],
    });
  }

initializeColumns(): void {
  this.columns = [
      {
      field: 'programmeId',
      header: 'Programme',
      sortable: true,
      width: '160px',
    },
    {
      field: 'gradeId',
      header: 'Grade',
      sortable: true,
      width: '90px',
    },
    {
      field: 'minMark',
      header: 'Min Mark',
      sortable: true,
      width: '90px',
    },
    {
      field: 'maxMark',
      header: 'Max Mark',
      sortable: true,
      width: '90px',
    },
    {
      field: 'gradePoint',
      header: 'Point',
      sortable: true,
      width: '100px',
    },
    {
      field: 'remarks',
      header: 'Remark',
      sortable: true,
      width: '220px',   
    },
  
  ];
}

  initializeActions(): void {
    this.actions = [
      {
        label: 'Update grade',
        icon: 'edit-2',
        command: (grade: GradingSystem) => this.onEdit(grade),
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (grade: GradingSystem) => this.onDelete(grade),
      },
    ];
  }

  onNewGrade(): void {
    this.isEditMode = false;
    this.currentGrade = null;
    this.isModalOpen = true;
    this.gradingForm.reset({
      merchantId: this.merchantId,
      minScore: 0,
      maxScore: 0,
      gradePoint: 0,
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentGrade = null;
    this.gradingForm.reset();
  }

  handleSubmit(): void {
    if (this.gradingForm.invalid) {
      this.markFormGroupTouched(this.gradingForm);
      return;
    }

    // Validate score range
    const minMarK = this.gradingForm.get('minMarK')?.value;
    const maxMark = this.gradingForm.get('maxMark')?.value;

    if (minMarK >= maxMark) {
      this.confirmService.showError(
        'Validation Error',
        'Min Score must be less than Max Score',
      );
      return;
    }

    if (this.isEditMode) {
      this.updateGrade();
    } else {
      this.createGrade();
    }
  }

  createGrade(): void {
    // TODO: Implement when endpoint is available
    if (this.gradingForm.invalid) {
      this.markFormGroupTouched(this.gradingForm);
    }
    this.isLoading = true;

    const formData: NewGrading = {
      merchantId: this.merchantId,
      gradeId: this.gradingForm.value.gradeId,
      programmeId: this.gradingForm.value.programmeId,
      minMark: this.gradingForm.value.minMark,
      maxMark: this.gradingForm.value.maxMark,
      gradePoint: this.gradingForm.value.gradePoint,
      remarks: this.gradingForm.value.remarks || '',
    };

    console.log('Payload being sent:', formData);
    this.gradeService.newGrade(formData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess(
            'Success',
            response.message || 'Grade created successfully',
          );

          this.closeModal();
          this.loadGrades();
        } else {
          this.confirmService.showError(
            'Error',
            response.message || 'Failed to create grade',
          );
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.confirmService.showError(
          'Error',
          error.error?.message || 'An error occurred while creating grade',
        );
        this.isLoading = false;
      },
    });
    console.log('CREATE GRADE PAYLOAD ', formData);
  }

  // updateGrade(): void {
  //   // TODO: Implement when endpoint is available
  //   if (this.gradingForm.invalid || !this.currentGrade) {
  //     this.markFormGroupTouched(this.gradingForm);
  //     return;
  //   }

  //   this.loadingGrades = true;

  //   const formData: UpdateGrade = {
  //     recId: this.currentGrade.id,
  //     merchantId: this.merchantId,
  //     gradeId: this.gradingForm.value.gradeId,
  //     programmeId: this.gradingForm.value.programmeId,
  //     minMark: this.gradingForm.value.minScore,
  //     maxMark: this.gradingForm.value.maxScore,
  //     gradePoint: this.gradingForm.value.gradePoint,
  //     remarks: this.gradingForm.value.remark,
  //   };

  //   this.gradeService.updateGrade(formData).subscribe({
  //     next: (response) => {
  //       if (response.statusCode === 200 || response.status === 'success') {
  //         this.confirmService.showSuccess(
  //           'Success',
  //           response.message || 'Grade updated successfully',
  //         );

  //         this.closeModal();
  //         this.loadGrades();
  //       } else {
  //         this.confirmService.showError(
  //           'Error',
  //           response.message || 'Failed to update grade',
  //         );
  //       }

  //       this.isLoading = false;
  //     },
  //     error: (error) => {
  //       this.confirmService.showError(
  //         'Error',
  //         error.error?.message || 'An error occurred while updating grade',
  //       );
  //       this.isLoading = false;
  //     },
  //   });
  // }

  updateGrade(): void {
    if (this.gradingForm.invalid || !this.currentGrade) {
      this.markFormGroupTouched(this.gradingForm);
      return;
    }

    this.isLoading = true;

    const formData: UpdateGrade = {
      recId: this.currentGrade.id, 
      merchantId: this.currentGrade.merchantId,
      programmeId: this.currentGrade.programmeId,
      gradeId: this.currentGrade.gradeId,

      minMark: this.gradingForm.getRawValue().minMark,
      maxMark: this.gradingForm.getRawValue().maxMark,
      gradePoint: this.gradingForm.getRawValue().gradePoint,
      remarks: this.gradingForm.getRawValue().remarks,
    };

    console.log('Payload being sent for update:', formData);

    this.gradeService.updateGrade(formData as UpdateGrade).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess(
            'Success',
            response.message || 'Grade updated successfully',
          );

          this.closeModal();
          this.loadGrades();
        } else {
          this.confirmService.showError(
            'Error',
            response.message || 'Failed to update grade',
          );
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.confirmService.showError(
          'Error',
          error.error?.message || 'An error occurred while updating grade',
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
    const field = this.gradingForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onEdit(grade: GradingSystem): void {
    this.isEditMode = true;
    this.currentGrade = grade; // contains recId already
    this.isModalOpen = true;

    this.gradingForm.patchValue({
      merchantId: grade.merchantId,
      gradeId: grade.gradeId,
      programmeId: grade.programmeId,
      minMark: grade.minMark,
      maxMark: grade.maxMark,
      gradePoint: grade.gradePoint,
      remarks: grade.remarks,
    });
    console.log('Current grade being edited:', this.currentGrade);
  }

  async onDelete(grade: GradingSystem): Promise<void> {
    const confirmed = await this.confirmService.confirmSubmit(
      `Are you sure you want to delete this grade?\n\nGrade ID: ${grade.gradeId}\nGrade Name: ${grade.programmeId}\n\nThis action cannot be undone.`,
      'Delete Grade',
    );

    if (!confirmed) {
      return;
    }

    // TODO: Implement when endpoint is available
    this.loadingGrades = true;
    const deleteData : DeleteGradeParams={
      merchantId: this.merchantId,
      recId: grade.id ?? grade.id,
    }

    this.gradeService.deleteGrade(deleteData).subscribe({
      next:(response) =>{
        if(response.statusCode === 200 || response.status == 'success'){
          this.confirmService.showSuccess('Success', response.message)
          this.loadGrades()
        }else{
          this.confirmService.showError('Error', response.message)
          this.isLoading = false
        }
      },
      error:(err) => {
        console.error('Error occurred while deleting grade', err)
        this.confirmService.showError('Error', err.message)
        this.isLoading = false
      }
    })
  }
}
