import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, Observable } from "rxjs";

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

    getLocalUrl(): string {
        return this.router.url.split('/').pop() || '';
    }

    urlContains(pt: string): boolean {
        return !!this.router.url.split('/').find(it => it == pt);
    }

    getParam(name: string, route: ActivatedRoute) {
        const param = route.snapshot.paramMap.get(name);
        return param;
    }
}