import {Page} from "@playwright/test";
import loginData from "../test-resources/test-data/LoginCredentials.json";

export class LoginPage {

    page: Page;


    constructor(page){
        this.page = page
        this.USERNAME_EDITBOX = this.page.locator("input[id='userEmail']");
        this.PASSWORD_EDITBOX = this.page.locator("input[id='userPassword']");
        this.LOGIN_BUTTON = this.page.locator("input[type='submit']");
        this.REGISTER_BUTTON = this.page.locator("a[routerlink='/auth/register']");
    }

    async navigateToURL(){
        await this.page.goto(loginData.validCredentials.url);
        await this.page.waitForLoadState("networkidle");
    }



}