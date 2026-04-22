import { Injectable } from "@angular/core";
import { environment } from "@env";
import { OfferRepository } from './mock/repositories/offer.repository';
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class ExploreService {
    private readonly baseUrl = environment.apiDomain + "/explore";

    constructor(
        private repository: OfferRepository,
        private authService: AuthService
    ) {}

    public get() {
        return this.repository.get();
    }

    public getMy() {
        const user = this.authService.getUser();
        if (user) {
            return this.repository.getMy(user.username);
        }
        return [];
    }
}