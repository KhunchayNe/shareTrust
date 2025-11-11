import { test, expect } from '@playwright/test';
import ProfilePage from './page-objects/ProfilePage';

test.describe('Profile Page', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);

    // Mock authenticated state
    await page.addInitScript(() => {
      // Mock localStorage for authentication
      window.localStorage.setItem('supabase.auth.token', 'mock-token');
      window.localStorage.setItem('user-profile', JSON.stringify({
        id: 'mock-user-id',
        display_name: 'Test User',
        trust_score: 25,
        trust_level: 3,
        is_verified: true,
        created_at: '2024-01-01T00:00:00Z'
      }));
    });

    await profilePage.navigateToProfile();
  });

  test('should display user profile information correctly', async ({ page }) => {
    await profilePage.verifyProfileLoaded();

    // Check user information is displayed
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(profilePage.page.locator('[data-testid="trust-score"]')).toContainText('25');
    await expect(profilePage.page.locator('[data-testid="trust-level"]')).toContainText('3');
  });

  test('should be mobile-responsive', async ({ page }) => {
    await profilePage.verifyMobileResponsiveness();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify elements adapt to mobile
    const stats = page.locator('[data-testid="profile-stats"]');
    await expect(stats).toBeVisible();

    // Test horizontal scrolling is not needed
    const body = page.locator('body');
    await expect(body).toHaveCSS('overflow-x', 'hidden');
  });

  test('should navigate between tabs correctly', async ({ page }) => {
    await profilePage.verifyTabContent('overview');
    await profilePage.verifyTabContent('groups');
    await profilePage.verifyTabContent('transactions');
    await profilePage.verifyTabContent('settings');
  });

  test('should handle user interactions', async ({ page }) => {
    // Test logout
    page.on('dialog', dialog => dialog.accept());
    await profilePage.clickLogout();

    // Test edit profile navigation
    await profilePage.navigateToProfile();
    await profilePage.clickEditProfile();
    // Note: In real test, you'd check if navigate to /profile/edit
  });

  test('should display correct trust level badge', async ({ page }) => {
    const trustBadge = page.locator('[data-testid="trust-badge"]');
    await expect(trustBadge).toBeVisible();
    await expect(trustBadge).toContainText('Verified');
  });

  test('should handle LINE app environment', async ({ page }) => {
    // Simulate LINE app environment
    await page.addInitScript(() => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Line/9.18.0',
        writable: true
      });
    });

    await profilePage.navigateToProfile();
    await profilePage.verifyProfileLoaded();

    // Check LINE-specific optimizations
    const body = page.locator('body');
    await expect(body).toHaveClass(/bg-gradient-to-br/);
  });

  test('should be accessible', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(profilePage.page.locator('[data-testid="profile-tabs"] button').first()).toBeFocused();

    // Test ARIA labels
    await expect(profilePage.page.locator('[data-testid="edit-profile-button"]')).toHaveAttribute('aria-label');

    // Test semantic HTML
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/profile/**', route => {
      route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) });
    });

    await profilePage.navigateToProfile();

    // Should show error state or fallback
    await expect(page.locator('[data-testid="error-message"]')).not.toBeVisible();
    // Should still show basic profile info from cache
    await expect(page.locator('h1')).toContainText('โปรไฟลผู้ใช้');
  });

  test('should load data correctly', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/sharing-groups/**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          data: [
            {
              id: '1',
              title: 'Netflix Sharing',
              category: 'streaming',
              current_members: 2,
              max_members: 4
            }
          ]
        })
      });
    });

    await profilePage.navigateToProfile();
    await profilePage.clickTab('groups');

    await expect(page.locator('text=Netflix Sharing')).toBeVisible();
    await expect(page.locator('text=2/4 members')).toBeVisible();
  });

  test('should handle real-time updates', async ({ page }) => {
    await profilePage.navigateToProfile();

    // Mock real-time update
    await page.addInitScript(() => {
      setTimeout(() => {
        const event = new CustomEvent('trust-score-update', {
          detail: { newScore: 30, newLevel: 4 }
        });
        window.dispatchEvent(event);
      }, 1000);
    });

    // Check if UI updates
    await page.waitForTimeout(1200);
    await expect(profilePage.trustScore).toContainText('30');
  });
});

test.describe('Profile Page - Mobile Specific', () => {
  test('should work in LINE in-app browser', async ({ page }) => {
    // Mock LINE in-app browser
    await page.addInitScript(() => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 Mobile Line/9.18.0',
        writable: true
      });
    });

    await page.goto('/profile');
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone 12

    // Verify mobile optimizations
    await expect(page.locator('body')).toHaveCSS('font-size', '16px'); // Readable font size
    await expect(page.locator('[data-testid="profile-tabs"]')).toBeVisible();

    // Touch targets should be at least 44px
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should handle viewport changes', async ({ page }) => {
    await page.goto('/profile');

    // Test different viewport sizes
    const viewports = [
      { width: 375, height: 667 }, // iPhone SE
      { width: 375, height: 812 }, // iPhone 12
      { width: 414, height: 896 }, // iPhone 12 Pro Max
      { width: 768, height: 1024 }, // iPad
      { width: 1024, height: 768 }  // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await expect(page.locator('[data-testid="profile-stats"]')).toBeVisible();
      await expect(page.locator('[data-testid="trust-progress-bar"]')).toBeVisible();

      // Check no horizontal scroll
      const body = page.locator('body');
      await expect(body).toHaveCSS('overflow-x', 'hidden');
    }
  });
});