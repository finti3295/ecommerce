import { Order } from "./order.model";
import { Product } from "./product.model";

export class User{
    cartProducts: Product[] = [];
    orders: Order[] = [];
    userId:string = ""  ;

    constructor(public email?:string,public name?:string,public  surname?:string,public  phoneNumber?:string,
      public  address?: string,public zip?: string,public country?: string,public state?: string,public address2?: string ,
      public billingAddress?:string){}


      

       static  decode(id:string) {
            var PUSH_CHARS = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
             id = id.substring(0,8);
            var timestamp = 0;
            for (var i=0; i < id.length; i++) {
              var c = id.charAt(i);
              timestamp = timestamp * 64 +PUSH_CHARS.indexOf(c);
            }
            return timestamp.toString();
          }
}