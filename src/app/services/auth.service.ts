import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env";
import { BehaviorSubject, map, Observable, of, tap } from "rxjs";
import { AuthModel } from "@models/auth.model";
import { AuthResponseModel } from "@models/auth-response.model";
import { UserModel } from "@models/user.model";
import { PlatformService } from "./platform.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public static readonly MIN_USERNAME_LENGTH = 1;
    public static readonly MIN_PASSWORD_LENGTH = 8;

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
    }

    register(model: AuthModel): Observable<void> {
        this.extractData(
            this.httpClient.post<AuthResponseModel>(this.baseUrl + "/register", model)
        )
        return this.mock();
    }

    login(model: AuthModel): Observable<void> {
        this.extractData(
            this.httpClient.post<AuthResponseModel>(this.baseUrl + "/register", model)
        )
        return this.mock();
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

    private mock(): Observable<void> {
        this.currentTokenSubject.next("cool-token-228");
        this.currentUserSubject.next({
            username: 'volodyapokalipsis'
        });
        return of(undefined);
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