//import { test, expect } from '@playwright/test';
import { test, expect } from '@playwright/test';

test('Login and Then Create Order and Verify Order', async ({ page }) => {
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

  await page.getByRole('link', { name: 'Order', exact: true }).click();
  //Verify that user has clicked on Order Link
  await expect(page).toHaveURL('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Process.aspx')
  await page.url().includes('/Process.aspx')
  //await page.getByRole('combobox', { name: 'Product:*' }).selectOption('FamilyAlbum');
  await page.getByLabel('Product:*').selectOption('FamilyAlbum');
  //await page.getByLabel('Quantity:*').click();
  //await page.getByText('Quantity:*').click();
  await page.getByLabel('Quantity:*').fill('5');
  //await page.getByLabel('Customer name:*').click();
  await page.getByLabel('Customer name:*').fill('Dixit');
  //await page.getByLabel('Street:*').click();
  await page.getByLabel('Street:*').fill('BTM');
  //await page.getByLabel('City:*').click();
  await page.getByLabel('City:*').fill('Bangalore');
  //await page.getByLabel('Zip:*').click();
  await page.getByLabel('Zip:*').fill('560076');
  await page.getByLabel('Visa').click();
  await page.getByLabel('Card Nr:*').fill('1234567891');
  await page.getByLabel('Expire date (mm/yy):*').fill('12/23');
  await page.getByRole('link', { name: 'Process' }).click();
  const neworder =  await page.locator("#strong") 
  //await page.getByText('New order has been')
  //const neworder = await page.locator("//strong[normalize-space()='New order has been successfully added.']")
  console.log(neworder)

 await expect(neworder).toContainText('New order has been successfully added.')
//await page.getByText('View all orders').click()
await page.getByRole('link', { name: 'View all orders' }).click()
  await expect(page.locator("//td[text()='Dixit']")).toHaveText('Dixit')
  //Logout
  await page.getByRole('link', { name: 'Logout' }).click()
  await page.url().includes("/Login.aspx")
  await expect(page).toHaveURL("http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx?ReturnUrl=%2fsamples%2fTestComplete11%2fWebOrders%2fDefault.aspx")
});
