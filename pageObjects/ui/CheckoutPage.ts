import { BasePage } from "../BasePage";
import {BrowserContext, Page, Locator} from "@playwright/test"
import {CcDetailsUiTdType, E2eShoppingDetailsUiTdType, E2eShoppingScenariosUiTdType } from '@myTypes/index'

export class CheckoutPage extends BasePage {

    readonly PAYMENT_TYPES: Locator;
    readonly PAYMENT_TYPE_CC: Locator;
    readonly PAYMENT_TYPE_PPAL: Locator;
    readonly PAYMENT_TYPE_SEPA: Locator;
    readonly PAYMENT_TYPE_INVOICE: Locator;
    readonly CC_INFO: Locator;
    readonly CC_INFO_CCNUMBER_EDITBOX: Locator;
    readonly CC_INFO_EXPIRY_DATE_DD: Locator;
    readonly CC_INFO_CVV_CODE_EDITBOX: Locator;
    readonly CC_INFO_NAME_ON_CARD_EDITBOX: Locator;
    readonly CC_INFO_APPLY_COUPON_EDITBOX: Locator;
    readonly CC_INFO_APPLY_COUPON_BUTTON: Locator;
    readonly CC_INFO_APPLY_COUPON_STATUS_TEXT: Locator;
    readonly SHIPPING_INFO_SECTION: Locator;
    readonly SHIPPING_NAME_LABEL: Locator;
    readonly SHIPPING_NAME_EDITBOX: Locator;
    readonly SHIPPING_ADDRESS_SECTION: Locator;
    readonly SHIPPING_COUNTRY_EDITBOX: Locator;
    readonly SHIPPING_COUNTRY_RESULTS_LIST: Locator
    readonly PLACE_ORDER_BUTTON: Locator;

    constructor(page: Page, context?: BrowserContext){
        super(page, context);
        this.PAYMENT_TYPES = this.page.locator("div.payment__types");
        this.PAYMENT_TYPE_CC = this.PAYMENT_TYPES.locator("div.payment__type", {hasText: /Credit Card/});
        this.PAYMENT_TYPE_PPAL = this.PAYMENT_TYPES.locator("div.payment__type", {hasText: /Paypal/});
        this.PAYMENT_TYPE_SEPA = this.PAYMENT_TYPES.locator("div.payment__type", {hasText: /SEPA/});
        this.PAYMENT_TYPE_INVOICE = this.PAYMENT_TYPES.locator("div.payment__type", {hasText: /Invoice/});
        this.CC_INFO = this.page.locator("div.form__cc");
        this.CC_INFO_CCNUMBER_EDITBOX = this.CC_INFO.locator("div.field", {hasText: /Credit Card Number/}).locator("input");
        this.CC_INFO_EXPIRY_DATE_DD = this.CC_INFO.locator("div.field", {hasText: /Expiry Date/}).locator("select");
        this.CC_INFO_CVV_CODE_EDITBOX = this.CC_INFO.locator("div.field", {hasText: /CVV Code /}).locator("input");
        this.CC_INFO_NAME_ON_CARD_EDITBOX = this.CC_INFO.locator("div.field", {hasText: /Name on Card/}).locator("input");
        this.CC_INFO_APPLY_COUPON_EDITBOX = this.CC_INFO.locator("div.field", {hasText: /Apply Coupon/}).locator("input");
        this.CC_INFO_APPLY_COUPON_BUTTON = this.CC_INFO.getByRole("button", {name : /Apply Coupon/})
        this.CC_INFO_APPLY_COUPON_STATUS_TEXT =  this.CC_INFO.locator("div.field", {hasText: /Apply Coupon/}).locator("p");
        this.SHIPPING_INFO_SECTION = this.page.locator("div.user__name");
        this.SHIPPING_NAME_LABEL = this.SHIPPING_INFO_SECTION.locator("label[type='text']");
        this.SHIPPING_NAME_EDITBOX = this.SHIPPING_INFO_SECTION.locator("input[type='text']");
        this.SHIPPING_ADDRESS_SECTION = this.SHIPPING_INFO_SECTION.locator("div.user__address");
        this.SHIPPING_COUNTRY_EDITBOX = this.SHIPPING_ADDRESS_SECTION.getByRole('textbox', {name : /Select Country/});
        this.SHIPPING_COUNTRY_RESULTS_LIST = this.SHIPPING_ADDRESS_SECTION.locator("section.ta-results");
        this.PLACE_ORDER_BUTTON = this.SHIPPING_INFO_SECTION.getByText('PLACE ORDER');
    }


    async enterCCDetails(ccTestData: CcDetailsUiTdType): Promise<void>{
        const [monthOfExpiry, yearOfExpiry ] = await this.CC_INFO_EXPIRY_DATE_DD.all();
        await monthOfExpiry?.selectOption(ccTestData.expiry.month);
        await yearOfExpiry?.selectOption(ccTestData.expiry.year);
        await this.CC_INFO_CCNUMBER_EDITBOX.fill(ccTestData.ccNumber);
        await this.CC_INFO_CVV_CODE_EDITBOX.fill(ccTestData.cvvCode);
        await this.CC_INFO_NAME_ON_CARD_EDITBOX.fill(ccTestData.nameOnCard);
    }

    async applyCoupon(ccTestData: CcDetailsUiTdType){
        await this.CC_INFO_APPLY_COUPON_EDITBOX.fill(ccTestData.couponToApply);
        await this.CC_INFO_APPLY_COUPON_BUTTON.click();
    }

    async enterShippingDetails(e2eOrderTestData: E2eShoppingDetailsUiTdType){
        await this.SHIPPING_COUNTRY_EDITBOX.pressSequentially(e2eOrderTestData.country, {delay: 200});
        await this.SHIPPING_COUNTRY_RESULTS_LIST.waitFor();
        await this.SHIPPING_COUNTRY_RESULTS_LIST.getByRole("button", {name: new RegExp(`${e2eOrderTestData.country}$`, 'i')}).click();
    }

    async placeOrder(){
        await this.PLACE_ORDER_BUTTON.click();
    }
    
}