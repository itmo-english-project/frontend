import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ImageRepository {

    async saveImage(file: File): Promise<string> {
        return this.fileToBase64(file);
    }

    async getImageUrl(base64: string): Promise<string | null> {
        return base64 ?? null;
    }

    fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    revokeUrl(_url: string): void {
        // no-op, base64 doesn't need revocation
    }
}