//import { test, expect } from '@playwright/test';
import { test, expect } from '@playwright/test';
// Define test parameters along with values
const testParameters = [
  { product: 'MyMoney', price: '100' },
  { product: 'FamilyAlbum', price: '80' },
  { product: 'ScreenSaver', price: '20' }
];

for (const { product, price } of testParameters) {

  // Write a test
  test(`Parameterize tests in playwright ${product}`, async ({ page }) => {
    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
    //Browser.object.action
    await page.getByLabel('Username:').fill('Tester');
    //await page.pause();
    await page.getByLabel('Password:').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    //Verify that user has logged in
    //await page.url().includes('/Default1.aspx')
    await expect(page).toHaveURL('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/default.aspx')
    // Click on Order and Create Order

    await page.getByRole('link', { name: 'Order' }).nth(1).click();
    //Verify that user has clicked on Order Link
    await page.url().includes('/Process.aspx')
    
    await page.getByRole('combobox', { name: 'Product:*' }).selectOption(product);
    //await page.getByLabel('Price per unit:*').getAttribute
    const PriceperUnit = await page.locator('#ctl00_MainContent_fmwOrder_txtUnitPrice').inputValue();
    console.log("Price per unit is " + PriceperUnit);
    await expect(PriceperUnit).toBe(price);
  });
}