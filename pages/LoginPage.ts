import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginLogo: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.locator("[data-test='username']");
    this.passwordInput = page.locator("[data-test='password']");
    this.loginButton = page.locator("[data-test='login-button']");
    this.errorMessage = page.locator("[data-test='error']");
    this.loginLogo = page.locator(".login_logo");
  }

  async open() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async verifyLoginPageLoaded() {
    await this.verifyVisible(this.usernameInput);
    await this.verifyVisible(this.passwordInput);
    await this.verifyVisible(this.loginButton);
    await expect(this.loginLogo).toHaveText("Swag Labs");
  }

  async verifyErrorMessage(expectedText: string) {
    await this.verifyVisible(this.errorMessage);
    await expect(this.errorMessage).toContainText(expectedText);
  }
}
