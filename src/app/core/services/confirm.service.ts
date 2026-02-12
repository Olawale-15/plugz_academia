// confirm.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  // Confirmation dialog
  confirmSubmit(
    message = 'Do you want to submit?',
    title = 'Confirm Submission'
  ): Promise<boolean> {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'swal2-btn-yes',

        cancelButton: 'swal2-btn-no'
      },
      buttonsStyling: false
    }).then(result => result.isConfirmed);
  }

  // Success message with OK button
  showSuccess(title: string, message: string): Promise<void> {
    return Swal.fire({
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'swal2-btn-ok'
      },
      buttonsStyling: false
    }).then(() => { });
  }

  // Error message with OK button
  showError(title: string, message: string): Promise<void> {
    return Swal.fire({
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'swal2-btn-ok'
      },
      buttonsStyling: false
    }).then(() => { });
  }

  // Info message with OK button
  showInfo(title: string, message: string): Promise<void> {
    return Swal.fire({
      title,
      text: message,
      icon: 'info',
      confirmButtonText: 'OK',
      customClass: {
        confirmButton: 'swal2-btn-ok'
      },
      buttonsStyling: false
    }).then(() => { });
  }
}
