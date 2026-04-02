import { Locator, Page, expect } from "@playwright/test";

export class FooterComponent {
  readonly page: Page;
  readonly footerContainer: Locator;
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedinLink: Locator;
  readonly footerText: Locator;

  constructor(page: Page) {
    this.page = page;

    this.footerContainer = page.locator(".footer");
    this.twitterLink = page.locator('[data-test="social-twitter"]');
    this.facebookLink = page.locator('[data-test="social-facebook"]');
    this.linkedinLink = page.locator('[data-test="social-linkedin"]');
    this.footerText = page.locator('[data-test="footer-copy"]');
  }

  async verifyFooterVisible() {
    await expect(this.footerContainer).toBeVisible();
  }

  async verifySocialLinksVisible() {
    await expect(this.twitterLink).toBeVisible();
    await expect(this.facebookLink).toBeVisible();
    await expect(this.linkedinLink).toBeVisible();
  }

  async verifyFooterTextContains(expectedText: string) {
    await expect(this.footerText).toContainText(expectedText);
  }

  async verifyTwitterLinkUrl() {
    // Check that the Twitter link points to a URL containing twitter.com
    // .toHaveAttribute("href", ...)
    // “Does this element have an attribute called href with expected value?”
    // /twitter\.com/ (IMPORTANT)
    // This is a RegExp (pattern)
    // \. => means "any character" so we escape it
    await expect(this.twitterLink).toHaveAttribute("href", /twitter\.com/);
  }

  async verifyFacebookLinkUrl() {
    await expect(this.facebookLink).toHaveAttribute("href", /facebook\.com/);
  }

  async verifyLinkedinLinkUrl() {
    await expect(this.linkedinLink).toHaveAttribute("href", /linkedin\.com/);
  }

  async verifyAllFooterLinks() {
    await this.verifyTwitterLinkUrl();
    await this.verifyFacebookLinkUrl();
    await this.verifyLinkedinLinkUrl();
  }
}
