import { booleanAttribute, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'popup-menu',
    standalone: true,
    imports: [],
    templateUrl: './popup-menu.component.html',
    styleUrl: './popup-menu.component.scss'
})
export class PopupMenu {
    @Input({transform: booleanAttribute}) debug = false;
    doShow: boolean = false;

    ngOnInit() {
        this.doShow = this.debug;
    }

    public show() {
        this.doShow = true;
    }

    public close() {
        this.doShow = false;
    }
}