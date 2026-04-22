import { Injectable } from "@angular/core";
import { environment } from "@env";
import { OfferModel } from "@models/offer.model";
import { PlatformService } from "@services/platform.service";

const fish = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const defaultData: OfferModel[] = [
    {
        id: 0,
        author: {
            username: 'volodyapokalipsis',
            isu: '676767',
            fullName: 'Vladimir Pokalipsis'
        },
        title: "Will swap the awl for the soap",
        description: fish,
        pictures: ["/assets/mock/1.png", "/assets/mock/2.png"],
        dueTime: null,
        creationDate: new Date(),
        swapRequest: null,
        tags: ["soap", "awl", "itmo"],
        status: "active"
    },
    {
        id: 1,
        author: {
            username: 'hhhannahmmmontana',
            isu: '239239',
            fullName: 'Miley Cyrus'
        },
        title: "Lorem ipsum dolor sit amet",
        description: fish,
        pictures: ["/assets/mock/3.png"],
        dueTime: null,
        creationDate: new Date(),
        swapRequest: null,
        tags: ["lorem", "ipsum", "dolor"],
        status: "active"
    },
    {
        id: 2,
        author: {
            username: 'hhhannahmmmontana',
            isu: '239239',
            fullName: 'Miley Cyrus'
        },
        title: "Lorem ipsum dolor sit amet",
        description: fish,
        pictures: ["/assets/mock/1.png"],
        dueTime: null,
        creationDate: new Date(),
        swapRequest: null,
        tags: ["lorem", "ipsum", "dolor"],
        status: "active"
    },
    {
        id: 3,
        author: {
            username: 'hhhannahmmmontana',
            isu: '239239',
            fullName: 'Miley Cyrus'
        },
        title: "Lorem ipsum dolor sit amet",
        description: fish,
        pictures: ["/assets/mock/2.png"],
        dueTime: null,
        creationDate: new Date(),
        swapRequest: null,
        tags: ["lorem", "ipsum", "dolor"],
        status: "active"
    },
    {
        id: 4,
        author: {
            username: 'hhhannahmmmontana',
            isu: '239239',
            fullName: 'Miley Cyrus'
        },
        title: "Lorem ipsum dolor sit amet",
        description: fish,
        pictures: ["/assets/mock/3.png"],
        dueTime: null,
        creationDate: new Date(),
        swapRequest: null,
        tags: ["lorem", "ipsum", "dolor"],
        status: "active"
    },
]
const defaultDataCounter = 5;

@Injectable({
    providedIn: 'root'
})
export class OfferRepository {
    private readonly TOPIC_KEY = "MOCK_OFFERS";
    private readonly COUNTER_KEY = "MOCK_OFFERS_COUNTER";
    private counter = 0;
    private data: OfferModel[] = [];

    constructor(
        platformService: PlatformService
    ) {
        if (!platformService.isBrowser) return;
        this.initialize();
    }

    public initialize() {
        if (environment.mock) {
            var strData = localStorage.getItem(this.TOPIC_KEY);
            if (!strData) {
                localStorage.setItem(this.TOPIC_KEY, JSON.stringify(defaultData));
                localStorage.setItem(this.COUNTER_KEY, JSON.stringify(defaultDataCounter));
                this.data = defaultData;
            } else {
                this.data = JSON.parse(strData);
                this.counter = JSON.parse(localStorage.getItem(this.COUNTER_KEY)!);
            }
        } else {
            localStorage.removeItem(this.TOPIC_KEY);
        }
    }

    public get() {
        return this.data;
    }
}