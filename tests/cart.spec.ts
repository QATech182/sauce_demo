import { test, expect } from "../fixtures/test-fixtures";
import { users } from "../test-data/users";

test.describe("Cart Page Tests @smoke @regression", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test("user can add product and see it in cart", async ({
    inventoryPage,
    cartPage,
  }) => {
    // add product into cart
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.openCart();

    // check the correct product is inside the cart
    await cartPage.verifyCartPageLoaded();
    await cartPage.verifyProductInCart("Sauce Labs Backpack");
  });

  test("user can remove product from cart", async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.openCart();

    await cartPage.verifyProductInCart("Sauce Labs Backpack");
    await cartPage.removeProduct("Sauce Labs Backpack");
    await cartPage.verifyProductNotInCart("Sauce Labs Backpack");
  });

  test("user can continue shopping from cart page", async ({
    inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.openCart();

    await cartPage.continueShopping();
    await inventoryPage.verifyInventoryPageLoaded();
  });

  test("user can navigate to checkout from cart page", async ({
    inventoryPage,
    cartPage,
  }) => {});
});
