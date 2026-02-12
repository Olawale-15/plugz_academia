import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrimeTableComponent } from '../../../../shared/prime-table/prime-table.component';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { SettingsService } from '../../../core/services/settings.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { UserContextService } from '../../../core/services/user-context';
import { LookupService } from '../../../core/services/lookup.service';
import { NewDynamicField, UpdateDynamicField, DeleteDynamicField, DynamicFieldResponse } from '../../../core/models/settings.model';

interface DynamicField {
  id?: number;
  merchantId: string;
  referenceId: string;
  referenceName: string;
  metaDataType: string;
  createdBy: string;
  dateCreated: string;
  editedBy: string;
  dateEdited: string;
}

@Component({
  selector: 'app-dynamicfields',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeTableComponent,
    IconComponent,
    ModalComponent
  ],
  templateUrl: './dynamicfields.component.html',
  styleUrl: './dynamicfields.component.css'
})
export class DynamicfieldsComponent implements OnInit {
  dynamicFields: DynamicField[] = [];
  filteredDynamicFields: DynamicField[] = [];
  searchQuery: string = '';
  searchFilter: string = '';

  dynamicTypes: any[] = [];

  isModalOpen = false;
  dynamicFieldForm!: FormGroup;
  isLoading = false;
  loadingDynamicFields = false;
  merchantId: string = '';
  isEditMode = false;
  currentDynamicField: DynamicField | null = null;

  columns = [
    { field: 'referenceId', header: 'Reference ID' },
    { field: 'referenceName', header: 'Reference Name' },
    { field: 'metaDataType', header: 'Meta Data Type' },
    { field: 'createdBy', header: 'Created By' },
    { field: 'dateCreated', header: 'Date Created' }
  ];

