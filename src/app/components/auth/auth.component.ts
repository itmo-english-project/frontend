import { Component } from "@angular/core";
import { AuthModel } from "@models/auth.model";
import { AuthService } from "@services/auth.service";
import { RouterService } from "@services/router.service";
import { SnackbarService } from "@services/snackbar.service";
import { Subscription } from "rxjs";
import { ValidativeInput } from "../validation/input/validative-input.component";
import { ValidationButton } from "../validation/button/validation-button.component";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [ValidativeInput, ValidationButton, FormsModule],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss'
})
export class AuthComponent {
    public authModel = new AuthModel();
    private sub = new Subscription();

    constructor(
        private routerService: RouterService,
        private authService: AuthService,
        private snackbarService: SnackbarService
    ) {}

    ngOnInit() {
        if (this.authService.isAuthenticated()) {
            this.routerService.navigateSimple("/");
        }
    }

    public usernameValidator = (str: string) => {
        return str.length >= AuthService.MIN_USERNAME_LENGTH;
    };

    public usernameError = "Username is too short";

    public passwordValidator = (str: string) => {
        return str.length >= AuthService.MIN_PASSWORD_LENGTH;
    }

    public passwordError = "Password is too short";

    login() {
        debugger
        this.sub.add(
            this.authService.login(this.authModel).subscribe({
                next: () => {
                    this.routerService.navigateSimple("/");
                },
                error: err => {
                    if (err.status === 401) {
                        this.snackbarService.show("Invalid login or password");
                    } else {
                        this.snackbarService.err(err);
                    }
                }
            })
        );
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
 }