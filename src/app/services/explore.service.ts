import { Injectable } from "@angular/core";
import { environment } from "@env";
import { OfferRepository } from './mock/repositories/offer.repository';

@Injectable({
    providedIn: 'root'
})
export class ExploreService {
    private readonly baseUrl = environment.apiDomain + "/explore";

    constructor(
        private repository: OfferRepository
    ) {}

    public get() {
        return this.repository.get();
    }
}