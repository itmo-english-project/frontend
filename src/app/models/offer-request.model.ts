
export class OfferRequest {
    title: string = "";
    description: string = "";
    pictures: string[] = [];
    dueTime: Date | null = null;
    tags: string[] = [];
}