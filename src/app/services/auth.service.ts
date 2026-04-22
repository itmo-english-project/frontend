import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { BehaviorSubject, map, Observable, of, tap, throwError } from "rxjs";
import { AuthResponseModel } from "@models/auth-response.model";
import { UserModel } from "@models/user.model";
import { PlatformService } from "./platform.service";
import { LoginModel } from "@models/login.model";
import { RegisterModel } from "@models/register.model";

interface MockUser {
    user: UserModel,
    password: string
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public static readonly MIN_USERNAME_LENGTH = 1;
    public static readonly MIN_NAME_LENGTH = 1;
    public static readonly MIN_PASSWORD_LENGTH = 8;
    public static readonly ISU_LENGTH = 6;

    private readonly mockUsers: MockUser[] = [];

    private readonly MOCK_KEY = "MOCK_USERS"
    private readonly TOKEN_KEY = 'access_token';
    private readonly USER_KEY = 'user';
    private currentTokenSubject = new BehaviorSubject<string | null>(null);
    public currentToken$ = this.currentTokenSubject.asObservable();

    private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private readonly baseUrl = environment.apiDomain + "/auth";
    constructor(
        private httpClient: HttpClient,
        private platformService: PlatformService
    ) {
        this.initializeSession();
        if (!platformService.isBrowser) return;
        if (environment.mock) {
            const data = localStorage.getItem(this.MOCK_KEY);
            if (data) {
                this.mockUsers = JSON.parse(data);
            }
        }
    }

    register(model: RegisterModel): Observable<void> {
        if (environment.mock) {
            const col = this.mockUsers.find(it => it.user.username == model.username || it.user.isu == model.isu);
            if (col) {
                const errorResponse = new HttpErrorResponse({
                    error: {
                        field: col.user.username == model.username ? "username" : "isu",
                        value: col.user.username == model.username ? model.username : model.isu
                    },
                    status: 409,
                    statusText: 'Conflict'
                });
                return throwError(() => errorResponse)
            }
            const user = {
                username: model.username,
                fullName: `${model.firstName} ${model.lastName}`,
                isu: model.isu,
                contactInfo: ''
            }
            this.mockUsers.push({user, password: model.password});
            localStorage.setItem(this.MOCK_KEY, JSON.stringify(this.mockUsers));
            this.setSession({token: "cool-token", user});
            return of(undefined);
        } else {
            return this.extractData(
                this.httpClient.post<AuthResponseModel>(this.baseUrl + "/register", model)
            );
        }
    }

    login(model: LoginModel): Observable<void> {
        if (environment.mock) {
            const col = this.mockUsers.find(it => it.user.username == model.username || it.user.isu == model.username);
            if (!col) {
                const errorResponse = new HttpErrorResponse({
                    error: '',
                    status: 404,
                    statusText: 'Not found'
                });
                return throwError(() => errorResponse)
            }
            if (col.password != model.password) {
                const errorResponse = new HttpErrorResponse({
                    error: '',
                    status: 401,
                    statusText: 'Unauthorized'
                });
                return throwError(() => errorResponse)
            }
            this.setSession({token: "cool-token", user: col.user});
            return of(undefined);
        } else {
            return this.extractData(
                this.httpClient.post<AuthResponseModel>(this.baseUrl + "/register", model)
            );
        }
    }

    getToken(): string | null {
        return this.currentTokenSubject.value;
    }

    getUser(): UserModel | null {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return this.getToken() != null;
    }

    logout(): Observable<void> {
        this.clearSession();
        return of();
    }

    public saveContactInfo(ci: string) {
        let user = this.getUser();
        if (user) {
            let tUser = this.mockUsers.find(it => it.user.username == user.username)
            if (tUser) {
                tUser.user.contactInfo = ci;
            }
            user.contactInfo = ci;
            this.currentUserSubject.next(user);
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
            localStorage.setItem(this.MOCK_KEY, JSON.stringify(this.mockUsers));
        }
    }

    private clearSession() {
        if (!this.platformService.isBrowser) {
            return;
        }
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    private extractData(authResponse: Observable<AuthResponseModel>): Observable<void> {
        return authResponse.pipe(
            tap(this.setSession),
            map(_ => {})
        )
    }

    private initializeSession() {
        this.currentTokenSubject.next(this.loadToken());
        this.currentUserSubject.next(this.loadUser());
    }

    private loadToken(): string | null {
        if (!this.platformService.isBrowser) {
            return null;
        }
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private loadUser(): UserModel | null {
        if (!this.platformService.isBrowser) {
            return null;
        }
        const user = localStorage.getItem(this.USER_KEY);
        if (user) {
            return JSON.parse(user);
        } else {
            return null;
        }
    }

    private setSession(response: AuthResponseModel){
        if (!this.platformService.isBrowser) {
            return;
        }
        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        this.currentTokenSubject.next(response.token);
        this.currentUserSubject.next(response.user);
    }  
}