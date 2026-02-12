import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/icon/icon.component';
import { PrimeTableComponent, TableColumn, TableAction } from '../../../../shared/prime-table/prime-table.component';

interface Role {
  id: number;
  roleId: string;
  roleName: string;
  department: string;
  description: string;
  permissions: string;
  assignedCount: number;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule, IconComponent, PrimeTableComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit {
  searchQuery: string = '';
  columns: TableColumn[] = [];
  actions: TableAction[] = [];

  roles: Role[] = [
    {
      id: 1,
      roleId: 'ROLE001',
      roleName: 'Principal',
      department: 'Administration',
      description: 'School principal with full administrative access',
      permissions: 'All',
      assignedCount: 1,
      status: 'Active'
    },
    {
      id: 2,
      roleId: 'ROLE002',
      roleName: 'Teacher',
      department: 'Academic',
      description: 'Teaching staff with classroom management access',
      permissions: 'Teaching, Grading',
      assignedCount: 15,
      status: 'Active'
    },
    {
      id: 3,
      roleId: 'ROLE003',
      roleName: 'Librarian',
      department: 'Library',
      description: 'Library management and book circulation',
      permissions: 'Library Management',
      assignedCount: 2,
      status: 'Active'
    },
    {
      id: 4,
      roleId: 'ROLE004',
      roleName: 'Counselor',
      department: 'Student Services',
      description: 'Student counseling and guidance',
      permissions: 'Student Records, Counseling',
      assignedCount: 3,
      status: 'Active'
    },
    {
      id: 5,
      roleId: 'ROLE005',
      roleName: 'Administrator',
      department: 'Administration',
      description: 'System administrator with technical access',
      permissions: 'System Settings',
      assignedCount: 2,
      status: 'Active'
    },
    {
      id: 6,
      roleId: 'ROLE006',
      roleName: 'Lab Assistant',
      department: 'Science',
      description: 'Laboratory equipment management',
      permissions: 'Lab Management',
      assignedCount: 0,
      status: 'Inactive'
    }
  ];

  get filteredRoles(): Role[] {
    if (!this.searchQuery) {
      return this.roles;
    }

    const query = this.searchQuery.toLowerCase();
    return this.roles.filter(role =>
      role.roleName.toLowerCase().includes(query) ||
      role.roleId.toLowerCase().includes(query) ||
      role.department.toLowerCase().includes(query) ||
      role.description.toLowerCase().includes(query)
    );
  }

  ngOnInit(): void {
    this.initializeColumns();
    this.initializeActions();
  }

  initializeColumns(): void {
    this.columns = [
      { field: 'roleId', header: 'Role ID', sortable: true, width: '100px' },
      { field: 'roleName', header: 'Role Name', sortable: true },
      { field: 'department', header: 'Department', sortable: true },
      { field: 'assignedCount', header: 'Assigned', sortable: true, width: '100px' },
      { field: 'status', header: 'Status', sortable: true, width: '100px' }
    ];
  }

  initializeActions(): void {
    this.actions = [
      {
        label: 'View Details',
        icon: 'eye',
        command: (role: Role) => this.onViewDetails(role)
      },
      {
        label: 'Edit',
        icon: 'edit-2',
        command: (role: Role) => this.onEdit(role)
      },
      {
        label: 'Delete',
        icon: 'trash-2',
        styleClass: 'danger',
        command: (role: Role) => this.onDelete(role)
      }
    ];
  }

  onViewDetails(role: Role): void {
    console.log('View details for:', role);
    // Implement view details functionality
  }

  onEdit(role: Role): void {
    console.log('Edit role:', role);
    // Implement edit functionality
  }

  onDelete(role: Role): void {
    console.log('Delete role:', role);
    // Implement delete functionality
  }
}
