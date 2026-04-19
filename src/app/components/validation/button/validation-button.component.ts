import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Validative } from "../validative";
import { SnackbarService } from "@services/snackbar.service";

@Component({
    standalone: true,
    selector: 'vbutton',
    templateUrl: './validation-button.component.html',
    styleUrl: './validation-button.component.scss'
})
export class ValidationButton {
    @Input() innerClass = "";
    @Input() validationSources: Validative[] = [];
    @Output() onClick = new EventEmitter<void>();

    constructor(
        private snackbarService: SnackbarService
    ) {}

    execute() {
        var str = null;
        for (let source of this.validationSources) {
            source.touch();
            if (str == null) {
                str = source.getErrorMessage();
            }
        }
        if (str != null) {
            this.snackbarService.show(str);
            return;
        }
        this.onClick.emit();
    }
}