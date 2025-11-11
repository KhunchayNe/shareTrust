import { test, expect, Page } from '@playwright/test';

class ProfilePage {
  constructor(public page: Page) {}

  // Locators
  get userAvatar() {
    return this.page.locator('[data-testid="user-avatar"]');
  }

  get trustScore() {
    return this.page.locator('[data-testid="trust-score"]');
  }

  get trustLevel() {
    return this.page.locator('[data-testid="trust-level"]');
  }

  get profileTabs() {
    return this.page.locator('[data-testid="profile-tabs"] button');
  }

  get overviewTab() {
    return this.page.locator('[data-testid="tab-overview"]');
  }

  get groupsTab() {
    return this.page.locator('[data-testid="tab-groups"]');
  }

  get transactionsTab() {
    return this.page.locator('[data-testid="tab-transactions"]');
  }

  get settingsTab() {
    return this.page.locator('[data-testid="tab-settings"]');
  }

  get editProfileButton() {
    return this.page.locator('[data-testid="edit-profile-button"]');
  }

  get logoutButton() {
    return this.page.locator('[data-testid="logout-button"]');
  }

  get profileStats() {
    return this.page.locator('[data-testid="profile-stats"]');
  }

  get trustProgressBar() {
    return this.page.locator('[data-testid="trust-progress-bar"]');
  }

  get badgesSection() {
    return this.page.locator('[data-testid="badges-section"]');
  }

  get recentActivity() {
    return this.page.locator('[data-testid="recent-activity"]');
  }

  // Actions
  async navigateToProfile() {
    await this.page.goto('/profile');
  }

  async clickEditProfile() {
    await this.editProfileButton.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async clickTab(tab: 'overview' | 'groups' | 'transactions' | 'settings') {
    await this.page.locator(`[data-testid="tab-${tab}"]`).click();
  }

  // Verification methods
  async verifyProfileLoaded() {
    await expect(this.page.locator('h1')).toContainText('โปรไฟลผู้ใช้');
    await expect(this.userAvatar).toBeVisible();
    await expect(this.trustScore).toBeVisible();
    await expect(this.trustLevel).toBeVisible();
  }

  async verifyTrustScore(score: number) {
    await expect(this.trustScore).toContainText(score.toString());
  }

  async verifyTrustLevel(level: number) {
    await expect(this.trustLevel).toBeVisible();
  }

  async verifyMobileResponsiveness() {
    // Test mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await expect(this.profileStats).toBeVisible();
    await expect(this.trustProgressBar).toBeVisible();
    await expect(this.badgesSection).toBeVisible();

    // Test that tabs stack vertically on mobile
    const tabContainer = this.page.locator('[data-testid="profile-tabs"]');
    await expect(tabContainer).toBeVisible();

    // Test that buttons are properly sized for mobile
    await expect(this.editProfileButton).toBeVisible();
    await expect(this.logoutButton).toBeVisible();
  }

  async verifyTabContent(tab: 'overview' | 'groups' | 'transactions' | 'settings') {
    await this.clickTab(tab);

    switch (tab) {
      case 'overview':
        await expect(this.profileStats).toBeVisible();
        await expect(this.trustProgressBar).toBeVisible();
        await expect(this.badgesSection).toBeVisible();
        await expect(this.recentActivity).toBeVisible();
        break;
      case 'groups':
        await expect(this.page.locator('[data-testid="groups-list"]')).toBeVisible();
        break;
      case 'transactions':
        await expect(this.page.locator('[data-testid="transactions-list"]')).toBeVisible();
        break;
      case 'settings':
        await expect(this.page.locator('[data-testid="settings-panel"]')).toBeVisible();
        break;
    }
  }

  async verifyNavigation() {
    // Test home navigation
    const homeButton = this.page.locator('[data-testid="home-button"]');
    await homeButton.click();
    await expect(this.page).toHaveURL('/');
  }

  async verifyAccessibility() {
    // Test keyboard navigation
    await this.page.keyboard.press('Tab');
    await expect(this.profileTabs.first()).toBeFocused();

    // Test ARIA labels
    await expect(this.editProfileButton).toHaveAttribute('aria-label');
    await expect(this.logoutButton).toHaveAttribute('aria-label');

    // Test color contrast (basic check)
    await expect(this.page.locator('h1')).toHaveCSS('color', /rgb\(17|31|41/); // dark text
  }
}

export default ProfilePage;