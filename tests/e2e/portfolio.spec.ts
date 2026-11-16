import {expect, test} from "@playwright/test";

test("hero, navigation and contact links", async ({page}, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", {level: 1, name: "iwioke"})).toBeVisible();
  await expect(page.getByRole("link", {name: "Message me"})).toHaveAttribute("href", "https://t.me/iwiokedamn");
  if (testInfo.project.name === "chromium") {
    await page.getByRole("link", {name: "Pricing", exact: true}).click();
    await expect(page).toHaveURL(/#prices$/);
    await expect(page.locator("#prices h2")).toBeInViewport();
  }
  await page.getByRole("link", {name: "View work"}).click();
  await expect(page).toHaveURL(/#works$/);
  const contact = page.locator("#contact");
  await expect(contact.getByRole("link", {name: "Email ↗"})).toHaveAttribute("href", "mailto:iwiokework@gmail.com");
  await expect(contact.getByRole("link", {name: "GitHub ↗"})).toHaveAttribute("href", "https://github.com/iwioke");
});

test("folders open projects and the lightbox", async ({page}) => {
  await page.goto("/");
  await page.locator('a.folder[href="#folder-identity"]').click();
  await expect(page.locator(".fv-title")).toHaveText("Brand identity");
  await page.locator('a.folder[href="#folder-lm-group"]').click();
  await expect(page.locator(".fv-title")).toHaveText("LM Group");

  await page.getByRole("button", {name: "Open: Billboard"}).click();
  const dialog = page.getByRole("dialog", {name: "Billboard"});
  await expect(dialog).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("dialog", {name: "Logo"})).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.getByRole("link", {name: "← Brand identity"}).click();
  await page.getByRole("link", {name: "← All sections"}).click();
  await expect(page.locator(".folders > .folder")).toHaveCount(3);
});

test("page is English-only and error-free", async ({page}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto("/");
  await page.waitForTimeout(1500);
  for (const k of ["identity", "lm-group", "websites", "lm-europe", "lm-kazakhstan", "posters"]) {
    await page.evaluate((key) => { location.hash = `#folder-${key}`; }, k);
    await expect(page.locator(".folder-view")).toBeVisible();
    expect(await page.locator("body").innerText()).not.toMatch(/[\u0400-\u04FF]/);
  }
  expect(await page.content()).not.toMatch(/[\u0400-\u04FF]/);
  expect(errors).toEqual([]);
});

test("mobile header keeps only the message pill", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile layout only");
  await page.goto("/");
  await expect(page.getByRole("link", {name: "Message me"})).toBeVisible();
  await expect(page.getByRole("link", {name: "Pricing", exact: true})).toBeHidden();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
