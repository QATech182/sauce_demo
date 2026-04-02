// BasePage = shared page behavior
import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async visit(path: string = "") {
    await this.page.goto(path);
  }

  async click(locator: Locator) {
    await locator.click();
  }

  async fill(locator: Locator, value: string) {
    await locator.fill(value);
  }

  async type(locator: Locator, value: string) {
    await locator.pressSequentially(value);
  }

  async getText(locator: Locator) {
    return await locator.textContent();
  }

  async verifyVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async verifyHidden(locator: Locator) {
    await expect(locator).toBeHidden();
  }

  async verifyText(locator: Locator, expectedText: string) {
    await expect(locator).toHaveText(expectedText);
  }

  async verifyContainsText(locator: Locator, text: string) {
    await expect(locator).toContainText(text);
  }

  async verifyURLContains(text: string) {
    await expect(this.page).toHaveURL(new RegExp(text));

    // await expect(this.page).toHaveURL(text);
  }
}
