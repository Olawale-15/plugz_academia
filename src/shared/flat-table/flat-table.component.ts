import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  HostListener,
  OnChanges,
  SimpleChanges,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-flat-table',
  standalone: true,
  templateUrl: './flat-table.component.html',
  styleUrls: ['./flat-table.component.css'],
  imports: [CommonModule, NgbPaginationModule, FormsModule],
})
export class FlatTableComponent implements OnChanges, OnInit {
  @Input() columns: { key: string; label: string; template?: TemplateRef<any> }[] = [];
  @Input() data: any[] = [];               // <-- full dataset (not pre-sliced)
  @Input() emptyMessage = 'No data available';
  @Input() totalItems?: number;            // optional server-side total
  @Input() page = 1;
  @Input() pageSize = 5;                   // Default to 5 to match your example
  @Input() loading = false;
  @Input() title = '';

  @Output() pageChange = new EventEmitter<number>();

  searchTerm: string = '';
  isOverflowing = false;

  // Filtered data based on search
  get filteredData(): any[] {
    if (!this.searchTerm) return this.data;
    const term = this.searchTerm.toLowerCase();
    return this.data.filter(row =>
      this.columns.some(col => {
        const val = row[col.key];
        return val && val.toString().toLowerCase().includes(term);
      })
    );
  }

  // Derived total (use server-side total if provided, otherwise filteredData.length)
  get collectionSize(): number {
    return (this.totalItems ?? this.filteredData.length) || 0;
  }

  // Slice for current page from filtered data
  get pagedData(): any[] {
    const startIndex = (this.page - 1) * this.pageSize;
    return this.filteredData.slice(startIndex, startIndex + this.pageSize);
  }

  // Getter for the "Showing" text range
  get showingRange(): { start: number; end: number; total: number } {
    const start = (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, this.collectionSize);
    return { start, end, total: this.collectionSize };
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.pageChange.emit(newPage);
  }

  onPageSizeChange() {
    this.page = 1;
    this.pageChange.emit(1);
  }

  onSearch() {
    this.page = 1;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      const len = (changes['data'].currentValue || []).length;
      console.log('flat-table ngOnChanges data length =', len, 'collectionSize=', this.collectionSize, 'page=', this.page);
    }

    // If page is now out of range because collection changed, reset to page 1
    const maxPages = Math.max(1, Math.ceil(this.collectionSize / this.pageSize));
    if (this.page > maxPages) {
      this.page = 1;
      this.pageChange.emit(this.page);
    }
  }

  ngOnInit() {
    this.checkOverflow();
  }

  @HostListener('window:resize')
  onResize() { this.checkOverflow(); }

  private checkOverflow() {
    setTimeout(() => {
      const tableContainer = document.querySelector('.table-responsive');
      if (tableContainer) {
        this.isOverflowing = (tableContainer as HTMLElement).scrollWidth > (tableContainer as HTMLElement).clientWidth;
      }
    }, 100);
  }
}
