import { test } from "../fixtures/test-fixtures";
import { users } from "../test-data/users";

test.describe("Checkout Tests", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test("user can complete checkout successfully @regression", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.openCart();

    await cartPage.verifyCartPageLoaded();
    await cartPage.clickCheckout();

    await checkoutPage.fillCheckoutInformation("Eric", "Aung", "10001");
    await checkoutPage.continueCheckout();
    await checkoutPage.verifyOverviewPageLoaded();

    await checkoutPage.finishCheckout();
    await checkoutPage.verifyOrderSuccess();
  });

  test("checkout overview total calculation is correct", async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.addProductToCart("Sauce Labs Bolt T-Shirt");
    await inventoryPage.openCart();

    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation("Eric", "Aung", "10001");
    await checkoutPage.continueCheckout();
    await checkoutPage.verifyOverviewPageLoaded();

    await checkoutPage.verifyPriceSummaryCalculation();
  });
});
