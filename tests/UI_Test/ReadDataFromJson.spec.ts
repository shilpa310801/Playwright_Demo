import { readFileSync } from 'fs';
import { test, expect } from '@playwright/test';
// Reads the JSON file and saves it  
let objects = readFileSync('./tests/TestData/Weborder_Login.json')
const users = JSON.parse(objects.toString()
);

for (const record of users) {
  test(`WebOrder Login: ${record.test_case}`, async ({ page }) => {
    //console.log(record.name, record.password, record.exp_result);
    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
    await page.getByLabel('Username:').fill(record.name);
    await page.getByLabel('Password:').fill(record.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/default.aspx');
    await expect(page.locator('h2')).toContainText(record.exp_result);  
    await page.getByRole('link', { name: 'Logout' }).click();
    const login = page.locator('#ctl00_MainContent_login_button');
    await expect(login).toBeVisible();

});
}
