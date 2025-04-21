// Здесь тест того что то что постит один пользователь приватно не видно другим в общем потоке а то что public - наоборот, видно
// Важнейшая часть безопасности
import * as fs from 'fs/promises';
import { expect } from 'chai';
import { MainPage } from '../../pageobjects/main.page';
import UserActions from '../../helpers/posts';

describe("Checking security of users and their posts", async function() {
    let mainPage = new MainPage();
    let userActions = new UserActions();
    let usersData: { id: number; username: string; password: string }[] = [];

    before(async () => {
        try {
            const usersRaw = await fs.readFile("test/data/users.json", "utf-8");
            usersData = JSON.parse(usersRaw)
            if (!usersData) {
                throw new Error("❌ Users data is invalid");
            }
        } catch(error) {
            console.error("❌ Something went wrong by reading or parsing users.json file:", error)
        }
    });

    [0, 1, 2, 3, 4].forEach((index) => {
        describe(`Tests for user ${index}: creating posts`, function() {
            this.retries(2);

            it(`logs in a user ${index}`, async function() {
                let actualUser = usersData.find((user) => user.id === index);
                if(!actualUser) {
                    throw new Error(`❌User with id ${index} not found`);
                }
                try {
                    await mainPage.login(actualUser.username, actualUser.password);
                } catch (error) {
                    throw new Error(`❌ Something went wrong with login for user ${index}: ${error}`);
                }
            });

            it(`user ${index} creates a private post`, async function() {
                await userActions.createPostWithVisibility(index, 'private');
            });

            it(`user ${index} creates a public post`, async function() { 
                await userActions.createPostWithVisibility(index, 'public');
            });

            it(`checks if user ${index}'s posts are available on its page`, async function() {
                await mainPage.allPostsOnPage[0].waitForDisplayed();
                await mainPage.allPostsOnPage[1].waitForDisplayed();
                const allPosts = await mainPage.allPostsOnPage;
                expect(await allPosts[0].getText()).to.contain(`This is a user ${index}'s public post`);
                expect(await allPosts[1].getText()).to.contain(`This is a user ${index}'s private post`);
            });

            it(`logs out a user ${index}`, async function() {
                await mainPage.accountDropDownMenuButton.waitForClickable();
                await mainPage.accountDropDownMenuButton.click();
                await mainPage.accountDropDownMenu.waitForDisplayed();
                await (await mainPage.accountDropDownMenuOptions)[0].click();
                await mainPage.authPageIcon.waitForDisplayed();
            });
        });
    });

    [0, 1, 2, 3, 4].forEach((index) => {
        describe(`Verification for user ${index}:`, function() {

            it(`logs in a user ${index}`, async function () {
                let actualUser = usersData.find((user) => user.id === index);
                if(!actualUser) {
                    throw new Error(`❌User with id ${index} not found`);
                }
                try {
                    await mainPage.login(actualUser.username, actualUser.password);
                } catch (error) {
                    throw new Error(`❌ Something went wrong with login for user ${index}: ${error}`);
                }
            });

            it(`verifies that user ${index}'s public post is visible`, async function() {
                await mainPage.sideMenuItems[2].waitForClickable();
                await mainPage.sideMenuItems[2].click();
                await mainPage.oneSinglePostOnPage.waitForDisplayed();
                const posts = await mainPage.allPostsOnPage;
                const allPostTexts = await Promise.all(await posts.map((post) => post.getText())) as string[];
                const hasPublicPost = allPostTexts.some((text) => 
                    text.includes(`This is a user ${index}'s public post`)
                );
                expect(hasPublicPost).to.be.true;  
                if (hasPublicPost){
                    console.log(`✅User ${index}'s public post is visible`)
                }         
            });

            it('verifies that all posts are public and there are no private posts', async function() {
                await mainPage.oneSinglePostOnPage.waitForDisplayed();
                const posts = await mainPage.allPostsOnPage;
                const allPostTexts = await Promise.all(
                    await posts.map((post) => post.getText())
                ) as string[];
                try {
                    const allPostsArePublic = allPostTexts.every((text) =>
                        text.includes('public post')
                    );
                    expect(allPostsArePublic).to.be.true;
                } catch(error) {
                    throw new Error(`❌Not every post was public: ${error}`);
                }
            });

            it("verifies that user's posts on Homepage are both visible", async function () {
                await mainPage.sideMenuItems[0].waitForClickable();
                await mainPage.sideMenuItems[0].click();
                await mainPage.oneSinglePostOnPage.waitForDisplayed();
                const posts = await mainPage.allPostsOnPage;
                const postTexts = await Promise.all(await posts.map(async (post) => {
                    const text = await post.getText();
                    return text;
                })) as string[]; 

                const hasPublic = postTexts.some((text) => text.includes(`This is a user ${index}'s public post`));
                expect(hasPublic).to.be.true;

                const hasPrivate = postTexts.some((text) => text.includes(`This is a user ${index}'s private post`));
                expect(hasPrivate).to.be.true;
            });

            it(`logs out a user ${index}`, async function() {
                await mainPage.accountDropDownMenuButton.waitForClickable();
                await mainPage.accountDropDownMenuButton.click();
                await mainPage.accountDropDownMenu.waitForDisplayed();
                await (await mainPage.accountDropDownMenuOptions)[0].click();
                await mainPage.authPageIcon.waitForDisplayed();
            });
        });
    });

    [0, 1, 2, 3, 4].forEach((index) => {
        describe(`Deleting all posts for user ${index}`, function() {

            it(`logs in a user ${index}`, async function () {
                let actualUser = usersData.find((user) => user.id === index);
                if(!actualUser) {
                    throw new Error(`❌User with id ${index} not found`);
                }
                try {
                    await mainPage.login(actualUser.username, actualUser.password);
                } catch (error) {
                    throw new Error(`❌ Something went wrong with login for user ${index}: ${error}`);
                }
            });

            it(`deletes all posts of ${index}'s user`, async function() {
                await mainPage.oneSinglePostOnPage.waitForDisplayed();
                await userActions.deleteAllPosts();
            });

            it(`logs out a user ${index}`, async function() {
                await mainPage.accountDropDownMenuButton.waitForClickable();
                await mainPage.accountDropDownMenuButton.click();
                await mainPage.accountDropDownMenu.waitForDisplayed();
                await (await mainPage.accountDropDownMenuOptions)[0].click();
                await mainPage.authPageIcon.waitForDisplayed();
            });
        });
    });

});
