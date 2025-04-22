import UserActions from '../../../helpers/posts.ts';
import SyntaxElements from '../../../pageobjects/syntax.ts';import * as fs from 'fs/promises';
import { SyntaxValidators } from '../../../helpers/syntaxValidators.ts';
import { MainPage } from '../../../pageobjects/main.page.ts';

let syntaxPostsToCheck: Array<{ id: number, text: string, [key: string]: any }> = [];

let userData: { id: number, username: string, password: string}[] = [];
let masterUsername;
let masterPassword;
let mainPage = new MainPage();
let syntax = new SyntaxElements();
let userActions = new UserActions();
let syntaxValidators = new SyntaxValidators();


describe("", function (){
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
    describe("creates and validates link posts", function(){
        this.retries(5)
        it("creates a post with a named link", async function(){
            await mainPage.postTextArea.isDisplayed();
            await userActions.createPost(13, syntaxPostsToCheck);
        })
        it("validates a post with a named link", async function(){
            const postData = syntaxPostsToCheck.find(elem => elem.id === 13)
            if(!postData) throw new Error("postData was undefined");

            const { validation } = postData!;

            await syntax.linkWithText.isDisplayed();
            expect(await syntax.linkWithText.$('./*').getAttribute('href')).toBe(validation.link);
            expect(await syntax.linkWithText.$('./*').getTagName()).toBe(validation.tag);
            expect(await syntax.linkWithText.$('./*').getText()).toBe(validation.internaltext)
        })
        it("creates a post post with a normal link", async function(){
            await userActions.createPost(14, syntaxPostsToCheck);
        })
        it("validates a post with a normal link", async function(){
          const postData = syntaxPostsToCheck.find(elem => elem.id === 14)
          if(!postData) throw new Error("postData was undefined");

          const { validation } = postData!;

          await syntax.linkWithText.isDisplayed();
          expect(await syntax.linkWithoutText.$('./*').getAttribute('href')).toBe(validation.link);
          expect(await syntax.linkWithoutText.$('./*').getTagName()).toBe(validation.tag);
          expect(await syntax.linkWithoutText.$('./*').getText()).toBe(validation.internaltext)
        })
        it("creates a post with an image link", async function(){
            await userActions.createPost(15, syntaxPostsToCheck);
        })
        it("validates a post with an image link", async function(){
          const postData = syntaxPostsToCheck.find(elem => elem.id === 15)
          if(!postData) throw new Error("postData was undefined");

          const { validation } = postData!;

          await syntax.linkWithText.isDisplayed();
          expect(await syntax.linkWithPict.$('./*').getAttribute('alt')).toBe(validation.alt);
          expect(await syntax.linkWithPict.$('./*').getTagName()).toBe(validation.tag);
          expect(await syntax.linkWithPict.$('./*').getAttribute('src')).toBe(validation.src)
        })
    })

    describe("deletes all posts", function(){
        it("deletes all posts", async function () {
          this.retries(1);
            await userActions.deleteAllPosts();
          });
    })
})