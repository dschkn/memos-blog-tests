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
        return this.oneSinglePostOnPage.$("class='text-lg font-bold'")
    }
    get heading5(){
        return this.oneSinglePostOnPage.$("$('span=Heading 5')")
    }
    get heading6(){
        return this.oneSinglePostOnPage.$("$('span=Heading 6')")
    }
    async dotted() {
        const list = await $('ul.list-inside:nth-child(7) > li:nth-child(1)');
        const style = await list.getCSSProperty('list-style-type');
        console.log('Marker type:', style.value); // например, 'disc', 'circle', 'none'
    }
    async italic(){
        const italic = await $('em=Italic');
        const fontStyle = await italic.getCSSProperty('font-style');
        console.log(fontStyle.value); // Должно быть 'italic'
        expect(fontStyle.value).toBe('italic');
    }
    async bold() {
        const bold = await $('strong=Bold'); // Или $('span=Bold') — зависит, какой элемент тебе ближе
        const fontWeight = await bold.getCSSProperty('font-weight');
        console.log('Font weight is:', fontWeight.value); // Должно быть '700' или 'bold'
        expect(
            fontWeight.value === '700' || fontWeight.value === 'bold'
        ).toBe(true);
    }
    async strikethrough() {
        const strike = await $('del=Strikethrough');
        const textDecoration = await strike.getCSSProperty('text-decoration-line');
    
        console.log(textDecoration.value); // Должно быть 'line-through'
        expect(textDecoration.value).toBe('line-through');
    }
    async checkMemosLink() {
        const memosLink = await $('a=Мemos'); // или $('a*=Memos'), если ты не уверен в точности текста
        const href = await memosLink.getAttribute('href');
        
        console.log('Ссылка найдена, href:', href);
        expect(href).toBe('https://usememos.com');
    
        return memosLink; // возвращаем ссылочку, пригодится для дальнейших проверок
    }
    async checkMemosLinkInParagraph() {
        // Ищем ссылку по тексту, который внутри <span>
        const memosLink = await $('p a=https://usememos.com');
        
        // Получаем атрибут href
        const href = await memosLink.getAttribute('href');
        console.log('Ссылка найдена, href:', href);
    
        // Проверяем, что ссылка ведет туда, куда нужно
        expect(href).toBe('https://usememos.com');
        
        // Проверим, что текст внутри тоже совпадает
        const linkText = await memosLink.getText();
        console.log('Текст внутри ссылки:', linkText);
        expect(linkText).toBe('https://usememos.com');
    
        return memosLink; // Возвращаем саму ссылку, если нужно для дальнейших действий
    }
    async checkImage() {
        const image = await $('p img[src="https://www.usememos.com/full-logo-landscape.png"]');
        expect(await image.isDisplayed()).toBe(true); // Проверка, что изображение отображается
        const src = await image.getAttribute('src');
        expect(src).toBe('https://www.usememos.com/full-logo-landscape.png');
        const alt = await image.getAttribute('alt');
        expect(alt).toBe('Memos');
        const decoding = await image.getAttribute('decoding');
        expect(decoding).toBe('async');
        return image;
    }
    
    
    
    
    
    
}