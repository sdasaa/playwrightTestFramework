import { BrowserContext, Page, Locator } from '@playwright/test'

export class BasePage {

    protected readonly context? : BrowserContext;
    protected readonly page: Page;

    constructor(page: Page, context?:BrowserContext){
        this.page = page;
        this.context = context
    }

    get pageObject(): Page{
        return this.page;
    }

    async getPageTitle(): Promise<string>{
        return await this.page.title();
    }

    async navigateToNewPage(elementToClick: Locator): Promise<Page | undefined>{
        const newPagePromise = this.context?.waitForEvent('page');
        await elementToClick.click();
        const newPage = await newPagePromise;
        await newPage?.waitForLoadState();
        return newPage;
    }

    async setTokenInBrowserStorage(token: string){
        await this.page.addInitScript(
            token => window.localStorage.setItem("token", token),
            token
        )
    }
}   