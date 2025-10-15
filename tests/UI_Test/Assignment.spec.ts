//CRUD ON OrangeHRM
//demowebshop.tricentis.com
//13.10.2025
//do the readdatainall tcs in Orange hrm website
//Scenarios of Order screen all possile scenarios for Weborders 


import fs from 'fs';
import { test, expect } from '@playwright/test';

// Read test data from a JSON file
const testData = fs.readFileSync('./tests/TestData/assignment.json', 'utf-8');
const loginData = JSON.parse(testData);

test('OrangeHRM Login Test Scenarios', async ({ page }) => {
  // Loop through each login test case
  for (const data of loginData) {
    // Navigate to the OrangeHRM login page
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Perform login
    await page.locator('input[name="username"]').fill(data.username);
    await page.locator('input[name="password"]').fill(data.password);
    await page.locator('button[type="submit"]').click();

    // Wait for page navigation after login attempt
    if (data.expectedResult === 'success') {
      await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
      await expect(page.locator('h6')).toHaveText('Dashboard');
    } else {
      await expect(page.locator('.oxd-alert-content')).toHaveText(data.expectedError);
    }


    if (data.expectedResult === 'success') {
      await page.locator("/html/body/div/div[1]/div[1]/header/div[1]/div[3]/ul/li/span/i").click();
      await page.locator("/html/body/div/div[1]/div[1]/header/div[1]/div[3]/ul/li/ul/li[4]").click();
  await expect(page.locator("/html/body/div/div[1]/div/div[1]/div/div[2]/h5")).toBeVisible();
    }
  }

});


//Assignment 
//web orders->goto view all products->slect Product name and go its sibling which is Price and go to Order and compare this Price per unit: with the sibling data
