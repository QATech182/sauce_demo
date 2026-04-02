import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class InventoryPage extends BasePage {
  readonly pageTitle: Locator;
  readonly inventoryList: Locator;
  readonly cartLink: Locator;
  readonly burgerMenu: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.locator("span.title");
    this.inventoryList = page.locator(".inventory_list");
    this.cartLink = page.locator("a.shopping_cart_link");
    this.burgerMenu = page.locator("button#react-burger-menu-btn");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async verifyInventoryPageLoaded() {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.pageTitle).toHaveText("Products");
    await this.verifyVisible(this.inventoryList);
  }

  getAddToCartButton(productName: string): Locator {
    // Method1 -> return this.page.locator(".inventory_item").filter({has: this.page.locator(".inventory_item_name", {hasText: productName,}),}).locator("button");

    // Method2
    // const allProducts = this.page.locator(".inventory_item");
    // const targetProduct = allProducts.filter({
    //   has: this.page.locator(".inventory_item_name", {
    //     hasText: productName,
    //   }),
    // });
    // return targetProduct.locator("button");

    const allProducts = this.page.locator(".inventory_item");

    const targetProduct = allProducts.filter({
      has: this.page.locator(".inventory_item_name", { hasText: productName }),
    });

    return targetProduct.locator("button");
  }

  getProductName(productName: string): Locator {
    return this.page.locator(".inventory_item_name", { hasText: productName });
  }

  async addProductToCart(productName: string) {
    await this.getAddToCartButton(productName).click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption({ label: option });
  }

  async verifyCartBadgeCount(count: string) {
    const badge = this.page.locator(".shopping_cart_badge");
    await expect(badge).toHaveText(count);
  }

  getProductLink(productName: string): Locator {
    return this.page.locator(".inventory_item_name", { hasText: productName });
  }

  async openProductDetails(productName: string) {
    await this.getProductLink(productName).click();
  }
}
