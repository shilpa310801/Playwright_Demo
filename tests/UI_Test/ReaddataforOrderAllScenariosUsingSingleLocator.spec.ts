import { test, expect, Page } from '@playwright/test';
import { readFileSync } from 'fs';

// Reads the JSON file and saves it  
let objects = readFileSync('./tests/TestData/createOrderAllScenarios.json')
const orders = JSON.parse(objects.toString());

test.describe('E2E WebOrder Application', () => {
    let page: Page;
    // let ExpUserName;

    test.beforeAll(async ({ browser }) => {
        
        page = await browser.newPage();
        await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
        //Browser.object.action
        await page.getByLabel('Username:').fill('Tester');
        //await page.pause();
        await page.getByLabel('Password:').fill('test');
        await page.getByRole('button', { name: 'Login' }).click();
        //Verify that user has logged in
        //await page.url().includes('/Default1.aspx')
        await expect(page).toHaveURL('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/default.aspx')

    });

    for (const data of orders) {
    test(`Create Order - Verify Order: ${data.TestCaseID}`, async () => {
    //test('Create Order', async () => {
        //for (const data of orders) {
        
            //await expect(page).toHaveURL('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/default.aspx')
            await page.getByRole('link', { name: 'Order' }).nth(1).click();
            //Verify that user has clicked on Order Link
            await page.url().includes('/Process.aspx')
            await page.getByRole('combobox', { name: 'Product:*' }).selectOption(data.Product);
            await page.getByLabel('Quantity:*').fill(data.Quantity);
            await page.getByLabel('Customer name:*').fill(data.Customer);
            await page.getByLabel('Street:*').fill(data.Street);
            await page.getByLabel('City:*').fill(data.City);
            await page.getByLabel('Zip:*').fill(data.Zip);
            await page.getByLabel('Visa').check();
            //await page.pause();
            await page.getByLabel('Card Nr:*').fill(data.Card);
            await page.getByLabel('Expire date (mm/yy):*').fill(data.Expire);
            await page.getByRole('link', { name: 'Process' }).click();

            let msg
            if (data.Result == ' New order has been successfully added. ') {
                msg = await page.locator("//strong[normalize-space()='New order has been successfully added.']")
                await expect(msg).toHaveText(data.Result)
            }
            else {
                msg = await page.locator("//span[@style='color: red; display: inline;']")
            }
            await expect(msg).toContainText(data.Result)
       // }
    });
    }
    test.afterAll(async () => {
        await page.getByRole('link', { name: 'Logout' }).click()
        await page.url().includes("/Login.aspx")
    });
});