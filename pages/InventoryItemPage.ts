import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class InventoryItemPage extends BasePage {
  readonly itemName: Locator;
  readonly itemDescription: Locator;
  readonly itemPrice: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);

    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemDescription = page.locator('[data-test="inventory-item-desc"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator("button", { hasText: "Add to cart" });
    this.removeButton = page.locator("button", { hasText: "Remove" });
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async verifyProductDetailsPageLoaded() {
    await expect(this.page).toHaveURL(/inventory-item/);
    await expect(this.itemName).toBeVisible();
    await expect(this.itemDescription).toBeVisible();
    await expect(this.itemPrice).toBeVisible();
    await expect(this.backToProductsButton).toBeVisible();
  }

  async getProductName(): Promise<string> {
    // ?.trim() -> optional chaining
    // Meaning -> “If value exists → trim it, otherwise don’t crash”
    // ?? ""
    // Meaning -> “If result is null/undefined → return empty string”
    // All Meaning
    // 1 Get text - 2 if exists -> trim - 3 if null -> return
    return (await this.itemName.textContent())?.trim() ?? "";

    // const text = await this.itemName.textContent();
    // if (!text) return "";
    // return text.trim();
  }

  async getProductDescription(): Promise<string> {
    return (await this.itemDescription.textContent())?.trim() ?? "";
  }

  async getProductPrice(): Promise<string> {
    return (await this.itemPrice.textContent())?.trim() ?? "";
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async clickBackToProducts() {
    await this.backToProductsButton.click();
  }

  async verifyRemoveButtonVisible() {
    await expect(this.removeButton).toBeVisible();
  }

  async verifyAddToCartButtonVisible() {
    await expect(this.addToCartButton).toBeVisible();
  }

  async verifyProductInfo(
    expectedName: string,
    expectedDescription?: string,
    // ? optional parameter / optional property
    expectedPrice?: string,
  ) {
    await expect(this.itemName).toHaveText(expectedName);

    if (expectedDescription) {
      await expect(this.itemDescription).toHaveText(expectedDescription);
    }

    if (expectedPrice) {
      await expect(this.itemPrice).toHaveText(expectedPrice);
    }
  }
}
