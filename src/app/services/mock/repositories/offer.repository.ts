import { Injectable } from "@angular/core";
import { environment } from "@env";
import { OfferModel } from "@models/offer.model";
import { PlatformService } from "@services/platform.service";
import { ImageRepository } from './image.repository';
import { SwapRequestCreationModel } from "@models/swap-request-creation.model";
import { SwapRequestModel } from "@models/swap-request.model";
import { UserModel } from "@models/user.model";
import { OfferRequest } from "@models/offer-request.model";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

const fish = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

let abLogo: Promise<File>;
const defaultData: OfferModel[] = [
    {
        id: 1,
        author: {
            username: 'volodyapokalipsis',
            isu: '676767',
            fullName: 'Vladimir Pokalipsis',
            contactInfo: 'TG: @volodyapokalipsis'
        },
        title: "Will swap the awl for the soap",
        description: fish,
        pictures: ["/assets/images/mock/1.png", "/assets/images/mock/2.png"],
        dueTime: null,
        creationDate: new Date(),
        swapRequest: null,
        tags: ["soap", "awl", "itmo"],
        status: "active"
    },
    {
        id: 2,
        author: {
            username: 'hhhannahmmmontana',
            isu: '239239',
            fullName: 'Miley Cyrus',
            contactInfo: 'TG: @hhhannahmmmontana'
        },
        title: "Lorem ipsum dolor sit amet",
        description: fish,
        pictures: ["/assets/images/mock/3.png"],
        dueTime: null,
        creationDate: new Date(),
        swapRequest: null,
        tags: ["lorem", "ipsum", "dolor"],
        status: "active"
    },
    {
        id: 3,
        author: {
            username: 'v',
            isu: '123123',
            fullName: 'A B',
            contactInfo: 'TG: @v'
        },
        title: "Lorem ipsum dolor sit amet",
        description: fish,
        pictures: ["/assets/images/mock/1.png"],
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
            fullName: 'Miley Cyrus',
            contactInfo: 'TG: @hhhannahmmmontana'
        },
        title: "Lorem ipsum dolor sit amet",
        description: fish,
        pictures: ["/assets/images/mock/2.png"],
        dueTime: null,
        creationDate: new Date(),
        swapRequest: null,
        tags: ["lorem", "ipsum", "dolor"],
        status: "active"
    },
    {
        id: 5,
        author: {
            username: 'hhhannahmmmontana',
            isu: '239239',
            fullName: 'Miley Cyrus',
            contactInfo: 'TG: @hhhannahmmmontana'
        },
        title: "Lorem ipsum dolor sit amet",
        description: fish,
        pictures: ["/assets/images/mock/3.png"],
        dueTime: null,
        creationDate: new Date(),
        swapRequest: null,
        tags: ["lorem", "ipsum", "dolor"],
        status: "active"
    },
]
const defaultDataCounter = 6;

const autobot: UserModel = {
    username: 'auto-bot',
    fullName: 'Auto Bot',
    contactInfo: 'TG: AUTOBOT',
    isu: '567890'
}

@Injectable({
    providedIn: 'root'
})
export class OfferRepository {
    private readonly TOPIC_KEY = "MOCK_OFFERS";
    private readonly COUNTER_KEY = "MOCK_OFFERS_COUNTER";
    private readonly SWAP_REQUEST_KEY = "SWAP_REQUEST_KEY";
    private counter = 0;
    private data: OfferModel[] = [];
    private srs: SwapRequestModel[] = [];

    constructor(
        private platformService: PlatformService,
        private imageRepository: ImageRepository,
        private httpClient: HttpClient
    ) {
        if (!platformService.isBrowser) return;
        abLogo = this.getFileFromAssets("/assets/images/mock/autobot.png", "autobot.png");
        this.initialize();
    }

    async getFileFromAssets(path: string, fileName: string): Promise<File> {
        const blob = await firstValueFrom(
            this.httpClient.get(path, { responseType: 'blob' })
        );
        return new File([blob], fileName, { type: blob.type });
    }

