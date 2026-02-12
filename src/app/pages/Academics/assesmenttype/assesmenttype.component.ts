import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { PrimeTableComponent, TableColumn, TableAction } from '../../../../shared/prime-table/prime-table.component';
import { AcademicService } from '../../../core/services/academic.service';
import { UserContextService } from '../../../core/services/user-context';
import { ConfirmService } from '../../../core/services/confirm.service';
import { newAssessmentType, UpdateAssessmentType, DeleteAssessmentType } from '../../../core/models/academics.model';

interface AssessmentType {
  id: number;
  merchantId: string;
  assessmentId: string;
  assessmentName: string;
  weightPercentage: number;
  createdBy: string;
  dateCreated: string;
  editedBy: string;
  dateEdited: string;
}

@Component({
  selector: 'app-assesmenttype',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, IconComponent, ModalComponent, PrimeTableComponent],
  templateUrl: './assesmenttype.component.html',
  styleUrl: './assesmenttype.component.css'
})
export class AssesmenttypeComponent implements OnInit {
  searchQuery: string = '';
  searchFilter: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];
  isModalOpen = false;
  assessmentForm!: FormGroup;
  isLoading = false;
  loadingAssessments = false;
  merchantId = '';
  isEditMode = false;
  currentAssessment: AssessmentType | null = null;

  assessmentTypes: AssessmentType[] = [];

  searchFilters = [
    { value: '', label: 'Search by...' },
    { value: 'assessmentId', label: 'Assessment ID' },
    { value: 'assessmentName', label: 'Assessment Name' }
  ];

  get filteredAssessmentTypes(): AssessmentType[] {
    return this.assessmentTypes;
  }

  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService,
    private userContext: UserContextService,
    private confirmService: ConfirmService
  ) {
    this.merchantId = this.userContext.merchantId || '';
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeActions();
    this.initializeForm();
    this.loadAssessmentTypes();
  }

  loadAssessmentTypes(): void {
    this.loadingAssessments = true;
    const params: any = {
      MerchantId: this.merchantId
    };

    if (this.searchQuery && this.searchQuery.trim() && this.searchFilter) {
      params[this.searchFilter.charAt(0).toUpperCase() + this.searchFilter.slice(1)] = this.searchQuery.trim();
    }

    this.academicService.getAssessmentType(params).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          this.assessmentTypes = Array.isArray(response.data)
            ? response.data.map(a => this.mapAssessmentData(a))
            : [this.mapAssessmentData(response.data)];
        } else {
          this.assessmentTypes = [];
          console.warn('No assessment types found:', response.message);
        }
        this.loadingAssessments = false;
      },
      error: (error) => {
        console.error('Error loading assessment types:', error);
        this.assessmentTypes = [];
        this.loadingAssessments = false;
      }
    });
  }

  mapAssessmentData(data: any): AssessmentType {
    return {
      id: data.recId || 0,
      merchantId: data.merchantId || '',
      assessmentId: data.assessmentId || '',
      assessmentName: data.assessmentName || '',
      weightPercentage: data.weightPercentage || 0,
      createdBy: data.createdBy || '',
      dateCreated: data.dateCreated || '',
      editedBy: data.editedBy || '',
      dateEdited: data.dateEdited || ''
    };
  }

  onSearch(): void {
    this.loadAssessmentTypes();
  }

  initializeForm(): void {
    this.assessmentForm = this.fb.group({
      merchantId: [this.merchantId],
      assessmentId: ['', Validators.required],
      assessmentName: ['', Validators.required],
      weightPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'assessmentId', header: 'Assessment ID', sortable: true, width: '150px' },
      { field: 'assessmentName', header: 'Assessment Name', sortable: true },
      { field: 'weightPercentage', header: 'Weight (%)', sortable: true, width: '120px' },
      { field: 'createdBy', header: 'Created By', sortable: true, width: '150px' },
      { field: 'dateCreated', header: 'Date Created', sortable: true, width: '180px' }
    ];
  }

  initializeActions(): void {
    this.actions = [
      {
        label: 'Update assessment type',
        icon: 'edit-2',
        command: (assessment: AssessmentType) => this.onEdit(assessment)
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (assessment: AssessmentType) => this.onDelete(assessment)
      }
    ];
  }

  onNewAssessmentType(): void {
    this.isEditMode = false;
    this.currentAssessment = null;
    this.isModalOpen = true;
    this.assessmentForm.reset({
      merchantId: this.merchantId,
      weightPercentage: 0
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentAssessment = null;
    this.assessmentForm.reset();
  }

  handleSubmit(): void {
    if (this.assessmentForm.invalid) {
      this.markFormGroupTouched(this.assessmentForm);
      return;
    }

    if (this.isEditMode) {
      this.updateAssessmentType();
    } else {
      this.createAssessmentType();
    }
  }

  createAssessmentType(): void {
    this.isLoading = true;
    const formData: newAssessmentType = this.assessmentForm.value;

    this.academicService.newAssessmentType(formData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess('Success', response.message || 'Assessment type created successfully!');
          this.closeModal();
          this.loadAssessmentTypes();
        } else {
          this.confirmService.showError('Error', response.message || 'Failed to create assessment type');
          this.loadAssessmentTypes();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating assessment type:', error);
        this.confirmService.showError('Error', error.error?.message || error.message || 'An error occurred while creating the assessment type');
        this.loadAssessmentTypes();
        this.isLoading = false;
      }
    });
  }

  updateAssessmentType(): void {
    this.isLoading = true;
    const formData: UpdateAssessmentType = this.assessmentForm.value;

    this.academicService.updateAssessmentType(formData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess('Success', response.message || 'Assessment type updated successfully!');
          this.closeModal();
          this.loadAssessmentTypes();
        } else {
          this.confirmService.showError('Error', response.message || 'Failed to update assessment type');
          this.loadAssessmentTypes();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating assessment type:', error);
        this.confirmService.showError('Error', error.error?.message || error.message || 'An error occurred while updating the assessment type');
        this.loadAssessmentTypes();
        this.isLoading = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.assessmentForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onEdit(assessment: AssessmentType): void {
    this.isEditMode = true;
    this.currentAssessment = assessment;
    this.isModalOpen = true;

    this.assessmentForm.patchValue({
      merchantId: this.merchantId,
      assessmentId: assessment.assessmentId,
      assessmentName: assessment.assessmentName,
      weightPercentage: assessment.weightPercentage
    });
  }

  async onDelete(assessment: AssessmentType): Promise<void> {
    const confirmed = await this.confirmService.confirmSubmit(
      `Are you sure you want to delete this assessment type?\n\nAssessment ID: ${assessment.assessmentId}\nAssessment Name: ${assessment.assessmentName}\n\nThis action cannot be undone.`,
      'Delete Assessment Type'
    );

    if (!confirmed) {
      return;
    }

    this.loadingAssessments = true;
    const deleteData: DeleteAssessmentType = {
      merchantId: this.merchantId,
      assessmentId: assessment.assessmentId
    };

    this.academicService.deleteAssessmentType(deleteData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess('Success', response.message || 'Assessment type deleted successfully!');
          this.loadAssessmentTypes();
        } else {
          this.confirmService.showError('Error', response.message || 'Failed to delete assessment type. Type may have assessment records.');
          this.loadingAssessments = false;
        }
      },
      error: (error) => {
        console.error('Error deleting assessment type:', error);
        this.confirmService.showError('Error', error.error?.message || error.message || 'An error occurred while deleting the assessment type. Type may have assessment records.');
        this.loadingAssessments = false;
      }
    });
  }
}
