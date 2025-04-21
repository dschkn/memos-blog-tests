import * as fs from 'fs/promises';
import { MainPage } from '../../../pageobjects/main.page.ts';
import UserActions from '../../../helpers/posts.ts';
import { SyntaxValidators } from '../../../helpers/syntaxValidators.ts';

let syntaxPostsToCheck: { id: number, text: string }[] = [];
let userData: { id: number, username: string, password: string}[] = [];
let masterUsername;
let masterPassword;
let mainPage = new MainPage();
let userActions = new UserActions();
let syntqxValidators = new SyntaxValidators();


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
    describe("creates items with bullets", function(){
        it("creates an '-'-item", async function(){
            await mainPage.postTextArea.isDisplayed();
            await userActions.createPost(6, syntaxPostsToCheck);
        })
        it("verifies an '-' item", async function () {
            await syntqxValidators.bulletItemValidators(6, syntaxPostsToCheck);
          });
          
        it("creates an '*'-item", async function (){
            await userActions.createPost(7, syntaxPostsToCheck);
        })
        it("verifies an '*'-item", async function(){
            await syntqxValidators.bulletItemValidators(7, syntaxPostsToCheck);
        })
        it("creates an '+'-item", async function(){
            await userActions.createPost(8, syntaxPostsToCheck);
        })
        it("verifies an '+'-item", async function(){
            await syntqxValidators.bulletItemValidators(8, syntaxPostsToCheck);
        })
    })
    describe("deletes all posts", function(){
        it("deletes all posts", async function () {
          this.retries(1);
            await userActions.deleteAllPosts();
          });
    })
})