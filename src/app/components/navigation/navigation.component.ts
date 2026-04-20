import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { UserModel } from "@models/user.model";
import { AuthService } from "@services/auth.service";
import { PlatformService } from "@services/platform.service";
import { RouterService } from "@services/router.service";
import { finalize } from "rxjs";

interface MenuLink {
    icon: string,
    text: string,
    url: string
}

@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
    menuLinks: MenuLink[] = [
        {
            icon: 'i-search',
            text: 'Explore',
            url: '/'
        },
        {
            icon: 'i-list',
            text: 'My ads',
            url: '/ads'
        },
        {
            icon: 'i-social',
            text: 'Swap requests',
            url: '/swap-requests'
        },
        {
            icon: 'i-plus',
            text: 'Create ad',
            url: '/create'
        }
    ];

    localUrl = "";
    title = "";
    user: UserModel | null = null;
    onLoad = true;
    doShowLeftMenu = false;
    doShowRightMenu = false;

    constructor(
        private routerService: RouterService,
        private authService: AuthService,
        private platformService: PlatformService
    ) {}

    ngOnInit() {
        this.localUrl = this.routerService.getLocalUrl();
        this.title = this.menuLinks.find(it => it.url == '/' + this.localUrl)!.text;
        if (this.platformService.isBrowser) {
            if (!this.authService.isAuthenticated()) {
                this.routerService.navigate("/register");
            }
            this.user = this.authService.getUser();
            this.onLoad = false;
        }
    }

    toggleLeftMenu() {
        this.doShowLeftMenu = !this.doShowLeftMenu;
        if (this.doShowRightMenu && this.doShowLeftMenu) {
            this.doShowRightMenu = false;
        }
    }

    toggleRightMenu() {
        this.doShowRightMenu = !this.doShowRightMenu;
        if (this.doShowRightMenu && this.doShowLeftMenu) {
            this.doShowLeftMenu = false;
        }
    }

    logout() {
        this.authService.logout().pipe(finalize(() => {
            this.user = null;
            this.routerService.navigateSimple("/login");
        })).subscribe();
    }

    get anyMenuShown() {
        return this.doShowLeftMenu || this.doShowRightMenu;
    }

    closeWindows() {
        this.doShowLeftMenu = false;
        this.doShowRightMenu = false;
    }
}