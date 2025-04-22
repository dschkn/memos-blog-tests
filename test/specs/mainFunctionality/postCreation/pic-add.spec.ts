import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import UserActions from '../../../helpers/posts.ts'
import { MainPage } from '../../../pageobjects/main.page.ts';
import { Content } from '../../../pageobjects/content.ts';

let mainPage = new MainPage();
let content = new Content();
let userData: { id: number, username: string, password: string}[] = [];
let userActions = new UserActions();
let masterUsername;
let masterPassword;

describe("Post creation tests", function () {
  this.retries(5);

  before(async () => { // все это надо выносить куда то отдельно.
   
    try {
      const usersRaw = await fs.readFile("test/data/users.json", "utf-8");
      userData = JSON.parse(usersRaw);
  
      const masterUser = userData.find((user) => user.id === 1);
  
      if (!masterUser) {
        throw new Error("❌ masterUser with id=1 not found in users.json");
      }
  
      // Сохраняем отдельно username и password
      masterUsername = masterUser.username;
      masterPassword = masterUser.password;
  
    } catch (error) {
      console.error("❌ Error reading user data:", error);
      throw error;
    }
  
    // Логинимся с тем, что нашли
    await mainPage.login(masterUsername, masterPassword);
  });

  it("uploads an image file with the post", async function () {

    const absolutePath = path.resolve('./test/data/valid_testfile.jpg');

    if (!fsSync.existsSync(absolutePath)) {
        throw new Error('File notfound: ' + absolutePath);
    }
    await mainPage.fileAddButton.setValue(absolutePath);
    await mainPage.savePostButton.waitForClickable();
    await mainPage.savePostButton.click();
});
it("verifies that the image is displayed after the post is published", async function () {
    await content.postedImage.isDisplayed();
});
it("deletes all posts", async function () {
  this.retries(1);
    await userActions.deleteAllPosts();
  });



});
