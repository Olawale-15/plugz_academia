import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { PrimeTableComponent, TableColumn, TableAction } from '../../../../shared/prime-table/prime-table.component';

interface GradingSystem {
  id: number;
  gradeId: string;
  grade: string;
  minMarks: number;
  maxMarks: number;
  gradePoint: number;
  description: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-gradingsystem',
  imports: [CommonModule, FormsModule, IconComponent, PrimeTableComponent],
  templateUrl: './gradingsystem.component.html',
  styleUrl: './gradingsystem.component.css'
})
export class GradingsystemComponent implements OnInit {
  searchQuery: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];

  gradingSystems: GradingSystem[] = [
    {
      id: 1,
      gradeId: 'GRD001',
      grade: 'A+',
      minMarks: 90,
      maxMarks: 100,
      gradePoint: 4.0,
      description: 'Outstanding',
      status: 'Active'
    },
    {
      id: 2,
      gradeId: 'GRD002',
      grade: 'A',
      minMarks: 80,
      maxMarks: 89,
      gradePoint: 3.7,
      description: 'Excellent',
      status: 'Active'
    },
    {
      id: 3,
      gradeId: 'GRD003',
      grade: 'B+',
      minMarks: 70,
      maxMarks: 79,
      gradePoint: 3.3,
      description: 'Very Good',
      status: 'Active'
    },
    {
      id: 4,
      gradeId: 'GRD004',
      grade: 'B',
      minMarks: 60,
      maxMarks: 69,
      gradePoint: 3.0,
      description: 'Good',
      status: 'Active'
    },
    {
      id: 5,
      gradeId: 'GRD005',
      grade: 'C',
      minMarks: 50,
      maxMarks: 59,
      gradePoint: 2.0,
      description: 'Average',
      status: 'Active'
    },
    {
      id: 6,
      gradeId: 'GRD006',
      grade: 'D',
      minMarks: 40,
      maxMarks: 49,
      gradePoint: 1.0,
      description: 'Pass',
      status: 'Active'
    },
    {
      id: 7,
      gradeId: 'GRD007',
      grade: 'F',
      minMarks: 0,
      maxMarks: 39,
      gradePoint: 0.0,
      description: 'Fail',
      status: 'Active'
    }
  ];

  get filteredGradingSystems(): GradingSystem[] {
    if (!this.searchQuery) {
      return this.gradingSystems;
    }

    const query = this.searchQuery.toLowerCase();
    return this.gradingSystems.filter(grade =>
      grade.grade.toLowerCase().includes(query) ||
      grade.gradeId.toLowerCase().includes(query) ||
      grade.description.toLowerCase().includes(query)
    );
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeActions();
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'gradeId', header: 'Grade ID', sortable: true, width: '100px' },
      { field: 'grade', header: 'Grade', sortable: true, width: '80px' },
      { field: 'minMarks', header: 'Min Marks', sortable: true, width: '100px' },
      { field: 'maxMarks', header: 'Max Marks', sortable: true, width: '100px' },
      { field: 'gradePoint', header: 'Grade Point', sortable: true, width: '110px' },
      { field: 'description', header: 'Description', sortable: false },
      { field: 'status', header: 'Status', sortable: true, width: '100px' }
    ];
  }

  initializeActions(): void {
    this.actions = [
      {
        label: 'View Details',
        icon: 'eye',
        command: (grade: GradingSystem) => this.onViewDetails(grade)
      },
      {
        label: 'Edit',
        icon: 'edit-2',
        command: (grade: GradingSystem) => this.onEdit(grade)
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (grade: GradingSystem) => this.onDelete(grade)
      }
    ];
  }

  onNewGrade(): void {
    console.log('Create new grade');
    // Implement navigation to create grade form
  }

  onViewDetails(grade: GradingSystem): void {
    console.log('View details for:', grade);
    // Implement view details functionality
  }

  onEdit(grade: GradingSystem): void {
    console.log('Edit grade:', grade);
    // Implement edit functionality
  }

  onDelete(grade: GradingSystem): void {
    console.log('Delete grade:', grade);
    // Implement delete functionality
  }
}
