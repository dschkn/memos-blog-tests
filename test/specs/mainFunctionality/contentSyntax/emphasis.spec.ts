import * as fs from 'fs/promises';
import UserActions from '../../../helpers/posts.ts';
import { SyntaxValidators } from '../../../helpers/syntaxValidators.ts';
import { MainPage } from '../../../pageobjects/main.page.ts';

let syntaxPostsToCheck: { id: number, text: string }[] = [];
let userData: { id: number, username: string, password: string}[] = [];
let masterUsername;
let masterPassword;
let mainPage = new MainPage();
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
    describe("creates and validates posts", function(){
        this.retries(5)
        it("creates a post with italic text", async function(){
            await mainPage.postTextArea.isDisplayed();
            await userActions.createPost(10, syntaxPostsToCheck);
        })
        it("validates a post with italic text", async function(){
            await syntaxValidators.emphasisValidators(10, syntaxPostsToCheck, "em", "Italic")
            
        })
        it("creates a post with bold text", async function(){
            await userActions.createPost(11, syntaxPostsToCheck);
        })
        it("validates a post with bold text", async function(){
            await syntaxValidators.emphasisValidators(11, syntaxPostsToCheck, "strong", "Bold")
        })
        it("creates a post with strikethrough text", async function(){
            await userActions.createPost(12, syntaxPostsToCheck);
        })
        it("validates a post with strikethrough text", async function(){
            await syntaxValidators.emphasisValidators(12, syntaxPostsToCheck, "del", "Strikethrough")
        })
    })
    describe("deletes all posts", function(){
        it("deletes all posts", async function () {
          this.retries(1);
            await userActions.deleteAllPosts();
          });
    })
})