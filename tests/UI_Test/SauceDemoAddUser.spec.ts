import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: ' Add' }).click();
  await page.getByText('-- Select --').first().click();
  await page.getByRole('option', { name: 'Admin' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).fill('y');
  await page.getByText('DirectoryTest1759992018779  Automation').click();
  await page.getByText('-- Select --').click();
  await page.getByRole('option', { name: 'Disabled' }).click();
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill('rthtghgjgh')
  await page.getByRole('textbox').nth(3).click();
  await page.getByRole('textbox').nth(3).fill('qwertyuiop1');
  await page.getByRole('textbox').nth(4).click();
  await page.getByRole('textbox').nth(4).fill('qwertyuiop1');
  await page.getByRole('button', { name: 'Save' }).click();
 await expect('A8DCo 010Z').toContain('New order has been successfully added.')
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await expect('Login').toContain('Login')

});