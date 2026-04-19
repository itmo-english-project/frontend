
export interface Validative {
    touch(): void;
    get isValid() : boolean;
    getErrorMessage(): string | null;
}