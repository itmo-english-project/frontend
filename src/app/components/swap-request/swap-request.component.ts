import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavigationComponent } from "@components/navigation/navigation.component";
import { SwapRequestModel } from "@models/swap-request.model";
import { ExploreService } from "@services/explore.service";
import { PlatformService } from "@services/platform.service";
import { RouterService } from "@services/router.service";
import { PopupMenu } from "@components/popup-menu/popup-menu.component";
import { AuthService } from "@services/auth.service";
import { UserModel } from "@models/user.model";
import { SnackbarService } from "@services/snackbar.service";
import { OfferModel } from "@models/offer.model";

@Component({
    selector: 'swap-request',
    standalone: true,
    imports: [NavigationComponent, PopupMenu],
    templateUrl: './swap-request.component.html',
    styleUrl: './swap-request.component.scss'
})
export class SwapRequestComponent {
    @ViewChild('infoPopup') infoPopup!: PopupMenu;
    user: UserModel | null = null;
    swapRequest: SwapRequestModel | null = null;
    ad: OfferModel | null = null;
    info: string = "";

    constructor(
        private route: ActivatedRoute,
        private explorerService: ExploreService,
        private platformService: PlatformService,
        private routerService: RouterService,
        private authService: AuthService,
        private snackbarService: SnackbarService
    ) {}

    ngOnInit() {
        if (!this.platformService.isBrowser) return;
        const id = Number(this.routerService.getParam('id', this.route));
        if (!id) {
            this.routerService.navigate('');
            return;
        }
        this.swapRequest = this.explorerService.getSr(id) ?? null;
        if (!this.swapRequest) {
            this.routerService.navigate('');
            return;
        }
        this.ad = this.explorerService.getById(this.swapRequest.offerId)!;
        this.user = this.authService.getUser();
        if (!this.user) {
            this.routerService.navigate('');
            return;
        }
        if (
            this.swapRequest.author.username !== this.user.username &&
            !this.explorerService.getMy().find(it => it.id === this.swapRequest!.offerId)
        ) {
            this.routerService.navigate('');
            return;
        }
    }

    accept() {
        this.info = this.explorerService.accept(this.swapRequest!);
        this.infoPopup.show();
    }

    reject() {
        this.explorerService.reject(this.swapRequest!.id);
        this.snackbarService.show("Rejected");
        this.routerService.navigate('/swap-requests');
    }

    delete() {
        this.explorerService.deleteSr(this.swapRequest!.id);
        this.snackbarService.show("Successful deletion");
        this.routerService.navigate('');
    }
}