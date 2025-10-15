import { test, expect, Page, Locator } from '@playwright/test';

export class Login_LogoutPage {
  private readonly page: Page;
  private readonly InputUserName: Locator;
  private readonly InputPassword: Locator;
  private readonly LoginButton: Locator;
  private readonly Logout_O: Locator;
  private readonly Logout: Locator;
  private readonly icon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.InputUserName = this.page.getByLabel("Username:");
    this.InputPassword = this.page.getByLabel("Password:");
    this.LoginButton = this.page.locator("//input[@id='ctl00_MainContent_login_button']");
    this.Logout_O = this.page.getByRole('menuitem', { name: 'Logout' });
    this.Logout = this.page.locator("//a[text()='Logout']");
    this.icon = this.page.locator("//i[@class='oxd-icon bi-caret-down-fill oxd-userdropdown-icon']");
  }

  /**
   * Verify the current URL matches the expected URL
   * @param url - The expected URL
   * Removing Promise<void> won’t break your code, and TypeScript will still
   * infer the correct return type. It’s just a matter of style and strictness:

Keep Promise<void> if you want clarity and strict typing (useful in teams / code reviews).

Drop it if you prefer shorter and cleaner code.
   */
  // async verifyURL(url: string): Promise<void> {
  //   await expect(this.page).toHaveURL(url);
  // }

  // Implicit (cleaner)
  async verifyURL(url: string) {
    await expect(this.page).toHaveURL(url);
  }
  /**
   * Navigate to the application's login page
   */
  async gotoURL(): Promise<void> {
    try {
      await this.page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx', {
        waitUntil: 'networkidle'
      });
    } catch (error) {
      console.error('Failed to navigate to URL:', error);
      throw error;
    }
  }

  /**
   * Login to the application with provided credentials
   * @param username - The username to login with
   * @param password - The password to login with
   */
  async loginToApp(username: string, password: string): Promise<void> {
    try {
      await this.InputUserName.fill(username);
      await this.InputPassword.fill(password);
      await this.LoginButton.click();
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.error('Failed to login:', error);
      throw error;
    }
  }

  /**
   * Logout from the application
   */
  async logoutFromApp(): Promise<void> {
    try {
      await this.Logout.click();
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  }
}