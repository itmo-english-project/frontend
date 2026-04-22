import { Component } from "@angular/core";
import { NavigationComponent } from "@components/navigation/navigation.component";
import { OfferModel } from "@models/offer.model";
import { ExploreService } from "@services/explore.service";
import { OfferCard } from "@components/offer-card/offer-card.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NavigationComponent, OfferCard],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    constructor(
        private exploreService: ExploreService
    ) {}

    values: OfferModel[] = [];

    ngOnInit() {
        this.values = this.exploreService.get();
    }
}