import { test } from "../fixtures/test-fixtures";
import { users } from "../test-data/users";

// test.describe = test group
test.describe("Login Tests", () => {
  test("valid login with standard user @smoke", async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.open();
    await loginPage.verifyLoginPageLoaded();
    await loginPage.login(users.standard.username, users.standard.password);

    await inventoryPage.verifyInventoryPageLoaded();
  });

  test("invalid login show errors", async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.invalid.username, users.invalid.password);

    await loginPage.verifyErrorMessage("Username and password do not match");
  });

  test("locked out user shows error", async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.lockedout.username, users.lockedout.password);

    await loginPage.verifyErrorMessage("Sorry, this user has been locked out");
  });
});
