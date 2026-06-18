// @ts-check

const {test, expect} = require('@playwright/test')
const loginData = JSON.parse(JSON.stringify(require('../../test-resources/test-data/LoginCredentials.json')))
const testData = JSON.parse(JSON.stringify(require('../../test-resources/test-data/E2EShoppingFlow_td.json')))

const pageTitle = "Let's Shop";


test(`@Regression E2E Shopping flow of an e-commerce website`, async ({page}) => {

    // LoginPage
    const username = page.locator("input[id='userEmail']");
    const password = page.locator("input[id='userPassword']");
    const loginBtn = page.locator("input[type='submit']");
    // DashboardPage
    const allProducts = page.locator("section#products div[class='row'] div.card");
    const allProductsText = allProducts.locator("b");
    const shoppingCart = page.locator("button[routerlink*='/cart']");
    // MyCartPage
    const myCartSection = page.locator("div.cart");
    const itemsInMyCart = myCartSection.locator("li.items");
    const itemsNameInMyCart = itemsInMyCart.locator("h3");
    const buyNow = itemsInMyCart.locator("button.btn-primary");
    const deleteItem = itemsInMyCart.locator("button.btn-danger");
    const continueShopping = page.getByRole("button",{name : "Continue Shopping"})
    const checkoutCart = page.locator("div.subtotal button");
    // CheckoutPage
    const paymentTypes = page.locator("div.payment__types div");
    const ccPaymentFileds = page.locator("div.payment__cc  div.row");
    const shippingInfo = page.locator("div.user__name");

    // OrderConfirmationPage
    const orderConfirmationMsg = page.locator("table h1");
    const orderSummaryTable = page.locator("table.order-summary");
    const orderConfirmationID = page.locator("label.ng-star-inserted");
    const orderHistoryPageLink = page.locator("label[routerlink$='myorders']")

    // OrderHistoryPage
    const ordersHistory = page.locator("table.table");
    const ordersHistoryRows = ordersHistory.locator("tbody tr");

    // ViewOrdersPage
    const viewOrdersSummary = page.locator("div.email-container");
    const viewOrdersSummaryRows = viewOrdersSummary.locator("div.row");

    // Test Execution
    await page.goto(loginData.validCredentials.url);
    await page.waitForLoadState("networkidle");
    expect(await page.title()).toEqual(pageTitle);
    
    await username.fill(loginData.validCredentials.username);
    await password.fill(loginData.validCredentials.password);
    await loginBtn.click();
    await allProducts.last().waitFor();

    // DashboardPage 
    expect(await allProductsText.allTextContents()).toEqual(expect.arrayContaining(testData[0].allProducts));
    expect(await shoppingCart.locator("label").textContent()).toEqual("");
    await allProducts.filter({hasText : testData[0].productToSelect}).getByRole("button",{name: 'Add To Cart'}).click();
    /* Spinner Validation - Bad, just for knowledge */
    await page.locator("div.ngx-spinner-overlay").waitFor({state : "visible"})
    await expect(shoppingCart.locator("label")).toBeVisible();
    await page.locator("div.ngx-spinner-overlay").waitFor({state : "detached"})
    expect(await shoppingCart.locator("label").textContent()).toEqual("1");
    await expect(shoppingCart).toContainText("1");
    await shoppingCart.click();

    // MyCartPage
    await expect(myCartSection).toBeVisible();
    await expect(itemsNameInMyCart).toHaveText(testData[0].productToSelect);
    await expect(buyNow).toBeVisible();
    await expect(deleteItem).toBeVisible();
    await expect(continueShopping).toBeVisible();
    await checkoutCart.click();

    // CheckoutPage - flow
    await expect(paymentTypes.first()).toBeVisible();
    const [month, year] = await ccPaymentFileds.locator("div.field", {hasText : 'Expiry Date '}).locator("select").all();
    await month.selectOption(testData[0].ccDetails.expiry.month);
    await year.selectOption(testData[0].ccDetails.expiry.year);

    await ccPaymentFileds.locator("div.field", {hasText : 'CVV Code '}).locator("input").fill(testData[0].ccDetails.cvvCode);
    await ccPaymentFileds.locator("div.field", {hasText : 'Name on Card '}).locator("input").fill(testData[0].ccDetails.cvvCode);
    await ccPaymentFileds.locator("div.field", {hasText : 'Apply Coupon '}).locator("input").fill(testData[0].ccDetails.couponToApply);
    await ccPaymentFileds.getByRole('button', {name : 'Apply Coupon'}).click();

    // Type-1 of writing
    await expect(paymentTypes.filter({hasText : "Credit Card"})).toHaveAttribute("class", /active/);
    await expect(paymentTypes.filter({hasText : "Credit Card"})).toHaveClass(/active/);
    await expect(paymentTypes.filter({hasText : 'Paypal'})).not.toHaveClass(/active/);
    // Type-2 : Page scoping
    await expect(page.locator("div.payment__types div", {hasText : 'SEPA'})).not.toHaveClass(/active/);
    await expect(page.locator("div.payment__types div", {hasText : 'Invoice'})).not.toHaveClass(/active/);

    await expect(ccPaymentFileds.locator("div.field", {hasText : "Credit Card Number "}).locator("input")).toHaveValue(testData[0].ccDetails.ccNumber);
    await expect(month).toHaveValue(testData[0].ccDetails.expiry.month);
    await expect(year).toHaveValue(testData[0].ccDetails.expiry.year);
    await expect(ccPaymentFileds.locator("div.field", {hasText : 'CVV Code '}).locator("input")).toHaveValue(testData[0].ccDetails.cvvCode);
    await expect(ccPaymentFileds.locator("div.field", {hasText : 'Name on Card '}).locator("input")).toHaveValue(testData[0].ccDetails.cvvCode);
    await expect(ccPaymentFileds.locator("div.field", {hasText : 'Apply Coupon '}).locator("input")).toHaveValue(testData[0].ccDetails.couponToApply);
    
    
    await expect(ccPaymentFileds.getByText("* Coupon Applied")).toBeVisible();
    await expect(ccPaymentFileds.getByText("* Coupon Applied")).toHaveText("* Coupon Applied");
    await expect(shippingInfo.getByText(loginData.validCredentials.username)).toHaveText(loginData.validCredentials.username);
    await shippingInfo.getByRole("textbox", {name : "Select Country"}).pressSequentially("United");
    await shippingInfo.getByRole("button", {name: /United States$/}).click();
    await expect(shippingInfo.getByRole("textbox", {name : "Select Country"})).toHaveValue(testData[0].country);
    await shippingInfo.getByText("Place Order").click();
    
    
    await expect(orderConfirmationMsg).toBeVisible();
    const orderID = (await orderConfirmationID.innerText()).trim().replaceAll("|", "");
    console.log(orderID);
    await expect(orderConfirmationMsg).toContainText("Thankyou for the order");
    await expect(orderSummaryTable.getByRole("cell", {name : /iphone 13/})).toContainText(testData[0].productToSelect)
    await expect(orderSummaryTable.getByRole("cell", {name : /iphone 13/})).toContainText(`Qty: ${testData[0].quantity}`)
    await expect(orderSummaryTable.getByRole("button", {name : /Download Order Details/})).toBeVisible()
    await expect(orderSummaryTable.getByRole("button", {name : /Download Order Details/})).toHaveText("Click To Download Order Details in CSV")
    const downloadPromise = page.waitForEvent('download');
    await orderSummaryTable.getByRole("button", {name : /Download Order Details/}).click();
    await downloadPromise;

    await orderHistoryPageLink.click();
    await expect(ordersHistory).toBeVisible();
    await expect(ordersHistoryRows.filter({hasText : orderID})).toContainText(orderID)
    await ordersHistoryRows.filter({hasText : orderID}).getByRole("button", {name: 'View'}).click();
    await expect(viewOrdersSummary).toBeVisible();
    await expect(viewOrdersSummaryRows.filter({hasText : 'Order Id'})).toContainText(orderID);
    await expect(viewOrdersSummaryRows.filter({hasText : 'Billing Address'})).toContainText(loginData.validCredentials.username);
    await expect(viewOrdersSummaryRows.filter({hasText : 'Billing Address'})).toContainText(testData[0].country);
    await expect(viewOrdersSummaryRows.filter({hasText : 'Delivery Address'})).toContainText(loginData.validCredentials.username);
    await expect(viewOrdersSummaryRows.filter({hasText : 'Delivery Address'})).toContainText(testData[0].country);
    await page.pause();
})