//import { test, expect } from require('@playwright/test');
import { test, expect } from '@playwright/test';

test('Right Clieck', async ({ page }) => {
    //Visit the OrnageHRM Website
    await page.goto("http://swisnl.github.io/jQuery-contextMenu/demo.html");
    
   // Right Click on Button
    //await page.pause()
    //await page.dblclick("//span[text()='right click me']");
    await page.click("//span[text()='right click me']",{ button: 'right'});
    await page.waitForTimeout(5000)
    await page.locator('.context-menu-list.context-menu-root').click()
    //await page.click('.context-menu-icon-edit > span')
    await page.waitForTimeout(5000)
});