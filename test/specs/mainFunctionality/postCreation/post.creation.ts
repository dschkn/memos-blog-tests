import * as fs from 'fs/promises';
import UserActions from '../../../helpers/posts.ts'
import { MainPage } from '../../../pageobjects/main.page.ts';

let mainPage = new MainPage();
let postsData: { id: number, text: string }[] = [];
let userData: { id: number, username: string, password: string}[] = [];
let userActions = new UserActions();
let masterUsername;
let masterPassword;

describe("Post creation tests", function () {
  this.retries(5);

  before(async () => { // все это надо выносить куда то отдельно.
    try {
      const data = await fs.readFile("test/data/posts.json", "utf-8");
      postsData = JSON.parse(data);
    } catch (error) {
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

[0, 1, 2].forEach((index) => {
  it(`creates post #${index + 1}`, async function () {
    await userActions.createAndVerifyPost(index, postsData);
  });
});

it("deletes all posts", async function () {
  this.retries(1);
    await userActions.deleteAllPosts();
  });
});
