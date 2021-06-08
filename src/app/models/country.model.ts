import 'reflect-metadata';
import { jsonObject, jsonMember, TypedJSON, jsonArrayMember } from 'typedjson';

@jsonObject
export class Country{
    @jsonMember(String)
    public objectId:string=""
    @jsonMember(String)
    public name:string = "";

    @jsonMember(String)
    public phone:string = "";
    //cities: string[] = [];

}
@jsonObject
export class CountryResult{
    @jsonArrayMember(Country)
    public results:Country[] = [];
}

@jsonObject
export class City{
    @jsonMember(String)
    public objectId:string=""

    public name:string = "";
}
@jsonObject
export class CityResult{
    @jsonArrayMember(Country)
    public results:City[] = [];
}