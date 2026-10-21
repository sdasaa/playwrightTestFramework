import {preAuthorizedContextsFix as base} from '@fixtures/index';
import {
    LoginPage, 
    DashboardPage, 
    ShoppingCartPage, 
    CheckoutPage, 
    OrderConfirmationPage, 
    OrderHistoryPage, 
    ViewAnOrderPage
} from '@pages/index'

type AllPageObjects = {
        preAuthorizedPageObjects : {
            loginPage: LoginPage;
            dashboardPage: DashboardPage;
            shoppingCartPage: ShoppingCartPage;
            checkoutPage: CheckoutPage;
            orderConfirmationPage: OrderConfirmationPage;
            orderHistoryPage: OrderHistoryPage;
            viewAnOrderPage: ViewAnOrderPage;
        },
        unAuthorizedPageObjects : {
            loginPage: LoginPage;
            dashboardPage: DashboardPage;
            shoppingCartPage: ShoppingCartPage;
            checkoutPage: CheckoutPage;
            orderConfirmationPage: OrderConfirmationPage;
            orderHistoryPage: OrderHistoryPage;
            viewAnOrderPage: ViewAnOrderPage;
        }
}
export const uiPomFix = base.extend<AllPageObjects>({

    preAuthorizedPageObjects : async ({authorizedBrowserContext, authorizedBrowserPage}, use) => {
        // const preAuthorizedPage = await authorizedBrowserContext.newPage();
        await use({
            loginPage : new LoginPage(authorizedBrowserPage),
            dashboardPage : new DashboardPage(authorizedBrowserPage, authorizedBrowserContext),
            shoppingCartPage : new ShoppingCartPage(authorizedBrowserPage, authorizedBrowserContext),
            checkoutPage : new CheckoutPage(authorizedBrowserPage, authorizedBrowserContext),
            orderConfirmationPage : new OrderConfirmationPage(authorizedBrowserPage, authorizedBrowserContext),
            orderHistoryPage : new OrderHistoryPage(authorizedBrowserPage, authorizedBrowserContext),
            viewAnOrderPage : new ViewAnOrderPage(authorizedBrowserPage, authorizedBrowserContext),
        })
        // await preAuthorizedPage.close()
    },
    unAuthorizedPageObjects : async ({context, page}, use) => {
        await use({
            loginPage : new LoginPage(page),
            dashboardPage : new DashboardPage(page, context),
            shoppingCartPage : new ShoppingCartPage(page, context),
            checkoutPage : new CheckoutPage(page, context),
            orderConfirmationPage : new OrderConfirmationPage(page, context),
            orderHistoryPage : new OrderHistoryPage(page, context),
            viewAnOrderPage : new ViewAnOrderPage(page, context),
        })
    }
})
