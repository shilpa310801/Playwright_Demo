/*Everything here is runnable locally. I’ll include:
 
1. `package.json` (scripts)
2. `playwright.config.ts`
3. `tsconfig.json`
4. `data/employees.json` (valid + invalid cases)
5. `pages/LoginPage.ts` and `pages/PIMPage.ts` (page objects)
6. `tests/addEmployee.spec.ts` (tests that iterate JSON)
7. How to run
 
---
 
### 1) package.json
 
```json
{
  "name": "orangehrm-playwright",
  "version": "1.0.0",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.35.0",
    "typescript": "^5.0.0"
  }
}
```
 
---
 
### 2) playwright.config.ts
 
```ts
import { defineConfig } from '@playwright/test';
 
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 5000 },
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    ignoreHTTPSErrors: true
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]]
});
```
 
---
 
### 3) tsconfig.json
 
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "outDir": "dist",
    "sourceMap": true,
    "types": ["node", "playwright"]
  },
  "include": ["pages", "tests", "playwright.config.ts"]
}
```
 
---
 
### 4) data/employees.json
 
Create a folder `data/` and this file `employees.json`. It contains valid and invalid test cases.
 
```json

```
 
Notes:
 
* `employeeId` left blank so OrangeHRM auto-generates one. If you want specific IDs, provide them.
* `photofile` left blank; if you want to upload, put a relative path and uncomment upload code in `PIMPage.ts`.
 
---
 
### 5) Page objects
 
Create `pages/LoginPage.ts`:
 
```ts
import { Page, expect } from '@playwright/test';
 
export class LoginPage {
  readonly page: Page;
  readonly username = 'input[name="username"]';
  readonly password = 'input[name="password"]';
  readonly loginBtn = 'button[type="submit"]';
 
  constructor(page: Page) {
    this.page = page;
  }
 
  async goto() {
    await this.page.goto('/');
  }
 
  async login(username: string, password: string) {
    await this.page.fill(this.username, username);
    await this.page.fill(this.password, password);
    await this.page.click(this.loginBtn);
    // wait for dashboard or error
    await this.page.waitForLoadState('networkidle');
  }
 
  async expectLoggedIn() {
    // dashboard top bar visible
    await expect(this.page.locator('header')).toBeVisible();
  }
 
  async expectLoginError() {
    await expect(this.page.locator('.oxd-alert')).toBeVisible();
  }
}
```
 
Create `pages/PIMPage.ts`:
 
```ts
import { Page, expect } from '@playwright/test';
 
export class PIMPage {
  readonly page: Page;
  readonly pimMenu = 'a[href="/web/index.php/pim/viewPimModule"]';
  readonly addButton = 'button:has-text("Add")';
  readonly firstName = 'input[name="firstName"]';
  readonly middleName = 'input[name="middleName"]';
  readonly lastName = 'input[name="lastName"]';
  readonly employeeId = 'input[placeholder="Type for hints..."] ~ input'; // fallback: will adjust in test if needed
  readonly saveButton = 'button:has-text("Save")';
  readonly successHeader = 'h6:has-text("Personal Details")';
 
  constructor(page: Page) {
    this.page = page;
  }
 
  async navigateToPIM() {
    await this.page.click(this.pimMenu);
    await this.page.waitForLoadState('networkidle');
  }
 
  async openAddEmployee() {
    // click Add button in PIM page
    await this.page.click(this.addButton);
    await this.page.waitForLoadState('networkidle');
  }
 
  async fillEmployee(payload: { firstName: string; middleName?: string; lastName: string; employeeId?: string; photofile?: string }) {
    if (payload.firstName !== undefined) {
      await this.page.fill(this.firstName, payload.firstName);
    }
    if (payload.middleName !== undefined) {
      await this.page.fill(this.middleName, payload.middleName);
    }
    if (payload.lastName !== undefined) {
      await this.page.fill(this.lastName, payload.lastName);
    }
    if (payload.employeeId) {
      // If employee id input exists
      const idLocator = this.page.locator('//label[text()="Employee Id"]/following::input[1]');
      if (await idLocator.count()) {
        await idLocator.fill(payload.employeeId);
      }
    }
    // file upload (optional)
    if (payload.photofile) {
      // Example selector for upload - update if needed
      const uploadLocator = this.page.locator('input[type="file"]');
      if (await uploadLocator.count()) {
        await uploadLocator.setInputFiles(payload.photofile);
      }
    }
  }
 
  async save() {
    await this.page.click(this.saveButton);
  }
 
  async expectAddSuccess() {
    // the Personal Details header appears on success
    await expect(this.page.locator(this.successHeader)).toBeVisible({ timeout: 5000 });
  }
 
  async expectValidationError() {
    // OrangeHRM shows required field messages - look for text or error class
    const errors = this.page.locator('.oxd-input--has-error, .oxd-text--error');
    await expect(errors.first()).toBeVisible({ timeout: 3000 });
  }
}
```
 
> Note: Selectors in OrangeHRM vary slightly by version. The above uses resilient locators. If a selector fails, update by inspecting the page. I used XPath or text-based locators where stable. For “orders” replace these selectors with ones for the order form.
 
---
 
### 6) Test file: tests/addEmployee.spec.ts
 
```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PIMPage } from '../pages/PIMPage';
import fs from 'fs';
import path from 'path';
 
type Emp = { firstName: string; middleName?: string; lastName: string; employeeId?: string; photofile?: string };
 
const dataPath = path.join(__dirname, '..', 'data', 'employees.json');
const raw = fs.readFileSync(dataPath, 'utf-8');
const allData = JSON.parse(raw);
 
test.describe('OrangeHRM - Add Employee tests (data-driven)', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('Admin', 'admin123'); // demo credentials
    await login.expectLoggedIn();
  });
 
  for (const [idx, emp] of (allData.valid as Emp[]).entries()) {
    test(`Add employee - valid data #${idx + 1} - ${emp.firstName} ${emp.lastName}`, async ({ page }) => {
      const pim = new PIMPage(page);
      await pim.navigateToPIM();
      await pim.openAddEmployee();
      await pim.fillEmployee(emp);
      await pim.save();
 
      // Expect success by checking Personal Details visible
      await pim.expectAddSuccess();
 
      // Optional: verify name matches header
      const header = page.locator('h6');
      await expect(header).toContainText(emp.firstName);
      await expect(header).toContainText(emp.lastName);
    });
  }
 
  for (const [idx, emp] of (allData.invalid as Emp[]).entries()) {
    test(`Add employee - invalid data #${idx + 1}`, async ({ page }) => {
      const pim = new PIMPage(page);
      await pim.navigateToPIM();
      await pim.openAddEmployee();
      await pim.fillEmployee(emp);
      await pim.save();
 
      // Expect validation / errors
      await pim.expectValidationError();
    });
  }
});
```
 
---
 
### 7) How to set up & run
 
1. Initialize and install:
 
```bash
mkdir orangehrm-playwright
cd orangehrm-playwright
# put the files & folders as described
npm init -y
# copy package.json contents above or paste
npm install
npx playwright install
```
 
2. Run tests:
 
```bash
npx playwright test
# or with headed browser to watch:
npx playwright test --headed
# open HTML report after run:
npx playwright show-report */
import { readFileSync } from 'fs';
import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';

// Read and parse the CSV file
const records = parse(readFileSync('./tests/Test_Data/createOrderAllScenarios.csv'), {
  columns: true,
  skip_empty_lines: true,
}) as Record<string, string>[];

test.describe('WebOrder All Test Scenario', () => {
  for (const record of records) {
    test(`WebOrder App - ${record['test_case']}`, async ({ page }) => {
      await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx');

      await page.fill('input[name="ctl00\\$MainContent\\$username"]', record['uname']);
      await page.fill('input[name="ctl00\\$MainContent\\$password"]', record['pass']);
      await page.click('text=Login');

      if (record['Exp_Result'] === 'List of All Orders') {
        await expect(page.locator("div[class='content'] h2")).toContainText(record['Exp_Result']);
        await page.click('text=Logout');
        await page.waitForLoadState('load');
      } else {
        await expect(page.locator("span[id='ctl00_MainContent_status']")).toHaveText(record['Exp_Result']);
      }
    });
  }
});