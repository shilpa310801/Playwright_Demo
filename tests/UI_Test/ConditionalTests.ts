import { test, expect } from '@playwright/test';
//const { test, expect } = require('@playwright/test');

test('BalzeDemo', async ({ page,browserName  }) => {
  test.skip(browserName === 'chromium', 'Still working on it');
  await page.goto('https://blazedemo.com/');
  //await page.pause();
  await page.locator('select[name="fromPort"]').selectOption('Boston');
  await page.locator('select[name="toPort"]').selectOption('London');
  await page.getByRole('button', { name: 'Find Flights' }).click();
  await page.goto('https://blazedemo.com/purchase.php');
  await page.getByPlaceholder('First Last').click();
  await page.getByPlaceholder('First Last').fill('Abhi Dixit');
  await page.locator('#cardType').selectOption('amex');
  await page.getByPlaceholder('Credit Card Number').click();
  await page.getByPlaceholder('Credit Card Number').fill('123456789');
  await page.getByPlaceholder('John Smith').click();
  await page.getByPlaceholder('John Smith').fill('Abhi');
  await page.getByRole('button', { name: 'Purchase Flight' }).click();
  await page.getByRole('heading', { name: 'Thank you for your purchase today!' }).click();
});

test('TO Test Login Functionality-Writtern Scripts', async ({ page,browserName  }) => {
  test.skip(browserName === 'webkit', 'Still working on it');
  await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
  await page.getByLabel('Username:').type('Tester')
  await page.getByLabel('Password:').fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();

});