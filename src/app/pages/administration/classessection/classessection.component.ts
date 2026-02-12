import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { PrimeTableComponent, TableColumn, TableAction } from '../../../../shared/prime-table/prime-table.component';
import { AdministrationService } from '../../../core/services/administration.service';
import { LookupService } from '../../../core/services/lookup.service';
import { UserContextService } from '../../../core/services/user-context';
import { ConfirmService } from '../../../core/services/confirm.service';
import { NewClassOrSubClass, UpdateClassOrSubClass, DeleteClassOrSubClass } from '../../../core/models/administration.model';

interface ClassSection {
  id: number;
  merchantId: string;
  classId: string;
  className: string;
  subClassId: string;
  createdBy: string;
  dateCreated: string;
  editedBy: string;
  dateEdited: string;
}

@Component({
  selector: 'app-classessection',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, IconComponent, ModalComponent, PrimeTableComponent],
  templateUrl: './classessection.component.html',
  styleUrl: './classessection.component.css'
})
export class ClassessectionComponent implements OnInit {
  searchQuery: string = '';
  searchFilter: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];
  isModalOpen = false;
  classForm!: FormGroup;
  isLoading = false;
  loadingClasses = false;
  merchantId = '';
  isEditMode = false;
  currentClass: ClassSection | null = null;

  // Lookup data - not needed for class creation based on API spec
  // levels: any[] = [];
  // departments: any[] = [];
  // academicSessions: any[] = [];
  // academicTerms: any[] = [];
  // loadingLookups = false;

  classSections: ClassSection[] = [];

  searchFilters = [
    { value: '', label: 'Search by...' },
    { value: 'classId', label: 'Class ID' },
    { value: 'className', label: 'Class Name' }
  ];

  get filteredClassSections(): ClassSection[] {
    return this.classSections;
  }

  constructor(
    private fb: FormBuilder,
    private administrationService: AdministrationService,
    private lookupService: LookupService,
    private userContext: UserContextService,
    private confirmService: ConfirmService
  ) {
    this.merchantId = this.userContext.merchantId || '';
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeActions();
    this.initializeForm();
    // this.loadLookups(); // Not needed - API only requires merchantId, classId, className, subClassId
    this.loadClasses();
  }

  // loadLookups method commented out - API spec only requires merchantId, classId, className, subClassId
  // No lookup fields needed based on the API specification
  /*
  loadLookups(): void {
    this.loadingLookups = true;

    this.lookupService.getLevel(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.levels = Array.isArray(res.data) ? res.data : [res.data];
          console.log("levels", this.levels);
        }
      },
      error: (err) => {
        console.error('Error fetching levels:', err);
        this.loadingLookups = false;
      }
    });

    this.lookupService.getDepartment(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.departments = Array.isArray(res.data) ? res.data : [res.data];
          console.log("departments", this.departments);
        }
      },
      error: (err) => {
        console.error('Error fetching departments:', err);
        this.loadingLookups = false;
      }
    });

    this.lookupService.getAcademicSession(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.academicSessions = Array.isArray(res.data) ? res.data : [res.data];
          console.log("academic sessions", this.academicSessions);
        }
      },
      error: (err) => {
        console.error('Error fetching academic sessions:', err);
        this.loadingLookups = false;
      }
    });

    this.lookupService.getAcademicTerm(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.academicTerms = Array.isArray(res.data) ? res.data : [res.data];
          console.log("academic terms", this.academicTerms);
          this.loadingLookups = false;
        }
      },
      error: (err) => {
        console.error('Error fetching academic terms:', err);
        this.loadingLookups = false;
      }
    });
  }
  */

  // loadClasses(): void {
  //   this.loadingClasses = true;
  //   const params: any = {
  //     MerchantId: this.merchantId
  //   };

  //   if (this.searchQuery && this.searchQuery.trim() && this.searchFilter) {
  //     params[this.searchFilter.charAt(0).toUpperCase() + this.searchFilter.slice(1)] = this.searchQuery.trim();
  //   }

  //   this.administrationService.getClass({ MerchantId: this.merchantId!, ClassId: params.classId }).subscribe({
  //     next: (response) => {
  //       if (response.statusCode === 200 && response.data) {
  //         this.classSections = Array.isArray(response.data)
  //           ? response.data.map(c => this.mapClassData(c))
  //           : [this.mapClassData(response.data)];
  //       } else {
  //         this.classSections = [];
  //         console.warn('No classes found:', response.message);
  //       }
  //       this.loadingClasses = false;
  //     },
  //     error: (error) => {
  //       console.error('Error loading classes:', error);
  //       this.classSections = [];
  //       this.loadingClasses = false;
  //     }
  //   });
  // }

  loadClasses(): void {
    this.loadingClasses = true;

    // 1. Start with the mandatory MerchantId
    const params: any = {
      MerchantId: this.merchantId
    };

    // 2. If a search is active (e.g. searching by specific ClassId or Name)
    if (this.searchQuery && this.searchQuery.trim() && this.searchFilter) {
      // This creates params like { MerchantId: '...', ClassId: '...' }
      // or { MerchantId: '...', ClassName: '...' } depending on your filter
      const key = this.searchFilter.charAt(0).toUpperCase() + this.searchFilter.slice(1);
      params[key] = this.searchQuery.trim();
    }

    // 3. Pass the full params object to the service
    this.administrationService.getClass(params).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          // Handle array vs single object response
          this.classSections = Array.isArray(response.data)
            ? response.data.map(c => this.mapClassData(c))
            : [this.mapClassData(response.data)];
        } else {
          this.classSections = [];
          console.warn('No classes found:', response.message);
        }
        this.loadingClasses = false;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.classSections = [];
        this.loadingClasses = false;
      }
    });
  }

  mapClassData(data: any): ClassSection {
    return {
      id: data.recId || 0,
      merchantId: data.merchantId || '',
      classId: data.classId || '',
      className: data.className || '',
      subClassId: data.subClassId || '',
      createdBy: data.createdBy || '',
      dateCreated: data.dateCreated || '',
      editedBy: data.editedBy || '',
      dateEdited: data.dateEdited || ''
    };
  }

  onSearch(): void {
    this.loadClasses();
  }

  initializeForm(): void {
    this.classForm = this.fb.group({
      merchantId: [this.merchantId],
      classId: ['', Validators.required],
      className: ['', Validators.required],
      subClassId: ['']
    });
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'classId', header: 'Class ID', sortable: true, width: '150px' },
      { field: 'className', header: 'Class Name', sortable: true },
      { field: 'subClassId', header: 'Sub Class ID', sortable: true, width: '150px' },
      { field: 'createdBy', header: 'Created By', sortable: true, width: '150px' },
      { field: 'dateCreated', header: 'Date Created', sortable: true, width: '180px' }
    ];
  }

  initializeActions(): void {
    this.actions = [
      {
        label: 'Update class',
        icon: 'edit-2',
        command: (classSection: ClassSection) => this.onEdit(classSection)
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (classSection: ClassSection) => this.onDelete(classSection)
      }
    ];
  }

  onNewClass(): void {
    this.isEditMode = false;
    this.currentClass = null;
    this.isModalOpen = true;
    this.classForm.reset({
      merchantId: this.merchantId
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentClass = null;
    this.classForm.reset();
  }

  handleSubmit(): void {
    if (this.classForm.invalid) {
      this.markFormGroupTouched(this.classForm);
      return;
    }

    if (this.isEditMode) {
      this.updateClass();
    } else {
      this.createClass();
    }
  }

  createClass(): void {
    this.isLoading = true;
    const formData: NewClassOrSubClass = this.classForm.value;

    this.administrationService.newClassOrSubClass(formData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess('Success', response.message);
          this.closeModal();
          this.loadClasses();
        } else {
          this.confirmService.showError('Error', response.message);
          this.loadClasses();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error creating class:', error);
        this.confirmService.showError('Error', error.message);
        this.loadClasses();
        this.isLoading = false;
      }
    });
  }

  updateClass(): void {
    this.isLoading = true;
    const formData: UpdateClassOrSubClass = this.classForm.value;

    this.administrationService.updateClassOrSubClass(formData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess('Success', response.message);
          this.closeModal();
          this.loadClasses();
        } else {
          this.confirmService.showError('Error', response.message);
          this.loadClasses();
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating class:', error);
        this.confirmService.showError('Error', error.message);
        this.loadClasses();
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
    const field = this.classForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onEdit(classSection: ClassSection): void {
    this.isEditMode = true;
    this.currentClass = classSection;
    this.isModalOpen = true;

    this.classForm.patchValue({
      merchantId: this.merchantId,
      classId: classSection.classId,
      className: classSection.className,
      subClassId: classSection.subClassId
    });
  }

  async onDelete(classSection: ClassSection): Promise<void> {
    const confirmed = await this.confirmService.confirmSubmit(
      `Are you sure you want to delete this class?\n\nClass ID: ${classSection.classId}\nClass Name: ${classSection.className}\n\nThis action cannot be undone.`,
      'Delete Class'
    );

    if (!confirmed) {
      return;
    }

    this.loadingClasses = true;
    const deleteData: DeleteClassOrSubClass = {
      merchantId: this.merchantId,
      classId: classSection.classId,
      subClassId: classSection.subClassId
    };

    this.administrationService.deleteClassOrSubClass(deleteData).subscribe({
      next: (response) => {
        if (response.statusCode === 200 || response.status === 'success') {
          this.confirmService.showSuccess('Success', response.message);
          this.loadClasses();
        } else {
          this.confirmService.showError('Error', response.message);
          this.loadingClasses = false;
        }
      },
      error: (error) => {
        console.error('Error deleting class:', error);
        this.confirmService.showError('Error', error.message);
        this.loadingClasses = false;
      }
    });
  }
}
