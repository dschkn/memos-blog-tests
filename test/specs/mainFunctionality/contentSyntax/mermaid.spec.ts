import * as fs from 'fs/promises';
import UserActions from '../../../helpers/posts.ts';
import { MainPage } from '../../../pageobjects/main.page.ts';
import SyntaxElements from '../../../pageobjects/syntax.ts';

let syntaxPostsToCheck: Array<{ id: number, text: string, [key: string]: any }> = [];
let userData: { id: number, username: string, password: string }[] = [];
let masterUsername;
let masterPassword;
let mainPage = new MainPage();
let syntax = new SyntaxElements();
let userActions = new UserActions();

describe("Mermaid validation suite", function () {
    before(async () => {
        try {
            const syntaxData = await fs.readFile("test/data/syntax.json", "utf-8");
            syntaxPostsToCheck = JSON.parse(syntaxData);
        } catch (error) {
            console.error("❌ Error reading posts data:", error);
            throw error;
        }

        try {
            const usersRaw = await fs.readFile("test/data/users.json", "utf-8");
            userData = JSON.parse(usersRaw);
            const masterUser = userData.find((user) => user.id === 0);
            if (!masterUser) {
                throw new Error("❌ masterUser with id=0 not found in users.json");
            }
            masterUsername = masterUser.username;
            masterPassword = masterUser.password;
        } catch (error) {
            console.error("❌ Error reading user data:", error);
            throw error;
        }

        await mainPage.login(masterUsername, masterPassword);
    });






    describe("Mermaid item creation and validation", function () {
        describe("creates a mermaid item", function(){
            it("creates a mermaid item", async function () {
                await mainPage.postTextArea.isDisplayed();
                await userActions.createPost(16, syntaxPostsToCheck);
            });
        })
        

        describe("Validates a mermaid item", function () {
            let validation: any;

            before(() => {
                const postData = syntaxPostsToCheck.find(elem => elem.id === 16);
                if (!postData) throw new Error("postData was undefined");
                validation = postData!.validation;
            });

        });
    });















    describe("Blockquote item creation and validation", function () {
        it("creates a blockquote item", async function () {
            await userActions.createPost(17, syntaxPostsToCheck);
        });

        describe("Validates blockquote item", function () {
            let validation: any;

            before(() => {
                const postData = syntaxPostsToCheck.find(elem => elem.id === 17);
                if (!postData) throw new Error("postData was undefined");
                validation = postData!.validation;
            });

            
        });
    });








    describe("Deletes all posts", function () {
        it("deletes all posts", async function () {
            this.retries(1);
            await userActions.deleteAllPosts();
        });
    });
});
