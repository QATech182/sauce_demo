import { test } from "../fixtures/test-fixtures";
import { users } from "../test-data/users";

test.describe("Footer Tests", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
  });

  test("footer is visible on inventory page", async ({ footerComponent }) => {
    await footerComponent.verifyFooterVisible();
    await footerComponent.verifySocialLinksVisible();
    await footerComponent.verifyFooterTextContains("Sauce Labs");
  });

  test("footer links have correct urls", async ({ footerComponent }) => {
    await footerComponent.verifyAllFooterLinks();
  });

  test("footer is visible on inventory item page", async ({
    inventoryPage,
    footerComponent,
  }) => {
    await inventoryPage.openProductDetails("Sauce Labs Backpack");

    await footerComponent.verifyFooterVisible();
    await footerComponent.verifySocialLinksVisible();
  });

  test("footer is visible on cart page", async ({
    inventoryPage,
    cartPage,
    footerComponent,
  }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.openCart();
    await cartPage.verifyCartPageLoaded();

    await footerComponent.verifyFooterVisible();
  });
});
