import { test, expect } from '@playwright/test';
import assert from 'assert';

test.describe('Hooks Example for Screenshot', () =>{

  test.beforeEach(async ({ page }) => {
      // Go to http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx
    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');
  })
//To capture screenshot of particular element
  test.skip('Login to Weborders @smoke', async ({ page }) => {

  // Go to http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx
  //await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');

    // Capture specific element screenshots
    const element = await page.locator('#ctl00_MainContent_login_button')
    await element.screenshot({ path: './tests/Screenshots/LoginButton.png'})

});
//To capture the full page screenshot
  test('Capture Full page screenshot', async ({ page }) => {

  // Go to http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx
  //await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');

  // Capture full page screenshots
  await page.screenshot({ path: './tests/Screenshots/Fullpage.png', fullPage: true})
 
})
});