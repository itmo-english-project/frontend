import { booleanAttribute, Component, EventEmitter, Input, Output } from "@angular/core";
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
    @Input({ transform: booleanAttribute }) disableIfInvalid: boolean | string = false; 

    constructor(
        private snackbarService: SnackbarService
    ) {}

    get isValid(): boolean {
        return this.validationSources.every(it => {
            try {
                return it.isValid;
            } catch {
                return false;
            }
        });
    }

    execute() {
        var str = null;
        var anyInvalid = false;
        for (let source of this.validationSources) {
            source.touch();
            if (source.isValid) {
                continue;
            }
            anyInvalid = true;
            if (str == null) {
                str = source.getErrorMessage();
            }
        }
        if (anyInvalid) {
            this.snackbarService.show(str ? str : "Error");
            return;
        }
        this.onClick.emit();
    }
}