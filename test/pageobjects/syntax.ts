import { MainPage } from './main.page'

export class SyntaxElements extends MainPage{
    get heading1(){
        return this.oneSinglePostOnPage.$(".text-5xl")
    }
    get heading2(){
        return this.oneSinglePostOnPage.$(".text-3xl")
    }
    get heading3(){
        return this.oneSinglePostOnPage.$(".text-xl")
    }
    get heading4(){
        return this.oneSinglePostOnPage.$(".text-lg.font-bold") 
    }
    get heading5() {
        return this.oneSinglePostOnPage.$('//span[text()="Heading 5"]/parent::h5');
    } 
    get heading6() {
        return this.oneSinglePostOnPage.$('//span[text()="Heading 6"]/parent::h6');
    } 
    
    
    
    
    
    
}