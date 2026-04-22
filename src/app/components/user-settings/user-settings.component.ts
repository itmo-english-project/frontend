import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NavigationComponent } from "@components/navigation/navigation.component";
import { AuthService } from "@services/auth.service";
import { PlatformService } from "@services/platform.service";
import { SnackbarService } from "@services/snackbar.service";

@Component({
    selector: 'user-settings',
    standalone: true,
    imports: [NavigationComponent, FormsModule],
    templateUrl: './user-settings.component.html',
    styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {
    model: string = "";
    constructor(
        private authService: AuthService,
        private platformService: PlatformService,
        private snackbarService: SnackbarService
    ) {}

    ngOnInit() {
        if (!this.platformService.isBrowser) return;
        this.model = this.authService.getUser()!.contactInfo;
    }

    updateInfo() {
        this.authService.saveContactInfo(this.model);
        this.snackbarService.show("Saved");
    }
}