import { test } from "../fixtures/test-fixtures";
import { users } from "../test-data/users";

test.describe("Inventory Item Page Tests", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test("user can open product details page", async ({
    inventoryPage,
    inventoryItemPage,
  }) => {
    await inventoryPage.openProductDetails("Sauce Labs Bike Light");
    await inventoryItemPage.verifyProductDetailsPageLoaded();
  });

  test("user can verify product name and price on details page", async ({
    inventoryPage,
    inventoryItemPage,
  }) => {
    await inventoryPage.openProductDetails("Sauce Labs Backpack");
    await inventoryItemPage.verifyProductDetailsPageLoaded();

    await inventoryItemPage.verifyProductInfo(
      "Sauce Labs Backpack",
      undefined,
      "$29.99",
    );
  });

  test("user can add product to cart from details page", async ({
    inventoryPage,
    inventoryItemPage,
  }) => {
    await inventoryPage.openProductDetails("Sauce Labs Backpack");
    await inventoryItemPage.addToCart();
    await inventoryItemPage.verifyRemoveButtonVisible();
  });

  test("user can go back to products page", async ({
    inventoryPage,
    inventoryItemPage,
  }) => {
    await inventoryPage.openProductDetails("Sauce Labs Backpack");
    await inventoryItemPage.clickBackToProducts();
    await inventoryPage.verifyInventoryPageLoaded();
  });
});
