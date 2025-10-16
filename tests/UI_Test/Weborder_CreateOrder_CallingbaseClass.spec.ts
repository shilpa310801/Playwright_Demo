import { test, Page } from '@playwright/test';
import { Login_LogoutPage } from './BaseTests';

test.describe('WebOrder E2E Test tests @sanity @smoke', () => {
  let loginPage: Login_LogoutPage;
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();

    loginPage = new Login_LogoutPage(page);

    // ✅ Login once before all tests
    await loginPage.gotoURL();
    await loginPage.loginToApp("Tester", "test");
    await loginPage.verifyURL('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/default.aspx');

  });

  test('Go to Order Page', async () => {
    await page.getByRole('link', { name: 'Order' }).nth(1).click();
    await page.waitForLoadState('networkidle');
  });

  test('Go to View All Order Page', async () => {

    await page.getByRole('link', { name: 'View all orders' }).click();
    await page.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    // const page = (test.info().annotations as any).page;
    // const context = (test.info().annotations as any).context;

    // ✅ Logout after all tests
    await loginPage.logoutFromApp();

  });
});
