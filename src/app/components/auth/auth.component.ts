import { Component } from "@angular/core";
import { LoginModel } from "@models/login.model";
import { AuthService } from "@services/auth.service";
import { RouterService } from "@services/router.service";
import { SnackbarService } from "@services/snackbar.service";
import { Subscription } from "rxjs";
import { ValidativeInput } from "../validation/input/validative-input.component";
import { ValidationButton } from "../validation/button/validation-button.component";
import { FormsModule } from "@angular/forms";
import { RegisterModel } from "@models/register.model";
import { RouterLink } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { CollisionModel } from "@models/collision.model";
import { humanReadables } from "../../constants/human-readables.constants";

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [ValidativeInput, ValidationButton, FormsModule, RouterLink],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss'
})
export class AuthComponent {
    public type = "";
    public loginModel = new LoginModel();
    public registerModel = new RegisterModel();
    private sub = new Subscription();
    public readonly MIN_NAME = AuthService.MIN_NAME_LENGTH;
    public readonly MIN_USERNAME = AuthService.MIN_USERNAME_LENGTH;
    public readonly MIN_PASSWORD = AuthService.MIN_PASSWORD_LENGTH;
    public readonly ISU_LENGTH = AuthService.ISU_LENGTH;

    constructor(
        private routerService: RouterService,
        private authService: AuthService,
        public snackbarService: SnackbarService
    ) {}

    ngOnInit() {
        if (this.authService.isAuthenticated()) {
            this.routerService.navigateSimple("/");
        }
        this.type = this.routerService.getLocalUrl();
    }

    humanReadable(str: string): string | null {
        return humanReadables.get(str) ?? null;
    }

    login() {
        this.sub.add(
            this.authService.login(this.loginModel).subscribe({
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

    register() {
        this.sub.add(
            this.authService.register(this.registerModel).subscribe({
                next: () => {
                    this.routerService.navigateSimple("/");
                },
                error: (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.snackbarService.fatal();
                    } else if (err.status === 409) {
                        const collision = err.error as CollisionModel;
                        if (collision.field === "username") {
                            this.snackbarService.show("Username is already taken");
                        } else if (collision.field === "isu") {
                            this.snackbarService.show("ISU ID is already taken");
                        } else {
                            this.snackbarService.fatal();
                        }
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