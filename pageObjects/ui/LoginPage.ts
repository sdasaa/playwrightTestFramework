import { BrowserContext, Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class LoginPage extends BasePage {

    readonly USERNAME_EDITBOX:Locator;
    readonly PASSWORD_EDITBOX:Locator;
    readonly LOGIN_BUTTON:Locator;
    readonly REGISTER_BUTTON:Locator;

    constructor(page: Page, context?: BrowserContext){
        super(page, context);
        this.USERNAME_EDITBOX = this.page.locator("input[id='userEmail']");
        this.PASSWORD_EDITBOX = this.page.locator("input[id='userPassword']");
        this.LOGIN_BUTTON = this.page.locator("input[type='submit']");
        this.REGISTER_BUTTON = this.page.locator("a[routerlink='/auth/register']");
    }

    async navigateToLoginPage(): Promise<void> {
        await this.page.goto("/client");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async loginToApplication(username: string, password: string): Promise<void> {
        await this.USERNAME_EDITBOX.fill(username);
        await this.PASSWORD_EDITBOX.fill(password);
        await this.LOGIN_BUTTON.click();
    }


}