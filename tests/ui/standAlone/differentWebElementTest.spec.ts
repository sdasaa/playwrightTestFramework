// @ts-check
import {test, expect} from "@playwright/test";
import {myTestTags, myTestConfig, logger} from '@utils/index'

test.use({
    baseURL : "https://rahulshettyacademy.com/AutomationPractice/"
})

test.describe(`Suite-Test different webElements of RShetty-AutomationPractice`, ()=> {

    const title = "Practice Page"; 
    const instructor = "Rahul Shetty";

    test(`Validating Alerts & handle them using page.on()`,
    {tag: [myTestTags.ui, myTestTags.smoke, myTestTags.standalone, myTestTags.p1], 
    annotation: {type: 'JIRA', description: 'RS-001'}},
    
    async ({page, baseURL}, testinfo) => {
        logger.info(`Starting test ${testinfo.title}`)
        logger.info(`Test Annotations ${JSON.stringify(testinfo.annotations)}`)
        logger.info(`Test ID ${testinfo.testId}`)
        logger.info(`Worker Index ${testinfo.workerIndex}`)
        logger.info(`baseURL -> ${baseURL}`)
        
        await test.step(`Launch App and validate title`, async () => {
            logger.info(`Step-Launch App and validate title`)
            await page.goto(baseURL || "");
            await expect(page.getByRole('button', {name: /Home/})).toBeVisible();
            expect(await page.title()).toBe(title);
            await testinfo.attach('Login ss', {
                body: await page.screenshot(),
                contentType : 'image/png',
            })
        })

        await test.step(`Register a dialog listener and trigger allerts`, async () => {
            logger.info(`Step-Registe a dialog listener and trigger allerts`)
            page.on('dialog', dialog => {
                logger.info(`Type of Alert - ${dialog.type()}`)
                logger.info(`Message of Alert - ${dialog.message()}`)
                dialog.accept()
            });

            await page.locator("input#alertbtn").click();
            await page.locator("input#confirmbtn").click();
            await testinfo.attach('Dialog box - ss', { body: await page.screenshot(), contentType: 'image/PNG' })
        })
    })


    test(`Validating Interacting with iFrames`,
    {tag: [myTestTags.ui, myTestTags.smoke, myTestTags.standalone, myTestTags.p1], 
    annotation: {type: 'JIRA', description: 'RShetty standalone-iFrames'}}, 
    
    async ({page, baseURL}, testinfo) => {

        await test.step(`Launch app and validate title`, async () => {
            await page.goto(baseURL || "");
            await page.waitForLoadState('domcontentloaded');
            expect(await page.title()).toBe(title);
            await expect(page.locator("button[id='mousehover']")).toBeVisible();
        })

        await test.step(`Locating iframe and interacting with elements inside them`, async () => {
            await page.locator("button[id='mousehover']").hover();
            const iframe = page.frameLocator("iframe[id='courses-iframe']");
            const moreInfo = iframe.locator("div.header-upper li.dropdown");
            await moreInfo.hover();
            await moreInfo.locator("ul.dropdown-menu a[href*='about']").dblclick();
            await testinfo.attach('iFrame ss', { body: await page.screenshot({fullPage: true}), contentType: 'image/PNG' })
        })

    })

    test(`Validate Handling of Child Windows`,
    {tag: [myTestTags.ui, myTestTags.smoke, myTestTags.standalone, myTestTags.p1], 
    annotation: {type: 'JIRA', description: 'RShetty standalone-windows'}}, 
    async ({page, baseURL}) => {

        await test.step(`Launch app and validate title`, async () => {
            await page.goto(baseURL || "");
            await page.waitForLoadState('domcontentloaded');
            expect(await page.title()).toBe(title);
        })

        await test.step(`Open a child window and act on the elements of it`, async () => {
            await page.locator("button[id='mousehover']").hover();
            const iframe = page.frameLocator("iframe[id='courses-iframe']");
            const moreInfo = iframe.locator("div.header-upper li.dropdown");
            await moreInfo.hover();

            const [ , childPage1] = await Promise.all([
                moreInfo.locator("ul.dropdown-menu a[href*='about']").click(),
                page.waitForEvent('popup'),
            ])

            expect(await childPage1.locator("section.items-center div.text-center h1").textContent()).toContain(instructor);
        })
    })
})