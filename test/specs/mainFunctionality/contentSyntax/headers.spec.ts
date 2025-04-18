import { SyntaxElements } from '../../../pageobjects/syntax.ts';
import * as fs from 'fs/promises';
import UserActions from '../../../helpers/posts.ts'
import { MainPage } from '../../../pageobjects/main.page.ts';

let mainPage = new MainPage();
let syntax = new SyntaxElements();
let userActions = new UserActions();
let syntaxPostsToCheck: { id: number, text: string }[] = [];
let userData: { id: number, username: string, password: string}[] = [];
let masterUsername;
let masterPassword;

describe("Post creation tests", function () {
  this.retries(5);

  before(async () => { // все это надо выносить куда то отдельно.
    try{
      const syntaxData = await fs.readFile("test/data/syntax.json", "utf-8");
      syntaxPostsToCheck = JSON.parse(syntaxData)
    } catch(error){
      console.error("❌ Error reading posts data:", error);
      throw error;      
    }

    try {
      const usersRaw = await fs.readFile("test/data/users.json", "utf-8");
      userData = JSON.parse(usersRaw);
      const masterUser = userData.find((user) => user.id === 0);
      if (!masterUser) {
        throw new Error("❌ masterUser with id=1 not found in users.json");
      }
      masterUsername = masterUser.username;
      masterPassword = masterUser.password;
  
    } catch (error) {
      console.error("❌ Error reading user data:", error);
      throw error;
    }
  
    await mainPage.login(masterUsername, masterPassword);

  });
  describe("Heading 1:", function(){
    it("creates a post with Header 1", async function(){
      await userActions.createPost(0, syntaxPostsToCheck);
    })
    it("validates a post with Header 1", async function () {
      await syntax.heading1.waitForDisplayed();
    
      // Находим нужный пост по id
      const postData = syntaxPostsToCheck.find(p => Number(p.id) === 0);
      expect(postData).toBeDefined();
    
      const { validation } = postData! as any;
    
      // Проверка HTML-тега
      const tagName = await syntax.heading1.getTagName();
      expect(tagName.toLowerCase()).toBe(validation.tag);
    
      // Проверка классов
      const classAttr = await syntax.heading1.getAttribute("class");
      const classList = classAttr.trim().split(/\s+/); // разбиваем строку классов в массив
      for (const className of validation.classes) {    // Проверяем, что все классы из валидации присутствуют
        expect(classList).toContain(className);
      }
    
      // Проверка CSS-стилей
      for (const [cssProp, expectedValue] of Object.entries(validation.css)) {
        const style = await syntax.heading1.getCSSProperty(cssProp);
        expect(style.value).toBe(expectedValue);
      }
    });
    
    
  })
  describe("Heading 2:", function () {
    it("creates a post with Header 2", async function () {
      await browser.pause(300)
      await userActions.createPost(1, syntaxPostsToCheck);
    });
  
    it("validates a post with Header 2", async function () {
      
      await syntax.heading2.waitForDisplayed(); // 🧼 Ждём, пока элемент появится
  
      const postData = syntaxPostsToCheck.find(p => Number(p.id) === 1);
      expect(postData).toBeDefined();
  
      const { validation } = postData! as any;
  
      // ✅ Проверка HTML-тега
      const tagName = await syntax.heading2.getTagName();
      expect(tagName.toLowerCase()).toBe(validation.tag);
  
      // ✅ Проверка классов
      const classAttr = await syntax.heading2.getAttribute("class");
      const classList = classAttr.trim().split(/\s+/); // превращаем строку классов в массив
      expect(classList).toEqual(expect.arrayContaining(validation.classes));
  
      // ✅ Проверка CSS-стилей
      for (const [cssProp, expectedValue] of Object.entries(validation.css)) {
        const style = await syntax.heading2.getCSSProperty(cssProp);
        expect(style.value).toBe(expectedValue);
      }
    });


  });
  describe("Heading 3:", function () {
    it("creates a post with Header 3", async function () {
      await browser.pause(300)
      await userActions.createPost(2, syntaxPostsToCheck);
    });
  
    it("validates a post with Header 3", async function () {
      
      await syntax.heading3.waitForDisplayed(); // 🧼 Ждём, пока элемент появится
  
      const postData = syntaxPostsToCheck.find(p => Number(p.id) === 2);
      expect(postData).toBeDefined();
  
      const { validation } = postData! as any;
  
      // ✅ Проверка HTML-тега
      const tagName = await syntax.heading3.getTagName();
      expect(tagName.toLowerCase()).toBe(validation.tag);
  
      // ✅ Проверка классов
      const classAttr = await syntax.heading3.getAttribute("class");
      const classList = classAttr.trim().split(/\s+/); // превращаем строку классов в массив
      expect(classList).toEqual(expect.arrayContaining(validation.classes));
  
      // ✅ Проверка CSS-стилей
      for (const [cssProp, expectedValue] of Object.entries(validation.css)) {
        const style = await syntax.heading3.getCSSProperty(cssProp);
        expect(style.value).toBe(expectedValue);
      }
    });
  });
  describe("Heading 4:", function () {
    it("creates a post with Header 4", async function () {
      await browser.pause(300)
      await userActions.createPost(3, syntaxPostsToCheck);
    });
  
    it("validates a post with Header 4", async function () {
      
      await syntax.heading4.waitForDisplayed(); // 🧼 Ждём, пока элемент появится
  
      const postData = syntaxPostsToCheck.find(p => Number(p.id) === 3);
      expect(postData).toBeDefined();
  
      const { validation } = postData! as any;
  
      // ✅ Проверка HTML-тега
      const tagName = await syntax.heading4.getTagName();
      expect(tagName.toLowerCase()).toBe(validation.tag);
  
      // ✅ Проверка классов
      const classAttr = await syntax.heading4.getAttribute("class");
      const classList = classAttr.trim().split(/\s+/); // превращаем строку классов в массив
      expect(classList).toEqual(expect.arrayContaining(validation.classes));
  
      // ✅ Проверка CSS-стилей
      for (const [cssProp, expectedValue] of Object.entries(validation.css)) {
        const style = await syntax.heading4.getCSSProperty(cssProp);
        expect(style.value).toBe(expectedValue);
      }
    });
  });
  describe("Heading 5:", function(){
    it("creates a post with Header 5", async function () {
      await browser.pause(300)
      await userActions.createPost(4, syntaxPostsToCheck);
    });
  
    it("validates a post with Header 5", async function () {
      await syntax.heading5.waitForDisplayed(); // 🧼 Ждём, пока элемент появится
    
      // Получаем данные поста по id из массива syntaxPostsToCheck
      const postData = syntaxPostsToCheck.find(p => Number(p.id) === 4); // 4 - это id для Heading 5
      expect(postData).toBeDefined();
    
      const { validation } = postData! as any; // Извлекаем validation из postData
    
      // // ✅ Проверка HTML-тега
      const headingElement = await syntax.heading5; 
      // Получаем тег родительского элемента
      const parentTagName = await headingElement.getTagName();
      // Проверяем, что родительский элемент — это <h5>
      expect(parentTagName.toLowerCase()).toBe(validation.tag);

      const text = await syntax.heading5.getText();
      expect(text).toBe("Heading 5");
    
      // ✅ Проверка CSS-стилей
      for (const [cssProp, expectedValue] of Object.entries(validation.css)) {
        const style = await syntax.heading5.getCSSProperty(cssProp);
        expect(style.value).toBe(expectedValue);
      }
    });
  });
  describe("Heading 6:", function() {
    it("creates a post with Header 6", async function () {
      await browser.pause(300);
      await userActions.createPost(5, syntaxPostsToCheck); // Создаем пост с заголовком 6
    });
  
    it("validates a post with Header 6", async function () {
      await syntax.heading6.waitForDisplayed(); // 🧼 Ждём, пока элемент появится
  
      // Находим пост с id = 5
      const postData = syntaxPostsToCheck.find(p => Number(p.id) === 5);
      expect(postData).toBeDefined(); // Убедимся, что пост с таким id найден
  
      const { validation } = postData! as any; // Извлекаем validation из postData
  
      // ✅ Проверка тега
      const tagName = await syntax.heading6.getTagName();
      expect(tagName.toLowerCase()).toBe(validation.tag); // Исправил здесь, чтобы проверить тег с validation.tag
  
      // ✅ Проверка CSS-стилей
      for (const [cssProp, expectedValue] of Object.entries(validation.css)) {
        const style = await syntax.heading6.getCSSProperty(cssProp);
        expect(style.value).toBe(expectedValue);
      }
    });
  });
  describe("deletes all posts", function(){
    it("deletes all posts", async function () {
      this.retries(1);
        await userActions.deleteAllPosts();
      });
  })
  




});
