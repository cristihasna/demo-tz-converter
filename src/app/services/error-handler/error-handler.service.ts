import { ErrorHandler, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: any): void {
    console.error(error);
    this.snackBar.open(error.message, 'Dismiss');
  }
}