    public initialize() {
        if (environment.mock) {
            var strData = localStorage.getItem(this.TOPIC_KEY);
            if (!strData) {
                this.data = defaultData;
                this.counter = defaultDataCounter;
                this.updateStorage();
            } else {
                this.data = JSON.parse(strData);
                this.counter = JSON.parse(localStorage.getItem(this.COUNTER_KEY)!);
                let srsnp = localStorage.getItem(this.SWAP_REQUEST_KEY);
                if (srsnp) {
                    this.srs = JSON.parse(srsnp)!;
                }
            }
        } else {
            localStorage.removeItem(this.TOPIC_KEY);
            localStorage.removeItem(this.SWAP_REQUEST_KEY);
            localStorage.removeItem(this.COUNTER_KEY);
        }
    }

    public deleteSr(id: number) {
        this.srs = this.srs.filter(it => it.id !== id);
        this.data.find(it => it.swapRequest === id)!.swapRequest = null;
        this.updateStorage();
    }

    public getSr(id: number) {
        return this.srs.find(it => it.id === id);
    }

    public async createAd(adModel: OfferRequest, author: UserModel, picture: File) {
        debugger
        const res = await this.imageRepository.saveImage(picture);
        var model: OfferModel = {
            id: this.counter++,
            author,
            title: adModel.title,
            description: adModel.description,
            pictures: [res],
            dueTime: null,
            creationDate: new Date(),
            swapRequest: null,
            tags: ["lorem", "ipsum", "dolor"],
            status: "active"
        }
        const res2 = await this.imageRepository.saveImage(await abLogo);
        var nSr: SwapRequestModel = {
            id: this.counter++,
            offerId: model.id,
            title: "AUTOBOT",
            author: autobot,
            description: "AUTOBOT",
            pictures: [res2],
            surchargeKopecks: 0,
            creationDate: new Date(),
            status: "pending"
        }
        debugger
        model.swapRequest = nSr.id;
        this.srs = [...this.srs, nSr];
        this.data = [...this.data, model];
        this.updateStorage();
    }

    public get() {
        return this.data;
    }

    public getMy(username: string) {
        return this.get().filter(d => d.author.username == username);
    }

    public getById(id: number) {
        return this.get().find(d => d.id == id);
    }

    public delete(id: number) {
        this.data = this.data.filter(d => d.id !== id);
        this.srs = this.srs.filter(d => d.offerId !== id);
        this.updateStorage();
    }

    private updateStorage() {
        localStorage.setItem(this.TOPIC_KEY, JSON.stringify(this.data));
        localStorage.setItem(this.COUNTER_KEY, JSON.stringify(this.counter));
        localStorage.setItem(this.SWAP_REQUEST_KEY, JSON.stringify(this.srs));
    }

    public async saveSwapRequest(adId: number, sr: SwapRequestCreationModel, user: UserModel, picture: File) {
        const res = await this.imageRepository.saveImage(picture);
        var nSr: SwapRequestModel = {
            id: this.counter++,
            offerId: adId,
            title: sr.title,
            author: user,
            description: sr.description,
            pictures: [res],
            surchargeKopecks: sr.surchargeKopecks,
            creationDate: new Date(),
            status: "pending"
        }
        this.srs = [...this.srs, nSr];
        this.data.find(it => it.id == adId)!.swapRequest = nSr.id;
        this.updateStorage();
    }

    public getUserSwapRequests(username: string) {
        var tSr = this.srs.filter(it => it.author.username == username);
        return tSr;
    }

    public getRelatedSwapRequests(adIds: number[]) {
        var tSr = this.srs.filter(it => adIds.includes(it.offerId));
        return tSr;
    }

    public accept(sr: SwapRequestModel): string {
        var d = this.data.find(it => it.swapRequest === sr.id)!;
        this.delete(d.id);
        return sr.author.contactInfo;
    }
}