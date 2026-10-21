import { BrowserContext, Page, Locator } from "@playwright/test";
import { BasePage } from "../BasePage";

export class DashboardPage extends BasePage{

    readonly ALL_PRODUCTS_LIST: Locator;
    readonly ALL_PRODUCTS_NAMES: Locator;
    readonly SHOPPING_CART_BUTTON: Locator;
    readonly ORDERS_HISTORY_BUTTON: Locator;
    readonly ITEMS_IN_CART_ELEMENT: Locator;
    readonly OVERLAY_SPINNER_ELEMENT: Locator;
    
    constructor(page: Page, context?: BrowserContext){
        super(page, context)
        this.ALL_PRODUCTS_LIST = this.page.locator("section#products div[class='row'] div.card");
        this.ALL_PRODUCTS_NAMES = this.ALL_PRODUCTS_LIST.locator("h5");
        this.SHOPPING_CART_BUTTON = this.page.locator("button[routerlink*='/cart']");
        this.ORDERS_HISTORY_BUTTON = this.page.getByRole("button", {name : `   ORDERS`})
        this.ITEMS_IN_CART_ELEMENT = this.SHOPPING_CART_BUTTON.locator("label")
        this.OVERLAY_SPINNER_ELEMENT = this.page.locator("div.ngx-spinner-overlay");
    }
    
    async searchAndSelectProduct(productToSelect: string): Promise<void>{
        await this.searchTheProduct(productToSelect)
                .getByRole("button",{name: 'Add To Cart'})
                .click();
    }

    searchTheProduct(productToSelect: string): Locator{
        return this.ALL_PRODUCTS_LIST.filter(
            {has : this.page.locator("h5 b", {hasText : productToSelect})}
        )

    }
    
    async navigateToShoppingCart(): Promise<void>{
        await this.SHOPPING_CART_BUTTON.click();
    }

    async navigateToOrdersHistoryPage(): Promise<void>{
        await this.ORDERS_HISTORY_BUTTON.click();
    }
}   