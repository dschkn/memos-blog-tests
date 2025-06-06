import { MainPage } from './main.page'

export default class SyntaxElements extends MainPage{
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

    get italicPost() {
        return this.oneSinglePostOnPage.$('//p[contains(., "Post with Italic Text")]');
    }
    get boldPost() {
        return this.oneSinglePostOnPage.$('//p[contains(., "Post with Bold Text")]');
    }
    get strikethroughPost() {
        return this.oneSinglePostOnPage.$('//p[contains(., "Post with Strikethrough Text")]');
    }
    get linkWithText(){
        return this.oneSinglePostOnPage.$('//p[contains(., "Memos")]');
    }

    get linkWithoutText(){
        return this.oneSinglePostOnPage.$('//p[contains(., "https://usememos.com")]');
    }

    get linkWithPict(){
        return this.oneSinglePostOnPage.$('p');
    }

    get codeBlock() {
        return this.oneSinglePostOnPage.$(`//*[contains(text(), 'javascript const x = 1;')]`);
    }

    get blockQuote() {
        return this.oneSinglePostOnPage.$(`//*[contains(text(), 'Blockquote')]/../..`);

    }
    

      
    
    
    
    
    
    
    
}