import { readFileSync } from 'fs';
import { test, expect, Page } from '@playwright/test';
import { parse } from 'csv-parse/sync';

// Read and parse the CSV file
const records = parse(readFileSync('./tests/TestData/createOrderAllScenarios.csv'), {
  columns: true,  // Use the first row as column names
  skip_empty_lines: true,  // Skip any empty lines
}) as Record<string, string>[];  // Type assertion to indicate that each row is a record with string keys and values

test.describe('WebOrder All Test Scenario', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    // Set up the browser page
    page = await browser.newPage();
    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
  });

  test('WebOrder App', async () => {
    // Loop over each record from the CSV
    for (const record of records) {
      // Since `record` is typed as `Record<string, string>`, we access the columns dynamically

      // Fill the username field
      await page.locator('input[name="ctl00\\$MainContent\\$username"]').clear();
      await page.fill('input[name="ctl00\\$MainContent\\$username"]', record['uname']);

      // Fill the password field
      await page.locator('input[name="ctl00\\$MainContent\\$password"]').clear();
      await page.fill('input[name="ctl00\\$MainContent\\$password"]', record['pass']);

      // Click the "Login" button
      await page.click('text=Login');

      // Check the expected result after login
      if (record['Exp_Result'] === 'List of All Orders') {
        // Verify that the expected text appears on the page
        await expect(page.locator("div[class='content'] h2")).toContainText(record['Exp_Result']);

        // Log out and wait for the page to load
        await page.click('text=Logout');
        await page.waitForLoadState('load');  // Wait for the page to load
      } else {
        // If the result is an invalid login message, verify that it's displayed
        await expect(page.locator("span[id='ctl00_MainContent_status']")).toHaveText(record['Exp_Result']);
      }
    }
  });
});