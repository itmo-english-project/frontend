import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class RouterService {
    constructor(
        private router: Router
    ) {}

    navigate(path: string, queryParams: any = {}) {
        this.router.navigate([path], { queryParams });
    }

    navigateSimple(path: string) {
        window.location.href = path;
    }
}