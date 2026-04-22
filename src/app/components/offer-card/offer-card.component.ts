import { Component, Input } from "@angular/core";
import { OfferModel } from "@models/offer.model";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'offer-card',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './offer-card.component.html',
    styleUrl: './offer-card.component.scss'
})
export class OfferCard {
    @Input() value!: {
        id: number
        title: string
        pictures: string[]
        description: string
    };
    @Input() url!: string;

    public get shortDesc(): string {
        return this.value.description.substring(0, 60) + '...';
    }
}