import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.css'
})
export class ModalComponent {
    @Input() title: string = '';
    @Input() isOpen: boolean = false;
    @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
    @Input() showFooter: boolean = true;
    @Input() closeOnBackdrop: boolean = true;

    @Output() onClose = new EventEmitter<void>();
    @Output() onConfirm = new EventEmitter<void>();

    close() {
        this.onClose.emit();
    }

    confirm() {
        this.onConfirm.emit();
    }

    onBackdropClick() {
        if (this.closeOnBackdrop) {
            this.close();
        }
    }

    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
