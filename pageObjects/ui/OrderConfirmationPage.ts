import { BrowserContext, Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';
import path from 'path';


export class OrderConfirmationPage extends BasePage {

    readonly ORDER_CONFIRMATION_MSG_H1: Locator;
    readonly ORDER_CONFIRMATION_ID:Locator;
    readonly ORDER_SUMMARY_TABLE:Locator;
    readonly ORDER_HISTORY_PAGE_LINK:Locator;
    readonly DOWNLOAD_ORDERDETAILS_CSV_BTN: Locator;

    constructor(page: Page, context?: BrowserContext){
        super(page, context)
        this.ORDER_CONFIRMATION_MSG_H1 = this.page.getByText("Thankyou for the order.");
        this.ORDER_CONFIRMATION_ID = this.page.getByText(/\|\s*.*\s*\|/i);
        this.ORDER_SUMMARY_TABLE = this.page.locator("table.order-summary");
        this.ORDER_HISTORY_PAGE_LINK = this.page.getByText(/Orders History Page/);
        this.DOWNLOAD_ORDERDETAILS_CSV_BTN = this.page.getByRole('button', { name: 'Click To Download Order' });
    }

    fetchOrderInfofromOrderSummary(itemOrdered: string): Locator{
        return this.ORDER_SUMMARY_TABLE.getByRole('cell', {name : new RegExp(itemOrdered)})
    }

    async fetchOrderID(): Promise<string> {
        return (await this.ORDER_CONFIRMATION_ID.innerText()).trim().replaceAll("|", "");
    }
    
    async navigateToOrderHistoryPage(): Promise<void> {
        await this.ORDER_HISTORY_PAGE_LINK.click();
    }
    
    async downloadOrderDetailsCsv(): Promise<void> {
        const downloadPromise = this.page.waitForEvent('download');
        await this.DOWNLOAD_ORDERDETAILS_CSV_BTN.click();
        const downloadedFile = await downloadPromise;
        await downloadedFile.saveAs(path.join(__dirname, '../zObsolete/junk/downloads', downloadedFile.suggestedFilename()))
    }


}
