import { MainPage } from './main.page'

export default class PDFs extends MainPage{
    get postWithSignedPDF() {
        return $(".group.relative").$(`//span[contains(text(), 'Musterdokument.pdf')]`);
    }



}