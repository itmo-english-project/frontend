import { Component, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Validative } from "../validative";

@Component({
    selector: 'vinput',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './validative-input.component.html',
    styleUrl: './validative-input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ValidativeInput),
            multi: true
        }
    ]
})
export class ValidativeInput implements Validative, ControlValueAccessor {
    public value = "";
    onChange: any = () => {};
    onTouched: any = () => {};
    writeValue(val: any): void { this.value = val; }
    registerOnChange(fn: any): void { this.onChange = fn; }
    registerOnTouched(fn: any): void { this.onTouched = fn; }

    handleInput(event: any) {
        this.value = event.target.value;
        this.onChange(this.value);
    }

    @Input() name = "";
    @Input() placeholder = "";
    @Input() innerClass = "";
    @Input() validator: (arg0: string) => boolean = () => true;
    @Input() type = "";
    @Input() autocomplete = "";

    public touched = false;
    get isValid(): boolean {
        return this.validator(this.value);
    }
    @Input() errorMessage: string | null = null;
    @Input() errorMessageFunc: (arg0: any) => string | null = () => {
        return (this.isValid) ? null : this.errorMessage;
    };

    getErrorMessage(): string | null {
        return this.errorMessageFunc(this.value);
    }

    touch(): void {
        this.touched = true;
    }

}