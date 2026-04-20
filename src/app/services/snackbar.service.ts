import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
    constructor(
        private snackbar: MatSnackBar
    ) {}

    show(message: string, duration: number = 3000) {
        this.snackbar.open(message, '', {
            duration,
            horizontalPosition: 'center',
            panelClass: "snack-bar"
        });
    }

    showOrFatal(message: string | null, duration: number = 3000) {
        if (message === null) {
            this.fatal(duration);
            return;
        }
        this.show(message, duration);
    }

    err(err: { status: number }, duration: number = 3000) {
        if (err.status == 400) {
            this.show("Input error")
        } else {
            this.show(`Error ${err.status}`, duration);
        }
    }

    fatal(duration: number = 3000) {
        this.show("Unknown error", duration);
    }
}