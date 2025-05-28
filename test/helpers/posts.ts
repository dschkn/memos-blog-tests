import { expect } from 'chai';
import { MainPage } from '../pageobjects/main.page';

export default class UserActions{

  async createPostWithVisibility(index: number, visibility: 'private' | 'public') {
    const mainPage = new MainPage();
    await mainPage.postTextArea.setValue(`This is a user ${index}'s ${visibility} post`);
    await mainPage.dropDownPublicPrivateMenuButton.click();
    await mainPage.dropDownPublicPrivateMenu.isDisplayed();
    const button = visibility === 'private' ? mainPage.dropDownPublicPrivateMenuPrivateButton : mainPage.dropDownPublicPrivateMenuPublicButton;
    await button.isDisplayed();
    await button.click();
    await mainPage.savePostButton.isClickable();
    await mainPage.savePostButton.click();
}
async createPost(postId: number, postsData: any[]) {
  const mainPage = new MainPage();
  const post = postsData.find((p) => p.id === postId);

  if (!post?.text) {
    throw new Error(`❌ No post data found for id ${postId}`);
  }

  await mainPage.postTextArea.waitForExist();
  await mainPage.postTextArea.setValue(post.text);
  await mainPage.savePostButton.waitForClickable();
  await mainPage.savePostButton.click();
}

  async typePostLineByLine(postId: number, postsData: any[]) {
    const mainPage = new MainPage();
    const postObject = postsData.find(p => p.id === postId);
  
    if (!postObject) {
      throw new Error(`❌ No post found with id ${postId}`);
    }
  
    // Собираем и сортируем строки textline1, textline2, ...
    const lines = Object.keys(postObject)
      .filter(key => key.startsWith("textline"))
      .sort((a, b) => {
        const numA = parseInt(a.replace("textline", ""));
        const numB = parseInt(b.replace("textline", ""));
        return numA - numB;
      })
      .map(key => postObject[key]);
  
    await mainPage.postTextArea.waitForExist();
    await mainPage.postTextArea.click(); // На всякий случай фокус
  
    for (const line of lines) {
      await browser.keys(line);
      await browser.keys("Enter"); // Эмулируем настоящий Enter
    }
  
    await mainPage.savePostButton.waitForClickable();
    await mainPage.savePostButton.click();
  }
  


  async createAndVerifyPost(postIndex: number, postsData: any[]) { // ЭТот метод надо срефакторить используя this.createPost()
    const mainPage = new MainPage();
    const postText = postsData[postIndex]?.text;
    if (!postText) {
      throw new Error(`❌ No post data for index ${postIndex}`);
    }
  
    // Получаем количество постов ДО добавления
    const beforeCount = (await mainPage.allPostsOnPage).length;
  
    await mainPage.postTextArea.waitForExist();
    await mainPage.postTextArea.setValue(postText);
  
    await mainPage.savePostButton.waitForClickable();
    await mainPage.savePostButton.click();
  
    // Ждём, пока количество постов увеличится
    await browser.waitUntil(async () => {
      const afterCount = (await mainPage.allPostsOnPage).length;
      return afterCount > beforeCount;
    }, {
      timeout: 5000,
      timeoutMsg: `🕐 Пост №${postIndex + 1} не появился вовремя (или вообще не появился)`,
    });
  
    // Получаем список всех постов
    const allPosts = await mainPage.allPostsOnPage;
  
    // Ждём, пока текст поста будет актуальным (обновится)
    await browser.waitUntil(async () => {
      const latestPostText = await allPosts[0].$("p span").getText();
      return latestPostText === postText;  // Проверяем, что текст поста обновился
    }, {
      timeout: 5000,
      timeoutMsg: `🕐 Текст поста №${postIndex + 1} не обновился вовремя`,
    });
  
    // Проверяем, что самый верхний пост содержит нужный текст
    const latestPostText = await allPosts[0].$("p span").getText();
  
    console.log(`📄 Expected: "${postText}", Found: "${latestPostText}"`);
    expect(latestPostText).to.contain(postText);
  }



  async deleteAllPosts() {
        const mainPage = new MainPage();
        let posts = await mainPage.allPostsOnPage;
        console.log(`🔍 Найдено ${posts.length} постов`);
    
        while (await posts.length > 0) {
            const post = posts[0];
            const optionsButton = await post.$(".lucide-ellipsis-vertical");
    
            console.log("📍 Скроллим к кнопке опций...");
            await optionsButton.scrollIntoView();
            await optionsButton.moveTo(); // Наводим курсор на кнопку
            await browser.pause(300);     // Даем UI чуть отдышаться
    
            console.log("🖱 Кликаем на кнопку опций...");
            await optionsButton.click();
            await browser.pause(500);  // Ждём, пока меню появится
    
            // Ждём появления меню
            const menu = await $("ul[role='menu']");
            const isMenuVisible = await menu.isDisplayed();
            if (!isMenuVisible) {
                console.log("⚠️ Меню не появилось!");
                await browser.saveScreenshot("./error_no_menu.png");
                throw new Error("❌ Меню с опциями не появилось");
            }
    
            console.log("✅ Меню отображается");
    
            // Получаем все пункты меню
            const menuItems = await $$(".MuiMenuItem-root");
            console.log(`📋 В меню ${menuItems.length} пунктов`);
    
            let deleteOption = null;
            for (const item of menuItems) {
                const text = await item.getText();
                console.log(`🔘 Меню: "${text}"`);
                if (text.toLowerCase().includes("delete")) {
                    deleteOption = item;
                    break;
                }
            }
    
            if (!deleteOption) {
                throw new Error("❌ Не найдена кнопка Delete среди пунктов меню");
            }
    
            console.log("🗑 Кликаем по Delete...");
            await deleteOption.click();
            await browser.pause(300); // Подождать, пока появится окно подтверждения
    
    
    
            // Пробуем взаимодействовать с alert
            try {
                // Ожидаем появления alert (можно добавить некоторую задержку)
                await browser.waitUntil(async () => {
                    try {
                        // Проверяем, что alert существует
                        const alertText = await browser.getAlertText();
                        return alertText !== null;
                    } catch (err) {
                        return false;
                    }
                }, {
                    timeout: 5000,
                    timeoutMsg: "❌ Alert не появился вовремя"
                });
    
                console.log("🔔 Модальное окно подтверждения открыто");
    
                // Принять (OK) — если это подтверждение
                await browser.acceptAlert();  // Принять alert
                console.log("✅ Подтверждено удаление");
    
            } catch (err) {
                console.log("⚠️ Модальное окно подтверждения не открылось.");
                await browser.saveScreenshot("./error_no_alert.png");
                throw new Error("❌ Модальное окно подтверждения не открылось");
            }
            
            // Ждём, пока пост исчезнет
            await browser.waitUntil(
                async () => {
                    const currentPosts = await mainPage.allPostsOnPage;
                    return currentPosts.length < posts.length;
                },
                {
                    timeout: 3000,
                    timeoutMsg: "❌ Пост не удалился",
                }
            );
    
    
    
    
    
    
    
            console.log("✅ Пост удалён");
            posts = await mainPage.allPostsOnPage;
        }
    
        console.log("🎉 Все посты удалены");
  }
    



}