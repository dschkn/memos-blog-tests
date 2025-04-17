import Page from './page'

export class MainPage extends Page {
    
    public async login(username: string, password: string) {
        await this.open("auth");
        await this.authPageTitle.waitForDisplayed();
        await this.authPageIcon.waitForDisplayed();
    
        await this.authUsernameWindow.setValue(username);
        await this.authPasswortWindow.setValue(password);
        await this.signInButton.click();
    
        await this.mainPageParrotIcon.waitForDisplayed();
        console.log("✅ LogIn was successful");
    }
    
//Autorisation getters
get authPageIcon(){
    return $(".h-14")
}

get authPageTitle(){
    return $(".text-5xl")
}

get authUsernameWindow(){
    const windows = $$(".w-full.h-full")
    return windows[0]
}

get authPasswortWindow(){
    const windows = $$(".w-full.h-full")
    return windows[1]
}

//Main Page Elements
get mainPageParrotIcon(){
    return $(".w-full.min-w-full")
}
get accountDropDownMenuButton(){
    return $(".ml-2")
}
get accountDropDownMenu(){
    return $(".MuiMenu-variantOutlined")
}

get accountDropDownMenuOptions(){
    return this.accountDropDownMenu.$$("span.truncate");
}

get signInButton(){
    return $(".border-box")
}
get sideMenuItems(){
    return $$(".ml-3")
}


//Creating a post
get postTextArea(){
    return $("textarea[rows='1']")
}
get dropDownPublicPrivateMenuButton(){
    return $(".MuiSelect-button")
}
get dropDownPublicPrivateMenu(){
    return $("ul[role='listbox']")
}
get dropDownPublicPrivateMenuPrivateButton(){
    return this.dropDownPublicPrivateMenu.$("li*=Private")
}
get dropDownPublicPrivateMenuPublicButton(){
    return this.dropDownPublicPrivateMenu.$("li*=Public")
}

    get savePostButton(){
        return $(".bg-primary")
    }
    get oneSinglePostOnPage(){
        return $(".group.relative")

    }
    get allPostsOnPage(){
        return $$(".group.relative")

    }

    //кнопка добавления файла
    get fileAddButton(){
        return $("#files")
    }

    //три точки опции
    get optionsButton(){
        return $(".lucide-ellipsis-vertical")
    }

    


    
    


}
