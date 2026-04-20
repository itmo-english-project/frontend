
export interface Validative {
    touch(): void;
    get isValid() : boolean;
    getErrorMessage(): string | null;
}

export function isDigitsOnly(str: string): boolean {
    return /^\d+$/.test(str);
}

export function isCapital(str: string): boolean {
    debugger
    return str[0] == str[0].toUpperCase();
}