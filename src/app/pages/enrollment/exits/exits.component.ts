import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { PrimeTableComponent, TableColumn, TableAction } from '../../../../shared/prime-table/prime-table.component';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { LookupService } from '../../../core/services/lookup.service';
import { UserContextService } from '../../../core/services/user-context';
import { ConfirmService } from '../../../core/services/confirm.service';

interface Exit {
  id: number;
  exitId: string;
  studentId: string;
  studentName: string;
  exitReason: string;
  exitDate: string;
  remarks: string;
  exitStatus: 'ACTIVE' | 'INACTIVE';
  createdBy: string;
  dateCreated: string;
  editedBy: string;
  dateEdited: string;
}

@Component({
  selector: 'app-exits',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, IconComponent, ModalComponent, PrimeTableComponent],
  templateUrl: './exits.component.html',
  styleUrl: './exits.component.css'
})
export class ExitsComponent implements OnInit {
  searchQuery: string = '';
  searchFilter: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];
  isModalOpen = false;
  exitForm!: FormGroup;
  isLoading = false;
  loadingExits = false;
  merchantId = '';
  isEditMode = false;
  currentExit: Exit | null = null;

  // Lookup data
  exitReasons: any[] = [];
  exitStatuses: any[] = [];
  loadingLookups = false;

  exits: Exit[] = [];

  searchFilters = [
    { value: '', label: 'Search by...' },
    { value: 'exitId', label: 'Exit ID' },
    { value: 'studentId', label: 'Student ID' },
    { value: 'studentName', label: 'Student Name' },
    { value: 'exitReason', label: 'Exit Reason' }
  ];

  get filteredExits(): Exit[] {
    return this.exits;
  }

  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
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
    this.loadLookups();
    // this.loadExits(); // Uncomment when endpoint is available
  }

  loadLookups(): void {
    this.loadingLookups = true;

    // Mock exit reasons for now
    this.exitReasons = [
      { referenceId: 'GRADUATED', referenceName: 'Graduated' },
      { referenceId: 'TRANSFERRED', referenceName: 'Transferred' },
      { referenceId: 'WITHDRAWN', referenceName: 'Withdrawn' },
      { referenceId: 'EXPELLED', referenceName: 'Expelled' },
      { referenceId: 'OTHER', referenceName: 'Other' }
    ];

    this.lookupService.getStudentStatus(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.exitStatuses = Array.isArray(res.data) ? res.data : [res.data];
          console.log("exit statuses", this.exitStatuses);
          this.loadingLookups = false;
        }
      },
      error: (err) => {
        console.error('Error fetching exit statuses:', err);
        this.loadingLookups = false;
      }
    });
  }

  loadExits(): void {
    // TODO: Implement when endpoint is available
    this.loadingExits = true;

    setTimeout(() => {
      this.exits = [];
      this.loadingExits = false;
    }, 500);
  }

  onSearch(): void {
    // this.loadExits(); // Uncomment when endpoint is available
  }

  initializeForm(): void {
    this.exitForm = this.fb.group({
      merchantId: [this.merchantId],
      exitId: ['', Validators.required],
      studentId: ['', Validators.required],
      exitReason: ['', Validators.required],
      exitDate: [new Date().toISOString().split('T')[0], Validators.required],
      remarks: [''],
      exitStatus: ['ACTIVE', Validators.required]
    });
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'exitId', header: 'Exit ID', sortable: true, width: '120px' },
      { field: 'studentId', header: 'Student ID', sortable: true, width: '130px' },
      { field: 'studentName', header: 'Student Name', sortable: true },
      { field: 'exitReason', header: 'Exit Reason', sortable: true, width: '150px' },
      { field: 'exitDate', header: 'Exit Date', sortable: true, width: '130px' },
      { field: 'remarks', header: 'Remarks', sortable: false },
      { field: 'exitStatus', header: 'Status', sortable: true, width: '100px' }
    ];
  }

  initializeActions(): void {
    this.actions = [
      {
        label: 'Update exit',
        icon: 'edit-2',
        command: (exit: Exit) => this.onEdit(exit)
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (exit: Exit) => this.onDelete(exit)
      }
    ];
  }

  onNewExit(): void {
    this.isEditMode = false;
    this.currentExit = null;
    this.isModalOpen = true;
    this.exitForm.reset({
      merchantId: this.merchantId,
      exitStatus: 'ACTIVE',
      exitDate: new Date().toISOString().split('T')[0]
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentExit = null;
    this.exitForm.reset();
  }

  handleSubmit(): void {
    if (this.exitForm.invalid) {
      this.markFormGroupTouched(this.exitForm);
      return;
    }

    if (this.isEditMode) {
      this.updateExit();
    } else {
      this.createExit();
    }
  }

  createExit(): void {
    // TODO: Implement when endpoint is available
    this.isLoading = true;
    const formData = this.exitForm.value;

    console.log('Create Exit (endpoint not available):', formData);

    setTimeout(() => {
      this.confirmService.showSuccess('Success', 'Exit record will be created when endpoint is available');
      this.closeModal();
      this.isLoading = false;
    }, 500);
  }

  updateExit(): void {
    // TODO: Implement when endpoint is available
    this.isLoading = true;
    const formData = this.exitForm.value;

    console.log('Update Exit (endpoint not available):', formData);

    setTimeout(() => {
      this.confirmService.showSuccess('Success', 'Exit record will be updated when endpoint is available');
      this.closeModal();
      this.isLoading = false;
    }, 500);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.exitForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onEdit(exit: Exit): void {
    this.isEditMode = true;
    this.currentExit = exit;
    this.isModalOpen = true;

    this.exitForm.patchValue({
      merchantId: this.merchantId,
      exitId: exit.exitId,
      studentId: exit.studentId,
      exitReason: exit.exitReason,
      exitDate: exit.exitDate,
      remarks: exit.remarks,
      exitStatus: exit.exitStatus
    });
  }

  async onDelete(exit: Exit): Promise<void> {
    const confirmed = await this.confirmService.confirmSubmit(
      `Are you sure you want to delete this exit record?\n\nExit ID: ${exit.exitId}\nStudent: ${exit.studentName}\n\nThis action cannot be undone.`,
      'Delete Exit Record'
    );

    if (!confirmed) {
      return;
    }

    // TODO: Implement when endpoint is available
    this.loadingExits = true;

    console.log('Delete Exit (endpoint not available):', exit);

    setTimeout(() => {
      this.confirmService.showSuccess('Success', 'Exit record will be deleted when endpoint is available');
      this.loadingExits = false;
    }, 500);
  }
}
