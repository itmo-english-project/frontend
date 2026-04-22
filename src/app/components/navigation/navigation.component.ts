import { Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { RouterLink } from "@angular/router";
import { UserModel } from "@models/user.model";
import { AuthService } from "@services/auth.service";
import { PlatformService } from "@services/platform.service";
import { RouterService } from "@services/router.service";
import { finalize } from "rxjs";

interface MenuLink {
    icon: string | null,
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
            url: ''
        },
        {
            icon: 'i-list',
            text: 'My ads',
            url: 'ads'
        },
        {
            icon: 'i-social',
            text: 'Swap requests',
            url: 'swap-requests'
        },
        {
            icon: 'i-plus',
            text: 'Create ad',
            url: 'create-ad'
        },
        {
            icon: null,
            text: 'Watch ad',
            url: 'ad'
        },
        {
            icon: null,
            text: 'User settings',
            url: 'user-settings'
        },
        {
            icon: null,
            text: 'Swap request',
            url: 'swap-request'
        },
    ];

    @ViewChild('userDropdown') userDropdown!: ElementRef;
    @ViewChild('popupMenu') popupMenu!: ElementRef;

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (
            this.popupMenu
            && this.userDropdown
            && !this.popupMenu.nativeElement.contains(event.target)
            && !this.userDropdown.nativeElement.contains(event.target)
        ) {
            this.doShowRightMenuPc = false;
        }
    }

    localUrl = "";
    title = "";
    user: UserModel | null = null;
    onLoad = true;
    doShowLeftMenu = false;
    doShowRightMenu = false;
    doShowRightMenuPc = false;

    constructor(
        private routerService: RouterService,
        private authService: AuthService,
        private platformService: PlatformService
    ) {}

    ngOnInit() {
        this.localUrl = this.routerService.getLocalUrl();
        if (this.localUrl) {
            this.title = this.menuLinks.find(it => this.routerService.urlContains(it.url))!.text;
        } else {
            this.title = this.menuLinks[0].text;
        }
        
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

    toggleRightMenuPc() {
        this.doShowRightMenuPc = !this.doShowRightMenuPc;
        this.doShowRightMenu = this.doShowRightMenuPc;
        if (this.doShowRightMenu && this.doShowLeftMenu) {
            this.doShowLeftMenu = false;
        }
    }

    toggleRightMenu() {
        this.doShowRightMenu = !this.doShowRightMenu;
        this.doShowRightMenuPc = this.doShowRightMenu;
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