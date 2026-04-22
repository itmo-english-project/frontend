import { Component } from "@angular/core";
import { NavigationComponent } from "@components/navigation/navigation.component";
import { OfferModel } from "@models/offer.model";
import { ExploreService } from "@services/explore.service";
import { OfferCard } from "@components/offer-card/offer-card.component";
import { RouterService } from "@services/router.service";
import { AuthService } from "@services/auth.service";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NavigationComponent, OfferCard],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    constructor(
        private exploreService: ExploreService,
        private routerService: RouterService,
        private authService: AuthService
    ) {}

    values: OfferModel[] = [];

    ngOnInit() {
        if (this.routerService.getLocalUrl() == 'ads' && this.authService.getUser()) {
            this.values = this.exploreService.getMy();
        } else {
            this.values = this.exploreService.get();
        }
    }
}