import { UserModel } from "./user.model"

export interface SwapRequestModel {
    id: number
    offerId: number
    author: UserModel
    title: string
    description: string
    pictures: string[]
    surchargeKopecks: number
    creationDate: Date
    status: "approved" | "declined" | "deleted" | "pending"
}