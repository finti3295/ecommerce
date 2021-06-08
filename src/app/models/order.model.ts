import { Transaction } from "./transaction.model";

export class Order{
    id:string = "";
    constructor(owner:string, status:string, delveryAddress:string, transactions:Transaction[]){}
}