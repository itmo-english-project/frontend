import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import("@components/home/home.component").then(m => m.HomeComponent)
    },
    {
        path: 'ads',
        loadComponent: () =>
            import("@components/home/home.component").then(m => m.HomeComponent)
    },
    {
        path: 'ad/:id',
        loadComponent: () =>
            import("@components/ad/ad.component").then(m => m.AdComponent)
    },
    {
        path: 'login',
        loadComponent: () =>
            import("@components/auth/auth.component").then(m => m.AuthComponent)
    },
    {
        path: 'register',
        loadComponent: () =>
            import("@components/auth/auth.component").then(m => m.AuthComponent)
    },
    {
        path: 'user-settings',
        loadComponent: () =>
            import("@components/user-settings/user-settings.component").then(m => m.UserSettingsComponent)
    },
    {
        path: 'swap-requests',
        loadComponent: () =>
            import("@components/swap-requests/swap-requests.component").then(m => m.SwapRequestsComponent)
    },
    {
        path: 'swap-request/:id',
        loadComponent: () =>
            import("@components/swap-request/swap-request.component").then(m => m.SwapRequestComponent)
    },
    {
        path: 'create-ad',
        loadComponent: () =>
            import("@components/create-ad/create-ad.component").then(m => m.CreateAdComponent)
    }
];
