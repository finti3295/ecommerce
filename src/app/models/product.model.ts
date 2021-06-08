export class Product{
    photo:string = "";
    loveIts: number = 0;
    created_at:Date = new Date();
   
    
        constructor(public title:string,public content:string, public price:number, public  created_by:string ){}
    
            getColor(){
                if(this.loveIts < 0){
                    return 'red';
                }else if(this.loveIts > 0){
                    return 'green;'
                }  
                return null; 
            }
    
            addLike(){
                this.loveIts++;
            }
    
            RemoveLike(){
                this.loveIts--;
            }
    }