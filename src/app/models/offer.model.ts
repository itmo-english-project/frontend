import { UserModel } from "./user.model"

export interface OfferModel {
    id: number
    author: UserModel
    title: string
    description: string
    pictures: string[]
    dueTime: Date | null
    creationDate: Date
    swapRequest: string | null
    tags: string[]
    status: "closed" | "deleted" | "active"
}