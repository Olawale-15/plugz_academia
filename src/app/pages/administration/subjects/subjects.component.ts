import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { PrimeTableComponent, TableColumn, TableAction } from '../../../../shared/prime-table/prime-table.component';
import { AdministrationService } from '../../../core/services/administration.service';
import { UserContextService } from '../../../core/services/user-context';
import { ConfirmService } from '../../../core/services/confirm.service';
import { LookupService } from '../../../core/services/lookup.service';
import { NewSubject, UpdateSubject, DeleteSubject } from '../../../core/models/administration.model';

interface Subject {
  id: number;
  merchantId: string;
  subjectId: string;
  subjectName: string;
  parentSubjectId: string;
  percentageOfParent: number;
  createdBy: string;
  dateCreated: string;
  editedBy: string;
  dateEdited: string;
}

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, IconComponent, ModalComponent, PrimeTableComponent],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.css'
})
export class SubjectsComponent implements OnInit {
  searchQuery: string = '';
  searchFilter: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];
  isModalOpen = false;
  subjectForm!: FormGroup;
  isLoading = false;
  loadingSubjects = false;
  merchantId = '';
  isEditMode = false;
  currentSubject: Subject | null = null;

  subjects: Subject[] = [];
  availableSubjects: any[] = [];
  loadingAvailableSubjects = false;

  searchFilters = [
    { value: '', label: 'Search by...' },
    { value: 'subjectId', label: 'Subject ID' },
    { value: 'subjectName', label: 'Subject Name' }
  ];

  get filteredSubjects(): Subject[] {
    return this.subjects;
  }

  constructor(
    private fb: FormBuilder,
    private administrationService: AdministrationService,
    private userContext: UserContextService,
    private confirmService: ConfirmService,
    private lookupService: LookupService
  ) {
    this.merchantId = this.userContext.merchantId || '';
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeActions();
    this.initializeForm();
    this.loadSubjects();
    this.loadAvailableSubjects();
  }

  loadSubjects(): void {
    this.loadingSubjects = true;
    const params: any = {
      MerchantId: this.merchantId
    };

    if (this.searchQuery && this.searchQuery.trim() && this.searchFilter) {
      params[this.searchFilter.charAt(0).toUpperCase() + this.searchFilter.slice(1)] = this.searchQuery.trim();
    }

    this.administrationService.getSubject(params).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          this.subjects = Array.isArray(response.data)
            ? response.data.map(s => this.mapSubjectData(s))
            : [this.mapSubjectData(response.data)];
        } else {
          this.subjects = [];
          console.warn('No subjects found:', response.message);
        }
        this.loadingSubjects = false;
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
        this.subjects = [];
        this.loadingSubjects = false;
      }
    });
  }

  mapSubjectData(data: any): Subject {
    return {
      id: data.recId || 0,
      merchantId: data.merchantId || '',
      subjectId: data.subjectId || '',
      subjectName: data.subjectName || '',
      parentSubjectId: data.parentSubjectId || '',
      percentageOfParent: data.percentageOfParent || 0,
      createdBy: data.createdBy || '',
      dateCreated: data.dateCreated || '',
      editedBy: data.editedBy || '',
      dateEdited: data.dateEdited || ''
    };
  }

  onSearch(): void {
    this.loadSubjects();
  }

  loadAvailableSubjects(): void {
    this.loadingAvailableSubjects = true;
    this.lookupService.getSubjects(this.merchantId).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          this.availableSubjects = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          this.availableSubjects = [];
        }
        this.loadingAvailableSubjects = false;
      },
      error: (error) => {
        console.error('Error loading available subjects:', error);
        this.availableSubjects = [];
        this.loadingAvailableSubjects = false;
      }
    });
  }

  initializeForm(): void {
    this.subjectForm = this.fb.group({
      merchantId: [this.merchantId],
      subjectId: ['', Validators.required],
      subjectName: ['', Validators.required],
      parentSubjectId: [''],
      percentageOfParent: [0]
    });
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'subjectId', header: 'Subject ID', sortable: true, width: '150px' },
      { field: 'subjectName', header: 'Subject Name', sortable: true },
      { field: 'parentSubjectId', header: 'Parent Subject ID', sortable: true, width: '180px' },
      { field: 'percentageOfParent', header: '% of Parent', sortable: true, width: '120px' },
      { field: 'createdBy', header: 'Created By', sortable: true, width: '150px' },
      { field: 'dateCreated', header: 'Date Created', sortable: true, width: '180px' }
    ];
  }

  initializeActions(): void {
    this.actions = [
      {
        label: 'Update subject',
        icon: 'edit-2',
        command: (subject: Subject) => this.onEdit(subject)
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (subject: Subject) => this.onDelete(subject)
      }
    ];
  }

  onNewSubject(): void {
    this.isEditMode = false;
    this.currentSubject = null;
    this.isModalOpen = true;
    this.subjectForm.reset({
      merchantId: this.merchantId,
      percentageOfParent: 0
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentSubject = null;
    this.subjectForm.reset();
  }

  handleSubmit(): void {
    if (this.subjectForm.invalid) {
      this.markFormGroupTouched(this.subjectForm);
      return;
    }

    if (this.isEditMode) {
      this.updateSubject();
    } else {
      this.createSubject();
    }
  }

  createSubject(): void {
    this.isLoading = true;
    const formData: NewSubject = this.subjectForm.value;

    this.administrationService.newSubject(formData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess('Success', response.message || 'Subject created successfully');
          this.closeModal();
          this.loadSubjects();
        } else {
          this.confirmService.showError('Error', response.message || 'Failed to create subject');
          this.loadSubjects();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating subject:', error);
        this.confirmService.showError('Error', error.error?.message || error.message || 'An error occurred while creating the subject');
        this.loadSubjects();
        this.isLoading = false;
      }
    });
  }

  updateSubject(): void {
    this.isLoading = true;
    const formData: UpdateSubject = this.subjectForm.value;

    this.administrationService.updateSubject(formData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess('Success', response.message || 'Subject updated successfully');
          this.closeModal();
          this.loadSubjects();
        } else {
          this.confirmService.showError('Error', response.message || 'Failed to update subject');
          this.loadSubjects();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating subject:', error);
        this.confirmService.showError('Error', error.error?.message || error.message || 'An error occurred while updating the subject');
        this.loadSubjects();
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
    const field = this.subjectForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onEdit(subject: Subject): void {
    this.isEditMode = true;
    this.currentSubject = subject;
    this.isModalOpen = true;

    this.subjectForm.patchValue({
      merchantId: this.merchantId,
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      parentSubjectId: subject.parentSubjectId,
      percentageOfParent: subject.percentageOfParent
    });
  }

  async onDelete(subject: Subject): Promise<void> {
    const confirmed = await this.confirmService.confirmSubmit(
      `Are you sure you want to delete this subject?\n\nSubject ID: ${subject.subjectId}\nSubject Name: ${subject.subjectName}\n\nThis action cannot be undone.`,
      'Delete Subject'
    );

    if (!confirmed) {
      return;
    }

    this.loadingSubjects = true;
    const deleteData: DeleteSubject = {
      merchantId: this.merchantId,
      subjectId: subject.subjectId
    };

    this.administrationService.deleteSubject(deleteData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess('Success', response.message || 'Subject deleted successfully');
          this.loadSubjects();
        } else {
          this.confirmService.showError('Error', response.message || 'Failed to delete subject');
          this.loadingSubjects = false;
        }
      },
      error: (error) => {
        console.error('Error deleting subject:', error);
        this.confirmService.showError('Error', error.error?.message || error.message || 'An error occurred while deleting the subject');
        this.loadingSubjects = false;
      }
    });
  }
}
