import { test, expect } from '@playwright/test';

test('Drag and Drop Exp 1', async ({ page }) => {
    //Visit the OrnageHRM Website
    await page.goto("https://www.lambdatest.com/selenium-playground/drag-and-drop-demo");
    await page.dragAndDrop("//span[normalize-space()='Draggable 1']","//div[@id='mydropzone']")
    await page.waitForTimeout(5000)
    //await page.click('.context-menu-icon-edit > span')
    
});

test('Drag and Drop Exp 2', async ({ page }) => {
    //Visit the OrnageHRM Website
    await page.goto("https://www.lambdatest.com/selenium-playground/drag-and-drop-demo");
    await page.dragAndDrop("div[id='draggable'] p","#droppable")
    await page.waitForTimeout(5000)
    //await page.click('.context-menu-icon-edit > span')
    
});