  actions = [
    {
      label: 'Edit',
      icon: 'edit',
      command: (rowData: DynamicField) => this.onEdit(rowData)
    },
    {
      label: 'Delete',
      icon: 'trash-2',
      command: (rowData: DynamicField) => this.onDelete(rowData)
    }
  ];

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private confirmService: ConfirmService,
    private userContextService: UserContextService,
    private lookupService: LookupService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.merchantId = this.userContextService.merchantId || '';
    this.loadDynamicTypes();
  }

  initializeForm(): void {
    this.dynamicFieldForm = this.fb.group({
      merchantId: ['', Validators.required],
      referenceId: ['', Validators.required],
      referenceName: ['', Validators.required],
      metaDataType: ['', Validators.required]
    });
  }

  loadDynamicTypes(): void {
    this.lookupService.getDynamicTypes().subscribe({
      next: (response) => {
        if ((response.status?.toLowerCase() === 'success' || response.statusCode === 200) && response.data) {
          // Map to extract referenceId values for dropdown
          this.dynamicTypes = response.data.map((item: any) => item.referenceId);
        }
      },
      error: (error) => {
        console.error('Error loading dynamic types:', error);
      }
    });
  }

  loadDynamicFields(): void {
    // MetaDataType is required
    if (!this.searchFilter) {
      this.filteredDynamicFields = [];
      return;
    }

    this.loadingDynamicFields = true;

    const params: any = {
      MerchantId: this.merchantId,
      MetaDataType: this.searchFilter
    };

    // Only add ReferenceId if user typed something
    if (this.searchQuery) {
      params.ReferenceId = this.searchQuery;
    }

    this.settingsService.getDynamicFields(params).subscribe({
      next: (response) => {
        if ((response.status?.toLowerCase() === 'success' || response.statusCode === 200) && response.data) {
          this.dynamicFields = response.data.map(this.mapDynamicFieldData);
          this.filteredDynamicFields = [...this.dynamicFields];
        }
        this.loadingDynamicFields = false;
      },
      error: (error) => {
        console.error('Error loading dynamic fields:', error);
        this.loadingDynamicFields = false;
      }
    });
  }

  private mapDynamicFieldData(data: DynamicFieldResponse): DynamicField {
    return {
      merchantId: data.merchantId,
      referenceId: data.referenceId,
      referenceName: data.referenceName,
      metaDataType: data.metaDataType,
      createdBy: data.createdBy,
      dateCreated: data.dateCreated,
      editedBy: data.editedBy,
      dateEdited: data.dateEdited
    };
  }

  onMetaDataTypeChange(): void {
    // Clear search query when changing meta data type
    this.searchQuery = '';
    // Auto-populate table when meta data type is selected
    this.loadDynamicFields();
  }

  onSearch(): void {
    this.loadDynamicFields();
  }

  onNewDynamicField(): void {
    this.isEditMode = false;
    this.currentDynamicField = null;
    this.dynamicFieldForm.reset({
      merchantId: this.merchantId,
      referenceId: '',
      referenceName: '',
      metaDataType: ''
    });
    this.isModalOpen = true;
  }

  onEdit(dynamicField: DynamicField): void {
    this.isEditMode = true;
    this.currentDynamicField = dynamicField;
    this.dynamicFieldForm.patchValue({
      merchantId: dynamicField.merchantId,
      referenceId: dynamicField.referenceId,
      referenceName: dynamicField.referenceName,
      metaDataType: dynamicField.metaDataType
    });
    this.isModalOpen = true;
  }

  async onDelete(dynamicField: DynamicField): Promise<void> {
    const confirmed = await this.confirmService.confirmSubmit(
      `Are you sure you want to delete "${dynamicField.referenceName}"? This action cannot be undone.`,
      'Delete Dynamic Field'
    );

    if (!confirmed) return;

    const deleteData: DeleteDynamicField = {
      merchantId: dynamicField.merchantId,
      metaDataType: dynamicField.metaDataType,
      referenceId: dynamicField.referenceId
    };

    this.settingsService.deleteDynamicField(deleteData).subscribe({
      next: (response) => {
        if (response.status?.toLowerCase() === 'success' || response.statusCode === 200) {
          this.confirmService.showSuccess('Success', response.message || 'Dynamic field deleted successfully!');
          this.loadDynamicFields();
        } else {
          this.confirmService.showError('Error', response.message || 'Failed to delete dynamic field');
        }
      },
      error: (error) => {
        this.confirmService.showError('Error', error.error?.message || error.message || 'An error occurred while deleting the dynamic field');
      }
    });
  }

  handleSubmit(): void {
    if (this.dynamicFieldForm.invalid) {
      Object.keys(this.dynamicFieldForm.controls).forEach(key => {
        this.dynamicFieldForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.isEditMode) {
      this.updateDynamicField();
    } else {
      this.createDynamicField();
    }
  }

  createDynamicField(): void {
    this.isLoading = true;
    const newDynamicField: NewDynamicField = this.dynamicFieldForm.value;

    this.settingsService.newDynamicField(newDynamicField).subscribe({
      next: (response) => {
        if (response.status?.toLowerCase() === 'success' || response.statusCode === 200) {
          this.confirmService.showSuccess('Success', response.message || 'Dynamic field created successfully!');
          this.closeModal();
          this.loadDynamicFields();
        } else {
          this.confirmService.showError('Error', response.message || 'Failed to create dynamic field');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.confirmService.showError('Error', error.error?.message || error.message || 'An error occurred while creating the dynamic field');
        this.isLoading = false;
      }
    });
  }

  updateDynamicField(): void {
    this.isLoading = true;
    const updateData: UpdateDynamicField = this.dynamicFieldForm.value;

    this.settingsService.updateDynamicField(updateData).subscribe({
      next: (response) => {
        if (response.status?.toLowerCase() === 'success' || response.statusCode === 200) {
          this.confirmService.showSuccess('Success', response.message || 'Dynamic field updated successfully!');
          this.closeModal();
          this.loadDynamicFields();
        } else {
          this.confirmService.showError('Error', response.message || 'Failed to update dynamic field');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.confirmService.showError('Error', error.error?.message || error.message || 'An error occurred while updating the dynamic field');
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.dynamicFieldForm.reset();
    this.isEditMode = false;
    this.currentDynamicField = null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.dynamicFieldForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
