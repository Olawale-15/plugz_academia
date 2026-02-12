import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { PrimeTableComponent, TableColumn, TableAction } from '../../../../shared/prime-table/prime-table.component';

interface Staff {
  id: number;
  staffId: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, IconComponent, PrimeTableComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  searchQuery: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];

  staffMembers: Staff[] = [
    {
      id: 1,
      staffId: 'STF001',
      name: 'Dr. Robert Johnson',
      role: 'Principal',
      department: 'Administration',
      email: 'robert.johnson@school.com',
      phone: '+1 234-567-8900',
      joinDate: '2020-01-15',
      status: 'Active'
    },
    {
      id: 2,
      staffId: 'STF002',
      name: 'Maria Garcia',
      role: 'Mathematics Teacher',
      department: 'Mathematics',
      email: 'maria.garcia@school.com',
      phone: '+1 234-567-8901',
      joinDate: '2021-03-20',
      status: 'Active'
    },
    {
      id: 3,
      staffId: 'STF003',
      name: 'David Lee',
      role: 'Science Teacher',
      department: 'Science',
      email: 'david.lee@school.com',
      phone: '+1 234-567-8902',
      joinDate: '2021-08-10',
      status: 'Active'
    },
    {
      id: 4,
      staffId: 'STF004',
      name: 'Jennifer White',
      role: 'English Teacher',
      department: 'Languages',
      email: 'jennifer.white@school.com',
      phone: '+1 234-567-8903',
      joinDate: '2022-01-05',
      status: 'Active'
    },
    {
      id: 5,
      staffId: 'STF005',
      name: 'Michael Brown',
      role: 'Librarian',
      department: 'Library',
      email: 'michael.brown@school.com',
      phone: '+1 234-567-8904',
      joinDate: '2020-09-12',
      status: 'Inactive'
    },
    {
      id: 6,
      staffId: 'STF006',
      name: 'Sarah Miller',
      role: 'Counselor',
      department: 'Student Services',
      email: 'sarah.miller@school.com',
      phone: '+1 234-567-8905',
      joinDate: '2021-06-18',
      status: 'Active'
    }
  ];

  get filteredStaff(): Staff[] {
    if (!this.searchQuery) {
      return this.staffMembers;
    }

    const query = this.searchQuery.toLowerCase();
    return this.staffMembers.filter(staff =>
      staff.name.toLowerCase().includes(query) ||
      staff.staffId.toLowerCase().includes(query) ||
      staff.email.toLowerCase().includes(query) ||
      staff.role.toLowerCase().includes(query) ||
      staff.department.toLowerCase().includes(query)
    );
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeActions();
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'staffId', header: 'Staff ID', sortable: true, width: '100px' },
      { field: 'name', header: 'Name', sortable: true },
      { field: 'role', header: 'Role', sortable: true },
      { field: 'department', header: 'Department', sortable: true },
      { field: 'email', header: 'Email', sortable: false },
      { field: 'status', header: 'Status', sortable: true, width: '100px' }
    ];
  }

  initializeActions(): void {
    this.actions = [
      {
        label: 'Edit',
        icon: 'edit-2',
        command: (staff: Staff) => this.onEdit(staff)
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (staff: Staff) => this.onDelete(staff)
      },
      {
        label: 'Upload Picture',
        icon: 'image',
        command: (staff: Staff) => this.onUploadPic(staff)
      },
      {
        label: 'Exit',
        icon: 'log-out',
        command: (staff: Staff) => this.onExit(staff)
      }
    ];
  }

  onNewStaff(): void {
    console.log('Create new staff member');
    // Implement navigation to create staff form
  }

  onEdit(staff: Staff): void {
    console.log('Edit staff:', staff);
    // Implement edit functionality
  }

  onDelete(staff: Staff): void {
    console.log('Delete staff:', staff);
    // Implement delete functionality
  }

  onUploadPic(staff: Staff): void {
    console.log('Upload picture for:', staff);
    // Implement upload picture functionality
  }

  onExit(staff: Staff): void {
    console.log('Exit/Terminate staff:', staff);
    // Implement exit/termination functionality
  }
}
