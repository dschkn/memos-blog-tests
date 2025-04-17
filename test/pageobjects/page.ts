import { browser } from '@wdio/globals'

export default class Page {
    
    public open(path?: string) {
        return browser.url(path || '/');
    }

    

}
