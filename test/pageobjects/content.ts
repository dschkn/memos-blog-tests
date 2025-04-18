import { MainPage } from "./main.page";


export class Content extends MainPage{
    get postedImage(){
        return $("img.cursor-pointer")
    }
}