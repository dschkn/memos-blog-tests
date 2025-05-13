import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import UserActions from '../../helpers/posts.ts';
import { expect } from 'chai';
import PDFs from '../../pageobjects/PDFs.ts';
import { MainPage } from '../../pageobjects/main.page';
import Loaders from '../../helpers/loaders.ts';
// import pdfParse from 'pdf-parse';
// import { PDFDocument } from 'pdf-lib'; // пригодится, если пойдём в визуальные элементы

describe('PDF Signature Detection Suite', () => {
  let mainPage = new MainPage();
  let loaders = new Loaders();
  let pdfBuffer: string;
  let pdfs = new PDFs();
  let userActions = new UserActions();
  let pdfText: string;

  describe('Uploads and verifies signed and unsigned PDF-Files', function () {
    let signedFilePath: string;
    let unsignedFilePath: string;

    before(async () => {
      signedFilePath = path.join(__dirname, '../../data/Musterdokument.pdf');
      unsignedFilePath = path.join(__dirname, '../../data/Musterdokument_no_signature.pdf');

      await loaders.ensureFileExists(signedFilePath);
      await loaders.ensureFileExists(unsignedFilePath);

      const usersRaw = await fs.promises.readFile("test/data/users.json", "utf-8");
      const userData = JSON.parse(usersRaw);
      const masterUser = userData.find((user: any) => user.id === 0);
      if (!masterUser) {
        throw new Error("❌ masterUser with id=0 not found in users.json");
      }
    
      await mainPage.login(masterUser.username, masterUser.password);
    });

    describe('Uploading file', function () {
      it('uploads signed document', async function () {
        // Загружаем файл с подписью
        await mainPage.fileAddButton.setValue(signedFilePath);
        await mainPage.savePostButton.waitForClickable();
        await mainPage.savePostButton.click();
        await browser.pause(1000);
      });
    });

    describe('Verifies the signed document', function () {

      it('document is displayed', async function () {
        await pdfs.postWithSignedPDF.waitForDisplayed();
        await pdfs.postWithSignedPDF.waitForClickable();
      });

      it('document can be opened in a new tab', async function () {
        await pdfs.postWithSignedPDF.waitForClickable();
        await pdfs.postWithSignedPDF.click();
        const handles = await browser.getWindowHandles() // Получает все вкладки и сохраняет в const handles
        browser.switchToWindow(handles[1]) // Обращается ко 2 вкладке из массива handles
      });

      it('document URL ends with .pdf', async function () {
        const url = await browser.getUrl();
        expect(url.endsWith('.pdf')).to.be.true;
      });
      
      it('document is real PDF (content-type check)', async function () {
        const pdfUrl = await browser.getUrl(); // получаем URL PDF
        const cookies = await browser.getCookies(); // получаем куки текущей сессии
        console.log(cookies)
      
        // Преобразуем куки в объект cookie string
        const cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
      
        // Делаем запрос с куки
        const response = await fetch(pdfUrl, {
          headers: {
            'Cookie': cookieHeader
          }
        });
      
        expect(response.status).to.equal(200);
        expect(response.headers.get('content-type')).to.equal('application/pdf');
      });

      it('document is rendered as PDF', async function () {
        const embed = await $('embed[type="application/pdf"]');
        await embed.waitForDisplayed({ timeout: 5000 });
        const isDisplayed = await embed.isDisplayed();
        expect(isDisplayed).to.be.true;
      });





      xit('should detect that the PDF contains a signature', () => {
        // заглушка: ищем слово "signature" или что-то похожее
        const signatureDetected = pdfText.toLowerCase().includes('signature');
        expect(signatureDetected).to.be.true;
      });

      xit('should identify the signature as a handwritten drawing or embedded image', () => {
        // сюда можно потом воткнуть проверку визуальных элементов через pdf-lib
        // сейчас просто заглушка
        expect(true).to.be.true;
      });

      xit('should find the signature despite a large amount of fake filler text', () => {
        // просто убеждаемся, что длинный текст не мешает
        const longDoc = pdfText.length > 1000;
        const signatureDetected = pdfText.toLowerCase().includes('signature');
        expect(longDoc).to.be.true;
        expect(signatureDetected).to.be.true;
      });

      xit('should correctly locate the primary intended signature', () => {
        // заглушка, можно позже искать координаты последнего слова "signature"
        expect(true).to.be.true;
      });

      xit('should confirm that the signature is in the expected area of the document', () => {
        // тут можно будет анализировать позицию, если пойдём в pdf-lib
        expect(true).to.be.true;
      });
    });

    xdescribe('Uploading unsigned file', function () {
      xit('uploads signed document', async function () {
        // Загружаем файл без подписи
        await mainPage.fileAddButton.setValue(unsignedFilePath);
        await mainPage.savePostButton.waitForClickable();
        await mainPage.savePostButton.click();
        await browser.pause(1000);
      });
    });

    xdescribe('Verifies the unsigned document', function () {
      xit('document is displayed', async function () {
        // Реализовать проверку отображения документа
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
