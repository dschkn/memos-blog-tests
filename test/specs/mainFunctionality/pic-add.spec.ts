import * as path from 'path';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import UserActions from '../../helpers/posts.ts'
import { MainPage } from '../../pageobjects/main.page.ts';

let mainPage = new MainPage();
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






  it("file add", async function () {

    const absolutePath = path.resolve('./test/data/valid_testfile.jpg');

    if (!fsSync.existsSync(absolutePath)) {
        throw new Error('Файл не найден: ' + absolutePath);
    }

    await mainPage.fileAddButton.setValue(absolutePath);
    await mainPage.savePostButton.waitForClickable();
    await mainPage.savePostButton.click();

    await browser.pause(5000);
});



});
