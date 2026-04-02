import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  readonly pageTitle: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator(".title");
    this.checkoutButton = page.locator("#checkout");
    this.continueShoppingButton = page.locator("#continue-shopping");
  }

  // from various cart items, filter the one with same product name @inventory_item_name
  // “Find the cart item that matches this product name”
  getCartItem(productName: string) {
    return this.page.locator(".cart_item").filter({
      has: this.page.locator(".inventory_item_name", {
        hasText: productName,
      }),
    });
  }

  getItemName(productName: string): Locator {
    return this.page.locator(".inventory_item_name", { hasText: productName });
  }

  // .locator("button") => “Inside that cart item, find the button”
  getRemoveItem(productName: string): Locator {
    return this.getCartItem(productName).locator("button");
  }

  async verifyCartPageLoaded() {
    await expect(this.page).toHaveURL(/cart/);
    await this.verifyText(this.pageTitle, "Your Cart");
  }

  async verifyProductInCart(productName: string) {
    await expect(this.getCartItem(productName)).toBeVisible();
  }

  async verifyProductNotInCart(productName: string) {
    await expect(this.getItemName(productName)).toHaveCount(0);
  }

  // action buttons
  async removeProduct(productName: string) {
    await this.getRemoveItem(productName).click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }
}
