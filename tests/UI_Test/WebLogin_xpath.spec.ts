import { test, expect } from '@playwright/test';

test('Verify Orange Website login functionality', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.locator("//input[@placeholder='Username']").fill("Admin")
  await page.locator("//input[@placeholder='Password']").fill("admin125453")
  await page.getByRole('button', { name:"Login" }).click();
 // await page.getByRole("//input[@class='oxd-button oxd-button--medium oxd-button--main orangehrm-login-button']").click()
 
 // await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible(); //Assertion
  //await expect(page.getByRole('alertdialog', { name: 'Invalid credentials' })).toBeVisible()
  await expect(page.getByText( 'Invalid credentials')).toBeVisible();
  await expect(page.locator("//h6[]"))
});