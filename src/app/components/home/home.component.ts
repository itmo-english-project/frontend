import { Component } from "@angular/core";
import { NavigationComponent } from "@components/navigation/navigation.component";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NavigationComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    constructor() {}
}