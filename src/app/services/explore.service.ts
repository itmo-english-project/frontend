import { Injectable } from "@angular/core";
import { environment } from "@env";
import { OfferRepository } from './mock/repositories/offer.repository';
import { AuthService } from "./auth.service";
import { SwapRequestCreationModel } from '@models/swap-request-creation.model';
import { UserModel } from "@models/user.model";
import { OfferRequest } from "@models/offer-request.model";
import { SwapRequestModel } from "@models/swap-request.model";

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

    public getSr(id: number) {
        return this.repository.getSr(id);
    }

    public getMy() {
        const user = this.authService.getUser();
        if (user) {
            return this.repository.getMy(user.username);
        }
        return [];
    }

    public createAd(adModel: OfferRequest, user: UserModel, picture: File) {
        return this.repository.createAd(adModel, user, picture);
    }

    public getById(id: number) {
        return this.repository.getById(id);
    }

    public delete(adId: number) {
        this.repository.delete(adId);
    }

    public deleteSr(id: number) {
        this.repository.deleteSr(id);
    }

    public saveSwapRequest(adId: number, sr: SwapRequestCreationModel, user: UserModel, picture: File) {
        return this.repository.saveSwapRequest(adId, sr, user, picture);
    }

    public getUserSwapRequests() {
        const user = this.authService.getUser();
        if (!user) return [];
        return this.repository.getUserSwapRequests(user.username);
    }

    public getRelatedSwapRequests() {
        const user = this.authService.getUser();
        if (!user) return [];
        return this.repository.getRelatedSwapRequests(this.repository.getMy(user.username).map(it => it.id));
    }

    public accept(sr: SwapRequestModel) {
        return this.repository.accept(sr);
    }

    public reject(sr: number) {
        this.deleteSr(sr);
    }
}