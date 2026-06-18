// @ts-check
const {test, expect} = require("@playwright/test");

const practiseUrl = "https://rahulshettyacademy.com/AutomationPractice/";
const title = "Practice Page"; 
const instructor = "Rahul Shetty";


test(`@Regression @Smoke Validate Alerts & handle them`, async ({page}) =>{

    await page.goto(practiseUrl);
    expect(await page.title()).toBe(title);

    await page.on('dialog', dialog => dialog.accept());
    await page.locator("input#alertbtn").click();
    await page.locator("input#confirmbtn").click();
})


test(`@Regression @Smoke Interacting with frames`, async ({page}) => {

    await page.goto(practiseUrl);
    await page.waitForLoadState('domcontentloaded');
    expect(await page.title()).toBe(title);

    await page.locator("button[id='mousehover']").hover();
    const iframe = await page.frameLocator("iframe[id='courses-iframe']");
    const moreInfo = iframe.locator("div.header-upper li.dropdown");
    await moreInfo.hover();
    await moreInfo.locator("ul.dropdown-menu a[href*='about']").click();

})

test(`@Regression @Smoke Handling child windows`, async ({page}) => {

    await page.goto(practiseUrl);
    await page.waitForLoadState('domcontentloaded');
    expect(await page.title()).toBe(title);

    await page.locator("button[id='mousehover']").hover();
    const iframe = await page.frameLocator("iframe[id='courses-iframe']");
    const moreInfo = iframe.locator("div.header-upper li.dropdown");
    await moreInfo.hover();

    const [childPage1] = await Promise.all([
        page.waitForEvent('popup'),
        moreInfo.locator("ul.dropdown-menu a[href*='about']").click(),
    ])

    expect(await childPage1.locator("section.items-center div.text-center h1").textContent()).toContain(instructor);
});