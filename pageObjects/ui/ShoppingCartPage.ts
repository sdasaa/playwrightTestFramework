import { BrowserContext, Page, Locator } from "@playwright/test"
import { BasePage } from "../BasePage";


export class ShoppingCartPage extends BasePage {

    readonly MY_CART_SECTION: Locator;
    readonly ITEMS_IN_CART_LIST: Locator;
    readonly BUY_NOW_BUTTON: Locator;
    readonly DELETE_ITEM_BUTTON: Locator;
    readonly CONTINUE_SHOPPING_BUTTON: Locator;
    readonly CHECKOUT_CART_BUTTON: Locator;
    
    constructor(page: Page, context?: BrowserContext){
        super(page, context)
        this.MY_CART_SECTION = this.page.locator("div.cart");
        this.ITEMS_IN_CART_LIST = this.page.locator("li.items");
        this.BUY_NOW_BUTTON = this.page.getByRole('button', { name: 'Buy Now❯' })
        this.DELETE_ITEM_BUTTON = this.page.getByRole('button', { name: '❯', exact: true })
        this.CONTINUE_SHOPPING_BUTTON = this.page.getByRole('button', {name : /Continue Shopping/})
        this.CHECKOUT_CART_BUTTON = this.page.getByRole('button', {name : /Checkout/})
    }

    async checkoutCartAndProceedToPayment(): Promise<void>{
        await this.CHECKOUT_CART_BUTTON.click();
    }

    async deleteAProductFromCart(productToDelete: string):Promise<void>{
        await this.ITEMS_IN_CART_LIST.filter({hasText: productToDelete})?.locator(this.DELETE_ITEM_BUTTON).click();
    } 
}