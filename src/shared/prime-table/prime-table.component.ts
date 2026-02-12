import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  isHeaderCheckbox?: boolean;
}

export interface TableAction {
  label: string;
  icon: string;
  command: (rowData: any) => void;
  styleClass?: string;
}

@Component({
  selector: 'app-prime-table',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './prime-table.component.html',
  styleUrl: './prime-table.component.css',
})
export class PrimeTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50];
  @Input() paginator: boolean = true;
  @Input() loading: boolean = false;
  @Input() globalFilterFields: string[] = [];
  @Input() striped: boolean = true;
  @Input() showGridlines: boolean = false;
  @Input() responsiveLayout: string = 'scroll';

  // Add these two properties for header checkbox
  @Input() headerCheckboxState?: () => boolean;
  @Input() headerCheckboxChange?: (event: Event) => void;

  @Output() rowSelect = new EventEmitter<any>();
  @Output() rowUnselect = new EventEmitter<any>();
  @Output() visibleRowsChange = new EventEmitter<any[]>();

  @ContentChild('bodyTemplate') bodyTemplate: TemplateRef<any> | undefined;
  @ContentChild('actionTemplate') actionTemplate: TemplateRef<any> | undefined;

  // Expose Math to template
  Math = Math;

  // Pagination
  currentPage: number = 0;
  totalRecords: number = 0;

  // Sorting
  sortField: string | null = null;
  sortOrder: number = 1;

  // Dropdown menu
  openMenuId: any = null;
  menuPosition = { top: '0px', left: '0px' };

  ngOnInit() {
    this.totalRecords = this.data.length;
  }

  ngOnChanges() {
    this.totalRecords = this.data.length;
  }

  getRowId(row: any): any {
    return row.referenceId || row.id || row.studentId || JSON.stringify(row);
  }

  toggleMenu(row: any, event?: MouseEvent) {
    const rowId = this.getRowId(row);

    if (this.openMenuId === rowId) {
      this.closeMenu();
      return;
    }

    this.openMenuId = rowId;

    if (event) {
      const button = event.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      this.menuPosition = {
        top: `${rect.bottom + 4}px`,
        left: `${rect.right - 160}px`,
      };
    }
  }

  closeMenu() {
    this.openMenuId = null;
  }

  executeAction(action: TableAction, row: any) {
    action.command(row);
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-menu-wrapper')) {
      this.closeMenu();
    }
  }

  get paginatedData(): any[] {
    if (!this.paginator) {
      return this.getSortedData();
    }

    const start = this.currentPage * this.rows;
    const end = start + this.rows;
    return this.getSortedData().slice(start, end);
  }

  getSortedData(): any[] {
    if (!this.sortField) {
      return this.data;
    }

    return [...this.data].sort((a, b) => {
      const aValue = a[this.sortField!];
      const bValue = b[this.sortField!];

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return this.sortOrder;
      if (bValue === null || bValue === undefined) return -this.sortOrder;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * this.sortOrder;
      }

      return (aValue > bValue ? 1 : -1) * this.sortOrder;
    });
  }

  onSort(field: string, sortable?: boolean) {
    if (!sortable) return;

    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 1 ? -1 : 1;
    } else {
      this.sortField = field;
      this.sortOrder = 1;
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onRowsPerPageChange(rows: number) {
    this.rows = rows;
    this.currentPage = 0;
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rows);
  }

  get pages(): number[] {
    const pages = [];
    const maxPages = 5;
    let start = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
    const end = Math.min(this.totalPages, start + maxPages);

    if (end - start < maxPages) {
      start = Math.max(0, end - maxPages);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
