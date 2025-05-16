import { MainPage } from './main.page'

export default class PDFs extends MainPage{
    get postWithSignedPDF() {
        return $(".group.relative").$(`//span[contains(text(), 'Musterdokument.pdf')]`);
    }
    //check getters
    get scriptSource1(){
        return $('script[src="resource://pdf.js/build/pdf.mjs"]')
    }

    get scriptSource2(){
        return $('script[src="resource://pdf.js/web/viewer.mjs"]')
    }

    get link(){
        return $('link[rel="localization"][href="toolkit/pdfviewer/viewer.ftl"]');
    }

    get stylesheetLink1(){
        return $('link[rel="stylesheet"][href="resource://pdf.js/web/viewer.css"]');
    }

    get stylesheetLink2(){
        return $('link[rel="stylesheet"][href="resource://pdf.js/web/viewer.css"]');
    }

    get outerContainer(){
        return $('#outerContainer');
    }

    get sidebarContainer(){
        return $('#sidebarContainer');
    }

    get viewThumbnailButton(){
        return $('#viewThumbnail');
    }

    async getTitle(){
        await browser.getTitle();
    }
}