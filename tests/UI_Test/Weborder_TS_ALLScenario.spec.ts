//Run "npm install xlsx" to install the xlsx file
import { test, expect, Page } from '@playwright/test';
import { readFile, utils } from 'xlsx';

let workbook = readFile('./tests/TestData/Book2.xlsx');
let sheet_name_list = workbook.SheetNames;
let records: any[] = utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

test.describe('WebOrder All Test Scenario', () => {
  let page: Page;
  //let records: any[] = [];
  //Page can be directly used in test not in hooks, in hooks we can use browser and assign new page to page
  test.beforeAll(async ({ browser }) => {
    //const browser = await chromium.launch();
    page = await browser.newPage();

    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
  })

  test('WebOrder App', async () => {
  
    for (const record of records) {
      await page.locator('input[name="ctl00\\$MainContent\\$username"]').clear();
      await page.fill('input[name="ctl00\\$MainContent\\$username"]', record.uname);
      await page.locator('input[name="ctl00\\$MainContent\\$password"]').clear();
      await page.fill('input[name="ctl00\\$MainContent\\$password"]', record.pass);

      await page.click('text=Login');
      if ('List of All Orders' == record.Exp_Result) {

        await expect(page.locator("div[class='content'] h2")).toContainText(record.Exp_Result)
        await page.click('text=Logout');
        await page.waitForLoadState(); // The promise resolves after 'load' event.

      } else if ('Invalid Login or Password.' == record.Exp_Result)
      {
        const name = await page.$eval("#ctl00_MainContent_status", el => el.textContent.trim())
        //expect(name).toBe('Invalid Login or Password.')
        expect(name).toBe(record.Exp_Result)

      }

    }
  })

})
