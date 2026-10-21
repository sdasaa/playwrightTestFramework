import { BrowserContext, Page, Locator } from '@playwright/test'
import { BasePage } from '../BasePage';

export class OrderHistoryPage extends BasePage {

    readonly ORDER_HISTORY_TABLE: Locator;
    readonly ORDER_HISTORY_ROWS: Locator;
    readonly ORDER_HISTORY_ROWS_VIEW_BTN: Locator;
    readonly ORDER_HISTORY_EMPTY_MSG: Locator
    
    constructor(page: Page, context?: BrowserContext){
        super(page, context)
        this.ORDER_HISTORY_TABLE = this.page.locator("table.table");
        this.ORDER_HISTORY_ROWS = this.ORDER_HISTORY_TABLE.locator("tbody tr");
        this.ORDER_HISTORY_ROWS_VIEW_BTN = this.page.getByRole("button", {name: 'View'});
        this.ORDER_HISTORY_EMPTY_MSG = this.page.getByText("You have No Orders to show at")
    }

    fetchAnOrder(orderID: string): Locator{
        return this.ORDER_HISTORY_ROWS.filter({hasText : orderID})
    }
    
    async viewAnOrder(orderID: string): Promise<void> {
        await this.ORDER_HISTORY_ROWS.filter({hasText : orderID}).locator(this.ORDER_HISTORY_ROWS_VIEW_BTN).click();
    }


}