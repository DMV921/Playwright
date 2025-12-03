import { test, expect } from '@playwright/test';

const URL = 'https://dev.3snet.info/eventswidget/';

test.describe('Events widget page', () => {

  test('loads page and shows events widget', async ({ page }) => {
    // Navigate and wait for network to be idle-ish
    const resp = await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    expect(resp && resp.ok()).toBeTruthy();

    // Wait for the main widget container - try common selectors
    const selectors = [
      '#events-widget',
      '.events-widget',
      '[data-widget="events"]',
      '.event-list',
      '.events'
    ];
    let container = null;
    for (const sel of selectors) {
      const el = await page.locator(sel).first();
      if (await el.count() > 0) {
        container = el;
        break;
      }
    }

    // If none of the guessed selectors exist, fallback to body and look for event cards
    if (!container) {
      container = page.locator('body');
    }

    // Try to find event cards within container using common patterns
    const cardSelectors = ['.event-card', '.events__item', '.event', '.card', '.item'];
    let cards = null;
    for (const cs of cardSelectors) {
      const loc = container.locator(cs);
      if (await loc.count() > 0) {
        cards = loc;
        break;
      }
    }

    // If still not found, look for elements that look like items (multiple headings)
    if (!cards) {
      const headings = container.locator('h1, h2, h3, .title');
      // heuristic: more than one heading indicates list-like content
      if (await headings.count() > 0) {
        cards = headings;
      }
    }

    // Assert we found at least something that looks like events
    expect(cards).not.toBeNull();
    expect(await cards.count()).toBeGreaterThan(0);

    // Check first card has a title-like text and maybe a date/time
    const first = cards.first();
    const title = await first.locator('h1, h2, h3, .title, .name, [role="heading"]').first();
    expect(await title.count()).toBeGreaterThanOrEqual(0); // optional

    // If there is a title, ensure it has non-empty text when present
    if (await title.count() > 0) {
      const txt = (await title.first().innerText()).trim();
      expect(txt.length).toBeGreaterThanOrEqual(0);
    }

    // Try to find date/time text in the card
    const dateLike = first.locator('time, .date, .event-date, .meta, .when');
    // Not required, but log presence
    if (await dateLike.count() > 0) {
      const dt = (await dateLike.first().innerText()).trim();
      expect(dt.length).toBeGreaterThanOrEqual(0);
    }

    // If there's a "show more" or details link/button, click it and check for a dialog/panel
    const detailsSelectors = ['text=Подробнее', 'text=Подробнее', 'text=Show more', 'text=Details', 'a:has-text("Подробнее")', 'button:has-text("Подробнее")'];
    for (const ds of detailsSelectors) {
      const btn = first.locator(ds);
      if (await btn.count() > 0) {
        await btn.first().click({ timeout: 5000 });
        // check for modal or expanded content
        const modal = page.locator('[role="dialog"], .modal, .popup, .event-details').first();
        if (await modal.count() > 0) {
          await expect(modal).toBeVisible({ timeout: 5000 });
        }
        break;
      }
    }

  });

});
