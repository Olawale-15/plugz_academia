import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { PrimeTableComponent, TableColumn, TableAction } from '../../../../shared/prime-table/prime-table.component';

interface Transfer {
  id: number;
  studentId: string;
  studentName: string;
  fromGrade: string;
  fromSection: string;
  toGrade: string;
  toSection: string;
  transferDate: string;
  reason: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

@Component({
  selector: 'app-transfer',
  imports: [CommonModule, FormsModule, IconComponent, PrimeTableComponent],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css'
})
export class TransferComponent implements OnInit {
  searchQuery: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];

  transfers: Transfer[] = [
    {
      id: 1,
      studentId: 'STU001',
      studentName: 'John Doe',
      fromGrade: 'Grade 10',
      fromSection: 'A',
      toGrade: 'Grade 10',
      toSection: 'B',
      transferDate: '2024-09-15',
      reason: 'Schedule conflict',
      status: 'Completed'
    },
    {
      id: 2,
      studentId: 'STU002',
      studentName: 'Sarah Wilson',
      fromGrade: 'Grade 9',
      fromSection: 'C',
      toGrade: 'Grade 9',
      toSection: 'A',
      transferDate: '2024-09-20',
      reason: 'Parent request',
      status: 'Completed'
    },
    {
      id: 3,
      studentId: 'STU003',
      studentName: 'Michael Brown',
      fromGrade: 'Grade 11',
      fromSection: 'B',
      toGrade: 'Grade 11',
      toSection: 'A',
      transferDate: '2024-10-01',
      reason: 'Academic performance',
      status: 'Pending'
    },
    {
      id: 4,
      studentId: 'STU004',
      studentName: 'Emily Davis',
      fromGrade: 'Grade 8',
      fromSection: 'A',
      toGrade: 'Grade 8',
      toSection: 'C',
      transferDate: '2024-10-05',
      reason: 'Teacher recommendation',
      status: 'Completed'
    },
    {
      id: 5,
      studentId: 'STU005',
      studentName: 'James Miller',
      fromGrade: 'Grade 12',
      fromSection: 'A',
      toGrade: 'Grade 12',
      toSection: 'B',
      transferDate: '2024-10-10',
      reason: 'Subject stream change',
      status: 'Pending'
    },
    {
      id: 6,
      studentId: 'STU006',
      studentName: 'Lisa Anderson',
      fromGrade: 'Grade 7',
      fromSection: 'B',
      toGrade: 'Grade 7',
      toSection: 'A',
      transferDate: '2024-09-25',
      reason: 'Medical reasons',
      status: 'Cancelled'
    }
  ];

  get filteredTransfers(): Transfer[] {
    if (!this.searchQuery) {
      return this.transfers;
    }

    const query = this.searchQuery.toLowerCase();
    return this.transfers.filter(transfer =>
      transfer.studentName.toLowerCase().includes(query) ||
      transfer.studentId.toLowerCase().includes(query) ||
      transfer.fromGrade.toLowerCase().includes(query) ||
      transfer.toGrade.toLowerCase().includes(query)
    );
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeActions();
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'studentId', header: 'Student ID', sortable: true, width: '120px' },
      { field: 'studentName', header: 'Student Name', sortable: true },
      { field: 'fromSection', header: 'From', sortable: true, width: '100px' },
      { field: 'toSection', header: 'To', sortable: true, width: '100px' },
      { field: 'transferDate', header: 'Transfer Date', sortable: true, width: '130px' },
      { field: 'status', header: 'Status', sortable: true, width: '100px' }
    ];
  }

  initializeActions(): void {
    this.actions = [
      {
        label: 'View Details',
        icon: 'eye',
        command: (transfer: Transfer) => this.onViewDetails(transfer)
      },
      {
        label: 'Edit',
        icon: 'edit-2',
        command: (transfer: Transfer) => this.onEdit(transfer)
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (transfer: Transfer) => this.onDelete(transfer)
      }
    ];
  }

  onViewDetails(transfer: Transfer): void {
    console.log('View details for:', transfer);
    // Implement view details functionality
  }

  onEdit(transfer: Transfer): void {
    console.log('Edit transfer:', transfer);
    // Implement edit functionality
  }

  onDelete(transfer: Transfer): void {
    console.log('Delete transfer:', transfer);
    // Implement delete functionality
  }
}
