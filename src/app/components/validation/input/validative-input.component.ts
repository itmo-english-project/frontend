import { Component, EventEmitter, Input, Output, booleanAttribute, forwardRef } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isCapital, isDigitsOnly, Validative } from "../validative";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'vinput',
    standalone: true,
    imports: [FormsModule, CommonModule],
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
    private defaultName = "Field";
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

    @Input() humanReadableName: string | null = null;
    @Input() name: string | null = null;
    @Input() placeholder: string | null = null;
    @Input() innerClass: string = "";
    @Input() validator: (arg0: string) => boolean = () => true;
    @Input() type: string | null = null;
    @Input() autocomplete: string | null = null;
    @Input() invalidClass = "bad";
    @Input() accept: string | null = null;

    @Input() minLength: number | null = null;
    @Input() exactLength: number | null = null;
    @Input({ transform: booleanAttribute }) notEmpty: boolean = false;
    @Input({ transform: booleanAttribute }) digitsOnly: boolean = false;
    @Input({ transform: booleanAttribute }) capital: boolean = false;

    public touched = false;

    get shownName(): string {
        if (this.humanReadableName) {
            return this.humanReadableName;
        }
        if (this.name) {
            return this.name;
        }
        if (this.placeholder) {
            return this.placeholder;
        }
        return this.defaultName;
    } 

    private checkDefault(): string | null {
        const name = this.shownName;
        if ((this.notEmpty || this.minLength || (this.exactLength && this.exactLength != 0)) && !this.value) {
            return `${name} can not be empty`;
        }
        if (this.type === "file") return null;
        if (this.digitsOnly && !isDigitsOnly(this.value)) {
            return `${name} must contain digits only`;
        }
        if (this.capital && !isCapital(this.value)) {
            return `${name} must start with the capital letter`;
        }
        if (this.exactLength && this.value.length != this.exactLength) {
            return `${name} must be exactly ${this.exactLength} symbols long`;
        }
        if (this.minLength && this.value.length < this.minLength) {
            return `${name} must be at least ${this.minLength} symbols long`;
        }
        return null;
    }

    get isValid(): boolean {
        if (this.checkDefault() != null) {
            return false;
        }
        return this.validator(this.value);
    }
    @Input() errorMessage: string | null = null;
    @Input() errorMessageFunc: (arg0: any) => string | null = () => {
        const def = this.checkDefault();
        if (def != null) {
            return def;
        }
        if (!this.validator(this.value)) {
            return this.errorMessage;
        }
        return null;
    };

    @Output() fileSelected = new EventEmitter<File | null>();
    handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;

        this.fileSelected.emit(file);
        this.onChange(file); // optional
        this.onTouched();
    }

    getErrorMessage(): string | null {
        return this.errorMessageFunc(this.value);
    }

    touch(): void {
        this.touched = true;
    }
}