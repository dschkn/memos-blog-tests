import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';
import UserActions from '../../helpers/posts.ts';
import { expect } from 'chai';
import PDFs from '../../pageobjects/PDFs.ts';
import { MainPage } from '../../pageobjects/main.page';
import Loaders from '../../helpers/loaders.ts';
// import * as pdfParse from 'pdf-parse';
import pdfParse from 'pdf-parse';

import { PDFDocument } from 'pdf-lib'; // пригодится, если пойдём в визуальные элементы

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
        await browser.waitUntil(async () => {
          const url = await browser.getUrl();
          return url.endsWith('.pdf');
        }, {
          timeout: 5000, 
          timeoutMsg: 'URL did not end with .pdf within 5 seconds'
        });
      
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
        await pdfs.scriptSource1.isDisplayed();
        await pdfs.scriptSource2.isDisplayed();
        await pdfs.link.isDisplayed();
        await pdfs.stylesheetLink1.isDisplayed();
        await pdfs.stylesheetLink2.isDisplayed();
        await pdfs.outerContainer.isDisplayed();
        await pdfs.sidebarContainer.isDisplayed();
        await pdfs.viewThumbnailButton.isDisplayed();
        await pdfs.getTitle();
      });
      
      interface PDFSearchResult {
        found: boolean;
        page?: number;
      }
      
      it('searches for "MAX MUSTERMAN" inside PDF without downloading', async () => {
        const result = await browser.execute<PDFSearchResult, []>(async () => {
          const PDFViewerApp = (window as any).PDFViewerApplication;
      
          const waitForPDF = async () => {
            let tries = 0;
            while (
              (!PDFViewerApp || !PDFViewerApp.pdfDocument || !PDFViewerApp.pdfDocument.numPages) &&
              tries < 200
            ) {
              await new Promise(res => setTimeout(res, 100));
              tries++;
            }
          };
      
          await waitForPDF();
      
          if (!PDFViewerApp?.pdfDocument) {
            console.error('PDF failed to load');
            return { found: false };
          }
      
          const numPages = PDFViewerApp.pdfDocument.numPages;
          console.log('Total pages in PDF:', numPages);
      
          for (let i = 1; i <= numPages; i++) {
            const page = await PDFViewerApp.pdfDocument.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item: any) => item.str).join(' ');
      
            console.log(`Page ${i} text:`, pageText);
      
            const normalizedText = pageText.toLowerCase().replace(/\s+/g, ' ');
            if (normalizedText.includes('max musterman')) {
              return { found: true, page: i };
            }
          }
      
          return { found: false };
        });
      
        if (!result.found) {
          console.warn('Phrase not found! Check the page console for text.');
        }
      
        expect(result.found).to.be.true;
        console.log(`🎯 Phrase found on PDF page: ${result.page}`);
      });

      it('downloads the PDF document to a local folder', async () => {
        const pdfUrl = await browser.getUrl();
        const cookies = await browser.getCookies();
      
        // Convert cookies to a string for the request header
        const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      
        const response = await fetch(pdfUrl, {
          headers: {
            'Cookie': cookieHeader,
          }
        });
      
        if (!response.ok) {
          throw new Error(`❌ Failed to download PDF. Status: ${response.status}`);
        }
      
        const pdfBuffer = await response.buffer();
      
        // Create downloads folder if it doesn't exist
        const downloadDir = path.resolve(__dirname, '../../downloads');
        if (!fs.existsSync(downloadDir)) {
          fs.mkdirSync(downloadDir, { recursive: true });
        }
      
        const downloadPath = path.join(downloadDir, 'downloaded-signed-document.pdf');
        fs.writeFileSync(downloadPath, pdfBuffer);
      
        // Assert that the file exists
        expect(fs.existsSync(downloadPath)).to.be.true;
        console.log(`📥 PDF successfully downloaded to: ${downloadPath}`);
      });


      it('searches for "MAX MUSTERMAN" inside downloaded PDF', async () => {
        const downloadDir = path.resolve(__dirname, '../../downloads');
        const downloadPath = path.join(downloadDir, 'downloaded-signed-document.pdf');
      
        // Проверка, что файл действительно существует
        if (!fs.existsSync(downloadPath)) {
          throw new Error('❌ Downloaded PDF not found at expected location');
        }
      
        // Чтение PDF и поиск текста
        const pdfBuffer = fs.readFileSync(downloadPath);
        const data = await pdfParse(pdfBuffer);
        const text = data.text.toLowerCase();
      
        const phrase = 'max musterman';
        const found = text.includes(phrase);
      
        expect(found).to.be.true;
        console.log(`🔍 Phrase "${phrase}" ${found ? 'was found' : 'was NOT found'} in the downloaded PDF`);
      });
      

      
      

      



















  











      it('should detect that the PDF contains a signature', () => {

      });


















      xit('should identify the signature as a handwritten drawing or embedded image', () => {
        // сюда можно потом воткнуть проверку визуальных элементов через pdf-lib
        // сейчас просто заглушка
      });

      xit('should find the signature despite a large amount of fake filler text', () => {
        // просто убеждаемся, что длинный текст не мешает
        
      });

      xit('should correctly locate the primary intended signature', () => {
        // заглушка, можно позже искать координаты последнего слова "signature"
      });

      xit('should confirm that the signature is in the expected area of the document', () => {
        // тут можно будет анализировать позицию, если пойдём в pdf-lib
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


















  xdescribe("Deletes all posts", function () {
    xit("deletes all posts", async function () {
        this.retries(1);
        await userActions.deleteAllPosts();
    });
});

});
