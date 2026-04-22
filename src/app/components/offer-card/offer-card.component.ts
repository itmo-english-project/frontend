import { Component, Input } from "@angular/core";
import { OfferModel } from "@models/offer.model";

@Component({
    selector: 'offer-card',
    standalone: true,
    imports: [],
    templateUrl: './offer-card.component.html',
    styleUrl: './offer-card.component.scss'
})
export class OfferCard {
    @Input() value!: OfferModel;

    public get shortDesc(): string {
        return this.value.description.substring(0, 60) + '...';
    }
}