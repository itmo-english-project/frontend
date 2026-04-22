import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NavigationComponent } from "@components/navigation/navigation.component";
import { ValidativeInput } from "@components/validation/input/validative-input.component";
import { ValidationButton } from "@components/validation/button/validation-button.component";
import { OfferRequest } from "@models/offer-request.model";
import { SnackbarService } from "@services/snackbar.service";
import { ExploreService } from "@services/explore.service";
import { RouterService } from "@services/router.service";
import { AuthService } from "@services/auth.service";
import { UserModel } from "@models/user.model";

@Component({
    selector: 'create-ad',
    standalone: true,
    imports: [NavigationComponent, ValidativeInput, FormsModule, ValidationButton],
    templateUrl: './create-ad.component.html',
    styleUrl: './create-ad.component.scss'
})
export class CreateAdComponent {
    image: File | null = null;
    adModel: OfferRequest = new OfferRequest();

    constructor(
        public snackbarService: SnackbarService,
        private exploreService: ExploreService,
        private routerService: RouterService,
        private authService: AuthService
    ) {}
    onImageSelected(file: File | null) {
        this.image = file;
    }
    async createAd() {
        if (!this.image) {
            this.snackbarService.show("Enter image");
            return;
        }
        let user = this.authService.getUser()!;
        await this.exploreService.createAd(this.adModel, user, this.image);
        this.snackbarService.show("Successful creation");
        this.routerService.navigateSimple('');
    }
}