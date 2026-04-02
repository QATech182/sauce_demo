import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;

  // buttons
  readonly continueButton: Locator;
  readonly finishButton: Locator;

  // error message
  readonly errorMessage: Locator;

  // checkout-complete page
  readonly completeHeader: Locator;
  readonly completeText: Locator;

  // checkout overview page
  readonly cartItemPrices: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');

    // checkout overview selectors
    this.cartItemPrices = page.locator(".inventory_item_price");
    this.itemTotalLabel = page.locator(".summary_subtotal_label");
    this.taxLabel = page.locator(".summary_tax_label");
    this.totalLabel = page.locator(".summary_total_label");
  }

  async fillCheckoutInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async verifyOverviewPageLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  async verifyOrderSuccess() {
    await expect(this.completeHeader).toHaveText("Thank you for your order!");
    await expect(this.completeText).toBeVisible();
  }

  async verifyErrorMessage(text: string) {
    await expect(this.errorMessage).toContainText(text);
  }

  // checkout overview calcualtion
  private parsePrice(priceText: string): number {
    // parsePrice("$29.99") → 29.99
    return Number(priceText.replace("$", "").trim());
  }

  private parseLabelAmount(labelText: string): number {
    /*
        labelText = "Item total: $32.39"
        labelText.split("$")
        [
            "Item total: ", // index [0]
            "32.39" // index [1]
        ]
    */

    // const amount = labelText.split("$")[1];
    // return Number(amount.trim());

    // Safer Version
    const parts = labelText.split("$");
    const amount = parts.length > 1 ? parts[1] : "0";
    return Number(amount.trim());
  }

  // Get all item prices from UI and return them as numbers
  async getDisplayedItemPrices(): Promise<number[]> {
    // All price elements on the page + .allTextContents -> Gets text from ALL matched elements
    // Get all price texts from the page as an array
    /* 
    
    if UI shows -> $29.99 $9.99 $15.00
    Then, priceTexts = ["$29.99", "$9.99", "$15.00"];

    */
    const priceTexts = await this.cartItemPrices.allTextContents();

    // Convert each price string into a number
    // parsePrice("$29.99") → 29.99
    return priceTexts.map((price) => this.parsePrice(price));
  }

  // Calculate total price from all items (our own calculation)
  async getExpectedItemTotal(): Promise<number> {
    // [29.99, 9.99, 15.00]
    const prices = await this.getDisplayedItemPrices();
    // It adds all numbers together starting from a total 0
    /* sum + total
        0 + 29.99 = 29.99  
        29.99 + 9.99 = 39.98  
        39.98 + 15.00 = 54.98  
    */
    return prices.reduce((sum, price) => sum + price, 0);
  }

  async getDisplayedItemTotal(): Promise<number> {
    const text = await this.itemTotalLabel.textContent();

    /* text ?? "" -> This is null safety. If text is null → use empty string
        
    A ?? B

    Means:
    If A is NOT null/undefined → use A
    If A IS null/undefined → use B
    */
    return this.parseLabelAmount(text ?? "");
  }

  async getDisplayedTax(): Promise<number> {
    const text = await this.taxLabel.textContent();
    return this.parseLabelAmount(text ?? "");
  }

  async getDisplayedFinalTotal(): Promise<number> {
    const text = await this.totalLabel.textContent();
    return this.parseLabelAmount(text ?? "");
  }

  async verifyItemTotalCalculation() {
    /*
        Calculate total manually
        Get total from UI
        Compare both
    */
    const expectedItemTotal = await this.getExpectedItemTotal();
    const displayedItemTotal = await this.getDisplayedItemTotal();

    expect(displayedItemTotal).toBe(expectedItemTotal);
  }

  async verifyFinalTotalCalculation() {
    /*
        Get values
        Add them
        .toFixed(2) => Fix decimal precision => 59.3 -> "59.30"
    */

    const displayedItemTotal = await this.getDisplayedItemTotal();
    const displayedTax = await this.getDisplayedTax();
    const displayedFinalTotal = await this.getDisplayedFinalTotal();

    console.log(`Total Payment Amount is $${displayedFinalTotal}`);

    expect(displayedFinalTotal).toBe(
      // .toBe() = exactly equal
      Number((displayedItemTotal + displayedTax).toFixed(2)),
    );

    // Instead of toBe, sometimes safer:
    // expect(displayedFinalTotal).toBeCloseTo(expected, 2);
    // Meaning -> “Check if the actual value is almost equal to expected value (up to 2 decimal places)
    // const expected = displayedItemTotal + displayedTax;
    // expect(displayedFinalTotal).toBeCloseTo(expected, 2);
  }

  // Final combined verification
  async verifyPriceSummaryCalculation() {
    await this.verifyItemTotalCalculation();
    await this.verifyFinalTotalCalculation();
  }
}
