import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalConfig {
    title: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showFooter?: boolean;
    closeOnBackdrop?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private modalState = new BehaviorSubject<boolean>(false);
    public isOpen$ = this.modalState.asObservable();

    open() {
        this.modalState.next(true);
    }

    close() {
        this.modalState.next(false);
    }

    toggle() {
        this.modalState.next(!this.modalState.value);
    }
}
