# Playwright E-Commerce Test Framework - Agent Instructions

This is an end-to-end automation testing framework for the Rahul Shetty Academy e-commerce demo application. It tests the complete user journey from login through order confirmation.

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm test` | Run all Playwright tests |
| Browser | Chromium (headless=false in config) |
| Reporter | HTML (auto-generated in `playwright-report/`) |
| Test Results | Stored in `test-results/` |
| Timeout | 5 seconds per expect statement |

## Architecture & Key Patterns

### Page Object Model (POM)

All page objects are located in [pageObjects/](pageObjects/) and follow these conventions:

**Pattern:**
- Each page is a TypeScript class with a constructor accepting `Page` object
- Locators defined as `readonly` class members using `UPPERCASE_SNAKE_CASE`
- Business logic methods are `async` and return `Promise`

**Locator Definition:**
```typescript
readonly USERNAME_EDITBOX = this.page.locator("input[id='userEmail']");
readonly LOGIN_BUTTON = this.page.locator("input[value='Login']");
```

**Method Pattern:**
```typescript
async loginToApplication(username: string, password: string) {
  await this.USERNAME_EDITBOX.fill(username);
  await this.PASSWORD_EDITBOX.fill(password);
  await this.LOGIN_BUTTON.click();
  await this.page.waitForLoadState('networkidle');
}
```

**Key Page Objects:**
- [LoginPage.ts](pageObjects/LoginPage.ts) - Authentication & navigation
- [DashboardPage.ts](pageObjects/DashboardPage.ts) - Product search/selection with helper methods
- [CheckoutPage.ts](pageObjects/CheckoutPage.ts) - Multi-step payment form (⚠️ **has incomplete code sections**)
- [ShoppingCartPage.ts](pageObjects/ShoppingCartPage.ts) - Cart management
- [OrderConfirmationPage.ts](pageObjects/OrderConfirmationPage.ts) - Order verification
- [OrderHistoryPage.ts](pageObjects/OrderHistoryPage.ts) - Order history review
- [ViewOrdersPage.ts](pageObjects/ViewOrdersPage.ts) - View past orders

### Test Organization

**Current State:** Hybrid approach with two test patterns

1. **TypeScript POM-Based** (`tests/pageObjects/E2EShoppingFlow.spec.ts`)
   - Uses imported page classes
   - Status: Partially implemented

2. **Standalone JavaScript** (`tests/standAlone/E2EShoppingFlow.spec.js`)
   - All locators and assertions inline (no POM abstraction)
   - Status: **Complete, fully functional reference implementation**
   - Use this as reference for understanding the complete e2e flow

### Test Data Management

Test data is externalized in [test-resources/test-data/](test-resources/test-data/):

- **LoginCredentials.json** - Flat structure with `URL`, `username`, `password`
- **E2EShoppingFlow_td.json** - Array of test data objects containing:
  - `products`: Array of product names to add to cart
  - `cardNumber`, `cvvCode`, `cardholderName`: Payment details
  - `country`: Checkout country
  - `coupon`: Discount code
  - `message`: Expected order message for verification

**Loading Pattern:**
```javascript
const testData = JSON.parse(JSON.stringify(require('../../test-resources/test-data/E2EShoppingFlow_td.json')))
```

## Key Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Locators | UPPERCASE_SNAKE_CASE | `USERNAME_EDITBOX`, `ADD_TO_CART_BUTTON` |
| Methods | camelCase, async | `async loginToApplication()` |
| Selectors | CSS selectors | `input[id='userEmail']` |
| File Naming | PascalCase + "Page" | `LoginPage.ts`, `CheckoutPage.ts` |
| Assertions | Expect from Playwright | `await expect(element).toBeVisible()` |

## Project State & Gotchas

### ⚠️ Important Notes for Agents

1. **CheckoutPage.ts Incomplete** - Lines 70+ contain inline commented code that may need cleanup or implementation. Review carefully before modifications.

2. **Dual Test Approach** - The framework contains both:
   - TypeScript POM tests (in `tests/pageObjects/`) - **incomplete, use as template**
   - JavaScript standalone tests (in `tests/standAlone/`) - **complete reference**
   - When creating new tests, prefer the TypeScript POM approach but reference the JavaScript standalone for the complete flow logic

3. **zObsolete/ Directory** - Contains legacy JavaScript implementations of page objects. Do not use these—reference only if understanding historical patterns is needed.

4. **Test Data - Deep Copy Pattern** - Tests use `JSON.parse(JSON.stringify(...))` to create deep copies of test data. Maintain this pattern when loading data.

5. **HTML Reporter** - After running `npm test`, view results in:
   - `playwright-report/index.html` (summary)
   - `test-results/` (detailed failure context)

## Typical Tasks & Files to Modify

| Task | Primary Files |
|------|---|
| Add new test | Create in `tests/pageObjects/`, use POM classes |
| Extend page object | Modify relevant file in `pageObjects/` |
| Update test data | Edit `test-resources/test-data/*.json` |
| Fix selectors | Update `readonly` locators in respective page object |
| Add test helper | Create method in appropriate page object or create new `Helper.ts` |

## File Structure

```
pageObjects/          # Page Object Model classes (TypeScript)
tests/
  pageObjects/        # POM-based tests (TypeScript) - INCOMPLETE
  standAlone/         # Standalone tests (JavaScript) - COMPLETE REFERENCE
test-resources/
  test-data/          # External test data (JSON)
zObsolete/            # Legacy implementations - do NOT use
playwright-report/    # Auto-generated HTML test reports
test-results/         # Auto-generated detailed failure reports
playwright.config.js  # Playwright configuration
tsconfig.json         # TypeScript configuration
```

## Next Steps for Agent Improvements

When working on this codebase, consider:

1. **Completing the TypeScript POM tests** - [tests/pageObjects/E2EShoppingFlow.spec.ts](tests/pageObjects/E2EShoppingFlow.spec.ts) is partially implemented
2. **Cleaning up CheckoutPage.ts** - Review and organize the commented/incomplete sections
3. **Adding additional page objects** if new user flows are tested
4. **Parameterizing tests** for multiple user scenarios using the test data structure
