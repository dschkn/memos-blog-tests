import { MainPage } from "../pageobjects/main.page";
import SyntaxElements from "../pageobjects/syntax";

export class SyntaxValidators extends MainPage{
    
    async bulletItemValidators(elemId:number, syntaxPostsToCheck: Array<{ id: number, text: string, [key: string]: any }>){
        const mainPage = new MainPage();
        const expectedPost = syntaxPostsToCheck.find((elem:any) => elem.id === elemId); // {"id": 6, "text": "- Item 1 with '-'", ...
        const expectedText = expectedPost?.text  // "- Item 1 with '-'"
        const cleanExpectedText = expectedText?.replace(/^[\+\*\-\s]+/, '');
        if (!cleanExpectedText) throw new Error("expectedText is undefined — проверь данные");
        console.log("🎯 Expected:", cleanExpectedText);
      
        let foundPost;
      
        for (const post of await mainPage.allPostsOnPage) {
            const text = await (await post.$(".relative.w-full.max-w-full")).getText();
            console.log("🔍 Received:", text);
          
            if (text.includes(cleanExpectedText)) {
              foundPost = post;
              break;
            }
          }
        console.log(foundPost)
        // Проверим что пост с нужным текстом найден
        expect(foundPost).toBeDefined();
        if (!foundPost) throw new Error("Post not found");
      
        // Проверяем что у поста есть ul со стилем list-style-type: disc
        const ul = await foundPost.$("ul");
        expect(await ul.isExisting()).toBe(true);
      
        const listStyle = await ul.getCSSProperty("list-style-type");
        expect(listStyle.value).toBe("disc");
      
        // Проверим, что в ul есть span с нужным текстом
        const span = await ul.$("span");
        expect(await span.isExisting()).toBe(true);
        expect(await span.getText()).toBe(cleanExpectedText);
    }

    async emphasisValidators(
        elemID: number,
        syntaxPostsToCheck: Array<{ id: number, text: string, [key: string]: any }>,
        tag: string,
        type: string
      ) {
        const syntaxElements = new SyntaxElements();
        const postData = syntaxPostsToCheck.find(p => Number(p.id) === elemID);
        
        if (!postData) throw new Error("postData was undefined");
        
        const { validation } = postData!;
        const expectedText = postData.text;
        const cleanedExpectedText = expectedText?.replace(/[\*~]/g, '');
      
        // Универсальная функция для проверки текста
        const validatePost = async (elementSelector: any, cssProperty: string, expectedValue: string) => {
          await elementSelector.waitForDisplayed();
          const paragraph = await elementSelector;
          const child = await paragraph.$('./*'); // Ищем первого ребёнка (в данном случае — <em>, <b>, <s> и т.д.)
          expect(await child.getTagName()).toBe(tag);
          expect(await child.getText()).toBe(cleanedExpectedText);
          console.log(`${cssProperty}::`, await child.getCSSProperty(cssProperty)); // Логируем CSS-свойство
          expect(await child.getCSSProperty(cssProperty)).toEqual(expectedValue);
        };
      
        // Определяем нужный элемент и CSS-свойство в зависимости от типа
        switch (type) {
          case "Italic":
            await validatePost(syntaxElements.italicPost, "font-style", validation.property);
            break;
          case "Bold":
            await validatePost(syntaxElements.boldPost, "font-weight", validation.property);
            break;
          case "Strikethrough":
            await validatePost(syntaxElements.strikethroughPost, "text-decoration", validation.property);
            break;
          default:
            throw new Error("Syntax mistake");
        }
      }
      
      






}