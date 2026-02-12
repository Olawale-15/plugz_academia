import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { PrimeTableComponent, TableColumn, TableAction } from '../../../../shared/prime-table/prime-table.component';

interface MarkEntry {
  id: number;
  entryId: string;
  studentName: string;
  studentId: string;
  subject: string;
  assessmentType: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  status: 'Submitted' | 'Pending' | 'Draft';
}

@Component({
  selector: 'app-markentry',
  imports: [CommonModule, FormsModule, IconComponent, PrimeTableComponent],
  templateUrl: './markentry.component.html',
  styleUrl: './markentry.component.css'
})
export class MarkentryComponent implements OnInit {
  searchQuery: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];

  markEntries: MarkEntry[] = [
    {
      id: 1,
      entryId: 'ME001',
      studentName: 'John Doe',
      studentId: 'STU001',
      subject: 'Mathematics',
      assessmentType: 'Mid-Term Exam',
      marksObtained: 85,
      totalMarks: 100,
      grade: 'A',
      status: 'Submitted'
    },
    {
      id: 2,
      entryId: 'ME002',
      studentName: 'Sarah Wilson',
      studentId: 'STU002',
      subject: 'Physics',
      assessmentType: 'Mid-Term Exam',
      marksObtained: 92,
      totalMarks: 100,
      grade: 'A+',
      status: 'Submitted'
    },
    {
      id: 3,
      entryId: 'ME003',
      studentName: 'Michael Brown',
      studentId: 'STU003',
      subject: 'Chemistry',
      assessmentType: 'Quiz',
      marksObtained: 78,
      totalMarks: 100,
      grade: 'B+',
      status: 'Submitted'
    },
    {
      id: 4,
      entryId: 'ME004',
      studentName: 'Emily Davis',
      studentId: 'STU004',
      subject: 'English',
      assessmentType: 'Project',
      marksObtained: 88,
      totalMarks: 100,
      grade: 'A',
      status: 'Submitted'
    },
    {
      id: 5,
      entryId: 'ME005',
      studentName: 'James Miller',
      studentId: 'STU005',
      subject: 'History',
      assessmentType: 'Class Test',
      marksObtained: 0,
      totalMarks: 100,
      grade: '-',
      status: 'Pending'
    },
    {
      id: 6,
      entryId: 'ME006',
      studentName: 'Lisa Anderson',
      studentId: 'STU006',
      subject: 'Biology',
      assessmentType: 'Final Exam',
      marksObtained: 65,
      totalMarks: 100,
      grade: 'B',
      status: 'Draft'
    }
  ];

  get filteredMarkEntries(): MarkEntry[] {
    if (!this.searchQuery) {
      return this.markEntries;
    }

    const query = this.searchQuery.toLowerCase();
    return this.markEntries.filter(entry =>
      entry.studentName.toLowerCase().includes(query) ||
      entry.studentId.toLowerCase().includes(query) ||
      entry.subject.toLowerCase().includes(query) ||
      entry.assessmentType.toLowerCase().includes(query)
    );
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeActions();
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'entryId', header: 'Entry ID', sortable: true, width: '100px' },
      { field: 'studentName', header: 'Student', sortable: true },
      { field: 'subject', header: 'Subject', sortable: true },
      { field: 'assessmentType', header: 'Assessment', sortable: true },
      { field: 'marksObtained', header: 'Marks', sortable: true, width: '80px' },
      { field: 'grade', header: 'Grade', sortable: true, width: '80px' },
      { field: 'status', header: 'Status', sortable: true, width: '100px' }
    ];
  }

  initializeActions(): void {
    this.actions = [
      {
        label: 'View Details',
        icon: 'eye',
        command: (entry: MarkEntry) => this.onViewDetails(entry)
      },
      {
        label: 'Edit',
        icon: 'edit-2',
        command: (entry: MarkEntry) => this.onEdit(entry)
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (entry: MarkEntry) => this.onDelete(entry)
      }
    ];
  }

  onNewMarkEntry(): void {
    console.log('Create new mark entry');
    // Implement navigation to create mark entry form
  }

  onViewDetails(entry: MarkEntry): void {
    console.log('View details for:', entry);
    // Implement view details functionality
  }

  onEdit(entry: MarkEntry): void {
    console.log('Edit mark entry:', entry);
    // Implement edit functionality
  }

  onDelete(entry: MarkEntry): void {
    console.log('Delete mark entry:', entry);
    // Implement delete functionality
  }
}
