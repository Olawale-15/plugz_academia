import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { PrimeTableComponent, TableColumn, TableAction } from '../../../../shared/prime-table/prime-table.component';
import { AcademicService } from '../../../core/services/academic.service';
import { LookupService } from '../../../core/services/lookup.service';
import { UserContextService } from '../../../core/services/user-context';
import { ConfirmService } from '../../../core/services/confirm.service';

interface ReportCard {
  id: number;
  reportCardId: string;
  studentId: string;
  studentName: string;
  academicSession: string;
  academicTerm: string;
  classId: string;
  totalScore: number;
  averageScore: number;
  grade: string;
  position: number;
  remarks: string;
  status: 'PUBLISHED' | 'DRAFT';
  createdBy: string;
  dateCreated: string;
  editedBy: string;
  dateEdited: string;
}

@Component({
  selector: 'app-reportcard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule, IconComponent, ModalComponent, PrimeTableComponent],
  templateUrl: './reportcard.component.html',
  styleUrl: './reportcard.component.css'
})
export class ReportcardComponent implements OnInit {
  searchQuery: string = '';
  searchFilter: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];
  isModalOpen = false;
  reportCardForm!: FormGroup;
  isLoading = false;
  loadingReportCards = false;
  merchantId = '';
  isEditMode = false;
  currentReportCard: ReportCard | null = null;

  // Lookup data
  academicSessions: any[] = [];
  academicTerms: any[] = [];
  classes: any[] = [];
  reportCardStatuses: any[] = [];
  loadingLookups = false;

  reportCards: ReportCard[] = [];

  searchFilters = [
    { value: '', label: 'Search by...' },
    { value: 'reportCardId', label: 'Report Card ID' },
    { value: 'studentId', label: 'Student ID' },
    { value: 'studentName', label: 'Student Name' },
    { value: 'academicSession', label: 'Academic Session' },
    { value: 'status', label: 'Status' }
  ];

  get filteredReportCards(): ReportCard[] {
    return this.reportCards;
  }

  constructor(
    private fb: FormBuilder,
    private academicService: AcademicService,
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
    // this.loadReportCards(); // Uncomment when endpoint is available
  }

  loadLookups(): void {
    this.loadingLookups = true;

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
        }
      },
      error: (err) => {
        console.error('Error fetching academic terms:', err);
      }
    });

    this.lookupService.getClasses(this.merchantId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.classes = Array.isArray(res.data) ? res.data : [res.data];
          console.log("classes", this.classes);
        }
      },
      error: (err) => {
        console.error('Error fetching classes:', err);
        this.loadingLookups = false;
      }
    });

    // Mock report card statuses
    this.reportCardStatuses = [
      { referenceId: 'PUBLISHED', referenceName: 'Published' },
      { referenceId: 'DRAFT', referenceName: 'Draft' }
    ];

    this.loadingLookups = false;
  }

  loadReportCards(): void {
    // TODO: Implement when endpoint is available
    this.loadingReportCards = true;

    setTimeout(() => {
      this.reportCards = [];
      this.loadingReportCards = false;
    }, 500);
  }

  onSearch(): void {
    // this.loadReportCards(); // Uncomment when endpoint is available
  }

  initializeForm(): void {
    this.reportCardForm = this.fb.group({
      merchantId: [this.merchantId],
      reportCardId: ['', Validators.required],
      studentId: ['', Validators.required],
      academicSession: ['', Validators.required],
      academicTerm: ['', Validators.required],
      classId: ['', Validators.required],
      totalScore: [0, [Validators.required, Validators.min(0)]],
      averageScore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      grade: ['', Validators.required],
      position: [0, [Validators.required, Validators.min(1)]],
      remarks: [''],
      status: ['DRAFT', Validators.required]
    });
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'reportCardId', header: 'Report Card ID', sortable: true, width: '150px' },
      { field: 'studentId', header: 'Student ID', sortable: true, width: '120px' },
      { field: 'studentName', header: 'Student Name', sortable: true },
      { field: 'academicSession', header: 'Session', sortable: true, width: '120px' },
      { field: 'academicTerm', header: 'Term', sortable: true, width: '100px' },
      { field: 'averageScore', header: 'Average', sortable: true, width: '100px' },
      { field: 'grade', header: 'Grade', sortable: true, width: '80px' },
      { field: 'position', header: 'Position', sortable: true, width: '90px' },
      { field: 'status', header: 'Status', sortable: true, width: '100px' }
    ];
  }

  initializeActions(): void {
    this.actions = [
      {
        label: 'View Report',
        icon: 'eye',
        command: (reportCard: ReportCard) => this.onView(reportCard)
      },
      {
        label: 'Update report card',
        icon: 'edit-2',
        command: (reportCard: ReportCard) => this.onEdit(reportCard)
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (reportCard: ReportCard) => this.onDelete(reportCard)
      }
    ];
  }

  onNewReportCard(): void {
    this.isEditMode = false;
    this.currentReportCard = null;
    this.isModalOpen = true;
    this.reportCardForm.reset({
      merchantId: this.merchantId,
      status: 'DRAFT',
      totalScore: 0,
      averageScore: 0,
      position: 1
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentReportCard = null;
    this.reportCardForm.reset();
  }

  handleSubmit(): void {
    if (this.reportCardForm.invalid) {
      this.markFormGroupTouched(this.reportCardForm);
      return;
    }

    if (this.isEditMode) {
      this.updateReportCard();
    } else {
      this.createReportCard();
    }
  }

  createReportCard(): void {
    // TODO: Implement when endpoint is available
    this.isLoading = true;
    const formData = this.reportCardForm.value;

    console.log('Create Report Card (endpoint not available):', formData);

    setTimeout(() => {
      this.confirmService.showSuccess('Success', 'Report card will be created when endpoint is available');
      this.closeModal();
      this.isLoading = false;
    }, 500);
  }

  updateReportCard(): void {
    // TODO: Implement when endpoint is available
    this.isLoading = true;
    const formData = this.reportCardForm.value;

    console.log('Update Report Card (endpoint not available):', formData);

    setTimeout(() => {
      this.confirmService.showSuccess('Success', 'Report card will be updated when endpoint is available');
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
    const field = this.reportCardForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onView(reportCard: ReportCard): void {
    console.log('View Report Card:', reportCard);
    this.confirmService.showSuccess('Info', 'Report card viewing will be implemented when endpoint is available');
  }

  onEdit(reportCard: ReportCard): void {
    this.isEditMode = true;
    this.currentReportCard = reportCard;
    this.isModalOpen = true;

    this.reportCardForm.patchValue({
      merchantId: this.merchantId,
      reportCardId: reportCard.reportCardId,
      studentId: reportCard.studentId,
      academicSession: reportCard.academicSession,
      academicTerm: reportCard.academicTerm,
      classId: reportCard.classId,
      totalScore: reportCard.totalScore,
      averageScore: reportCard.averageScore,
      grade: reportCard.grade,
      position: reportCard.position,
      remarks: reportCard.remarks,
      status: reportCard.status
    });
  }

  async onDelete(reportCard: ReportCard): Promise<void> {
    const confirmed = await this.confirmService.confirmSubmit(
      `Are you sure you want to delete this report card?\n\nReport Card ID: ${reportCard.reportCardId}\nStudent: ${reportCard.studentName}\n\nThis action cannot be undone.`,
      'Delete Report Card'
    );

    if (!confirmed) {
      return;
    }

    // TODO: Implement when endpoint is available
    this.loadingReportCards = true;

    console.log('Delete Report Card (endpoint not available):', reportCard);

    setTimeout(() => {
      this.confirmService.showSuccess('Success', 'Report card will be deleted when endpoint is available');
      this.loadingReportCards = false;
    }, 500);
  }
}
