import fs from "fs";
import { test, expect } from "@playwright/test";

// Reads the JSON file and saves it
const objects = fs.readFileSync("./tests/TestData/create_order_All_Scenario_Switch.json", "utf-8");
const orders = JSON.parse(objects);

test("Create Order - All Scenario", async ({ page }) => {
  // Login
  await page.goto("http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx");
  await page.getByLabel("Username:").fill("Tester");
  await page.getByLabel("Password:").fill("test");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(
    "http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/default.aspx"
  );

  // Navigate to order page
  await page.getByRole("link", { name: "Order" }).nth(1).click();
  await expect(page).toHaveURL(/Process\.aspx/);

  // Order Scenarios
  for (const order of orders) {
    await page.locator("//input[@value='Reset']").click();

    if (order.Product) await page.locator("#ctl00_MainContent_fmwOrder_ddlProduct").selectOption(order.Product);
    if (order.Quantity) await page.locator("#ctl00_MainContent_fmwOrder_txtQuantity").fill(order.Quantity);
    if (order.Customer) await page.locator("#ctl00_MainContent_fmwOrder_txtName").fill(order.Customer);
    if (order.Street) await page.locator("#ctl00_MainContent_fmwOrder_TextBox2").fill(order.Street);
    if (order.City) await page.locator("#ctl00_MainContent_fmwOrder_TextBox3").fill(order.City);
    if (order.Zip) await page.locator("#ctl00_MainContent_fmwOrder_TextBox5").fill(order.Zip);
    if (order.Card) {
      await page.locator("#ctl00_MainContent_fmwOrder_TextBox6").fill(order.Card);
      await page.locator("#ctl00_MainContent_fmwOrder_cardList_1").click();
    }
    if (order.Expire) await page.locator("#ctl00_MainContent_fmwOrder_TextBox1").fill(order.Expire);

    await page.locator("#ctl00_MainContent_fmwOrder_InsertButton").click();

    // ✅ Switch for validation
    switch (order.Result.trim()) {
      case "New order has been successfully added.":
        await expect(
          page.locator("//strong[normalize-space()='New order has been successfully added.']")
        ).toHaveText("New order has been successfully added.");
        break;

      case "Field 'Quantity' cannot be empty.":
        await expect(
          page.locator("#ctl00_MainContent_fmwOrder_RequiredFieldValidator1 em")
        ).toHaveText(order.Result.trim());
        break;

      case "Field 'Customer name' cannot be empty.":
        await expect(
          page.locator("#ctl00_MainContent_fmwOrder_RequiredFieldValidator2")
        ).toHaveText(order.Result.trim());
        break;

      case "Field 'Street' cannot be empty.":
        await expect(
          page.locator("#ctl00_MainContent_fmwOrder_RequiredFieldValidator3")
        ).toHaveText(order.Result.trim());
        break;

      case "Field 'City' cannot be empty.":
        await expect(
          page.locator("#ctl00_MainContent_fmwOrder_RequiredFieldValidator4")
        ).toHaveText(order.Result.trim());
        break;

      case "Field 'Zip' cannot be empty.":
        await expect(
          page.locator("#ctl00_MainContent_fmwOrder_RequiredFieldValidator5")
        ).toHaveText(order.Result.trim());
        break;

      case "Field 'Card Nr' cannot be empty.":
        await expect(
          page.locator("#ctl00_MainContent_fmwOrder_RequiredFieldValidator6")
        ).toHaveText(order.Result.trim());
        break;

      case "Field 'Expire date' cannot be empty.":
        await expect(
          page.locator("#ctl00_MainContent_fmwOrder_RequiredFieldValidator7")
        ).toHaveText(order.Result.trim());
        break;

      case "Invalid format. Only digits allowed.":
        await expect(
          page.locator("#ctl00_MainContent_fmwOrder_rev1")
        ).toHaveText(order.Result.trim());
        break;        
      default:
        throw new Error(`Unexpected result: ${order.Result}`);
    }
  }

  // Logout verification
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.locator("#ctl00_MainContent_login_button")).toBeVisible();
});
