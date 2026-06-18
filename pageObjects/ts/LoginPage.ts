import {Page, Locator} from "@playwright/test";

export class LoginPage {

    readonly page: Page;
    readonly USERNAME_EDITBOX:Locator;
    readonly PASSWORD_EDITBOX:Locator;
    readonly LOGIN_BUTTON:Locator;
    readonly REGISTER_BUTTON:Locator;

    constructor(page: Page){
        this.page = page
        this.USERNAME_EDITBOX = this.page.locator("input[id='userEmail']");
        this.PASSWORD_EDITBOX = this.page.locator("input[id='userPassword']");
        this.LOGIN_BUTTON = this.page.locator("input[type='submit']");
        this.REGISTER_BUTTON = this.page.locator("a[routerlink='/auth/register']");
    }

    async navigateToURL(urlToNavigate: string): Promise<void> {
        await this.page.goto(urlToNavigate);
        await this.page.waitForLoadState("domcontentloaded");
    }

    async loginToApplication(username: string, password: string):Promise<void> {
        await this.USERNAME_EDITBOX.fill(username);
        await this.PASSWORD_EDITBOX.fill(password);
        await this.LOGIN_BUTTON.click();
    }


}