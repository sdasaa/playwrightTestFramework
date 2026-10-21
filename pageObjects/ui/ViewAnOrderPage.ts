import { BrowserContext, Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ViewAnOrderPage extends BasePage {


    readonly VIEW_ORDERS_CONFIRMATION_MSG: Locator;
    readonly VIEW_ORDERS_SUMMARY_SECTION: Locator;
    readonly VIEW_ORDERS_SUMMARY_ROWS: Locator;
    readonly VIEW_ORDERS_ORDER_ID: Locator;
    readonly VIEW_ORDERS_BILLING_ADDRESS: Locator;
    readonly VIEW_ORDERS_DELIVERY_ADDRESS: Locator;
    readonly VIEW_ORDERS_PDT_ORDERED: Locator;
    readonly VIEW_ORDERS_BTN: Locator;


    constructor(page: Page, context?: BrowserContext){
        super(page, context);
        this.VIEW_ORDERS_CONFIRMATION_MSG = this.page.getByText(/Thank you for Shopping With Us/)
        this.VIEW_ORDERS_SUMMARY_SECTION = this.page.locator("div.email-container");
        this.VIEW_ORDERS_SUMMARY_ROWS = this.VIEW_ORDERS_SUMMARY_SECTION.locator("div.row");
        this.VIEW_ORDERS_ORDER_ID = this.VIEW_ORDERS_SUMMARY_ROWS.filter({hasText: /Order Id/i});
        this.VIEW_ORDERS_BILLING_ADDRESS = this.VIEW_ORDERS_SUMMARY_ROWS.filter({hasText: /Billing Address/i});
        this.VIEW_ORDERS_DELIVERY_ADDRESS = this.VIEW_ORDERS_SUMMARY_ROWS.filter({hasText: /Delivery Address/i});
        this.VIEW_ORDERS_PDT_ORDERED = this.VIEW_ORDERS_SUMMARY_ROWS.filter({has: this.page.locator("div.artwork-card-info")});
        this.VIEW_ORDERS_BTN = this.VIEW_ORDERS_SUMMARY_SECTION.getByText('View Orders');
    }

    async navigateBackToViewOrders(){
        this.VIEW_ORDERS_BTN.click();
    }
}