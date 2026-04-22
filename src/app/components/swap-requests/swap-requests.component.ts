import { Component } from "@angular/core";
import { NavigationComponent } from "@components/navigation/navigation.component";
import { OfferCard } from "@components/offer-card/offer-card.component";
import { SwapRequestModel } from "@models/swap-request.model";
import { ExploreService } from "@services/explore.service";
import { PlatformService } from "@services/platform.service";

@Component({
    selector: 'swap-requests',
    standalone: true,
    imports: [NavigationComponent, OfferCard],
    templateUrl: './swap-requests.component.html',
    styleUrl: './swap-requests.component.scss'
})
export class SwapRequestsComponent {
    my: SwapRequestModel[] = [];
    related: SwapRequestModel[] = [];

    constructor(
        private exploreService: ExploreService,
        private platformService: PlatformService
    ) {
        if (!this.platformService.isBrowser) return;
        this.my = this.exploreService.getUserSwapRequests();
        this.related = this.exploreService.getRelatedSwapRequests();
    }
}