import { test, expect } from '@playwright/test';

test('Verify MyMoney price in View All Products matches Order section', async ({ page }) => {
  
  await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
  await page.getByRole('textbox', { name: 'Username:' }).fill('Tester');
  await page.getByRole('textbox', { name: 'Password:' }).fill('test');
  await page.getByRole('button', { name: 'Login' }).click();

  
  await expect(page.getByRole('heading', { name: 'List of All Orders' })).toBeVisible();

  await page.getByRole('link', { name: 'View all products' }).click();
  await expect(page.locator('h2')).toHaveText('List of Products');
 
  const myMoneyRow = page.locator('//table[@class="ProductsTable"]//tr[td[text()="MyMoney"]]');
  const priceFromProductsPage = await myMoneyRow.locator('td:nth-child(2)').innerText(); // second column = Price
  
  console.log(`Price for MyMoney in Products Page: ${priceFromProductsPage}`);

  await page.getByRole('link', { name: 'Order', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Order', exact: true })).toBeVisible();

  await page.locator('select[name="ctl00$MainContent$fmwOrder$ddlProduct"]').selectOption({ label: 'MyMoney' });
 
  const priceInOrderPage = await page.locator('input[name="ctl00$MainContent$fmwOrder$txtUnitPrice"]').inputValue();

  console.log(`Price in Order Page for MyMoney: ${priceInOrderPage}`);
  
  expect(priceInOrderPage).toBe(priceFromProductsPage.replace('$', '').trim());
   if(priceInOrderPage ==priceFromProductsPage){
    console.log("Both are equal")
   }
});
