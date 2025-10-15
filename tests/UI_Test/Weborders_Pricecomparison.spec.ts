import { test, expect } from '@playwright/test';
 
// Define test parameters along with values
const testParameters = [
  { product: 'MyMoney', price: '100' },
  { product: 'FamilyAlbum', price: '80' },
  { product: 'ScreenSaver', price: '20' }
];
 
for (const { product, price } of testParameters) {
 
  test(`Parameterize tests in playwright ${product}`, async ({ page }) => {
    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
    await page.getByLabel('Username:').fill('Tester');
    await page.getByLabel('Password:').fill('test');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/default.aspx');
    await page.getByRole('link', { name: 'View all products' }).click();
    const productNames = await page.locator('.ProductName').allTextContents();
    const productPrices = await page.locator('.ProductPrice').allTextContents();
    const cleanedPrices = productPrices.map(price => parseFloat(price.replace('$', '').trim()));
    const productIndex = productNames.findIndex(name => name.trim() === product);
    if (productIndex !== -1) {
      const displayedPrice = cleanedPrices[productIndex];
      console.log(`Price for ${product} from View All Products page: $${displayedPrice}`);
      await page.getByRole('link', { name: 'Order' }).nth(1).click();
      await expect(page).toHaveURL(/Process.aspx/);
      await page.getByRole('combobox', { name: 'Product:*' }).selectOption({ label: product });
      const pricePerUnitLocator = page.locator('#ctl00_MainContent_fmwOrder_txtUnitPrice');
      const pricePerUnit = await pricePerUnitLocator.inputValue();
      const pricePerUnitNumber = parseFloat(pricePerUnit.replace('$', '').trim());
      console.log(`Price per unit for ${product} from the Order form: $${pricePerUnitNumber}`);
      await expect(pricePerUnitNumber).toBe(displayedPrice);
    } else {
      console.log(`Product ${product} not found in the "View All Products" list`);
    }
  });
}