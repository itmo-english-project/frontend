import { Component } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { RouterService } from "@services/router.service";
import { NavigationComponent } from "@components/navigation/navigation.component";
import { ExploreService } from "@services/explore.service";
import { OfferModel } from "@models/offer.model";
import { PlatformService } from "@services/platform.service";
import { AuthService } from "@services/auth.service";
import { UserModel } from "@models/user.model";
import { PopupMenu } from "@components/popup-menu/popup-menu.component";
import { SnackbarService } from "@services/snackbar.service";
import { ValidativeInput } from "@components/validation/input/validative-input.component";
import { ValidationButton } from "@components/validation/button/validation-button.component";
import { SwapRequestCreationModel } from "@models/swap-request-creation.model";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-ad',
    standalone: true,
    imports: [NavigationComponent, PopupMenu, RouterLink, ValidativeInput, ValidationButton, FormsModule],
    templateUrl: './ad.component.html',
    styleUrl: './ad.component.scss'
})
export class AdComponent {
    ad: OfferModel | null = null;
    user: UserModel | null = null;
    swapRequestCreationModel = new SwapRequestCreationModel();
    image: File | null = null;

    constructor(
        private route: ActivatedRoute,
        private exploreService: ExploreService,
        private routerService: RouterService,
        private platformService: PlatformService,
        public snackbarService: SnackbarService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        if (!this.platformService.isBrowser) return;
        const id = Number(this.routerService.getParam('id', this.route));
        if (id) {
            this.ad = this.exploreService.getById(id) ?? null;
            if (!this.ad) {
                this.routerService.navigate('');
            }
        } else {
            this.routerService.navigate('');
        }
        this.user = this.authService.getUser();
        this.swapRequestCreationModel.pictures = [""];
    }

    async createSwapRequest() {
        if (!this.image) {
            this.snackbarService.show("No image");
            return;
        }
        await this.exploreService.saveSwapRequest(this.ad!.id, this.swapRequestCreationModel, this.user!, this.image!);
        this.routerService.navigate("/swap-requests");
        this.snackbarService.show("Successful creation");
    }

    delete() {
        this.exploreService.delete(this.ad!.id);
        this.snackbarService.show("Successful deletion");
        this.routerService.navigate('ads');
    }

    onImageSelected(file: File | null) {
        this.image = file;
    }
}