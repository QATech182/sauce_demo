import { test } from "../fixtures/test-fixtures";
import { users } from "../test-data/users";

// Main Test Group test.describe("", () => { Individual Test Inside });

test.describe("Inventory Tests @regression", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test("user can add one product to cart", async ({ inventoryPage }) => {
    await inventoryPage.verifyInventoryPageLoaded();
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.verifyCartBadgeCount("1");
  });

  test("user can add mulltiple products to cart", async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.addProductToCart("Sauce Labs Bike Light");
    await inventoryPage.verifyCartBadgeCount("2");
  });

  test("user can sort product low to high", async ({ inventoryPage }) => {
    await inventoryPage.verifyInventoryPageLoaded();
    await inventoryPage.sortBy("Price (low to high)");
  });

  test("user can sort product a to z", async ({ inventoryPage }) => {
    await inventoryPage.verifyInventoryPageLoaded();
    await inventoryPage.sortBy("Name (A to Z)");
  });
});
