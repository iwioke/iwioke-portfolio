import {expect, test} from "@playwright/test";

test("English page exposes the central LM Group case and archive lightbox", async ({page}) => {
  await page.goto("/en");

  await expect(page.getByRole("heading", {name: "Visual systems with a digital pulse."})).toBeVisible();
  await page.getByRole("link", {name: "View work"}).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole("heading", {name: "LM Group"})).toBeVisible();

  await page.getByRole("button", {name: "Open image: Chromatic poster study"}).click();
  await expect(page.getByRole("dialog", {name: "Chromatic poster study"})).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("language switch preserves content route", async ({page}) => {
  await page.goto("/en#contact");
  await page.getByRole("link", {name: "Switch language: RU"}).click();
  await expect(page).toHaveURL(/\/ru#contact$/);
  await expect(page.getByRole("heading", {name: "Есть настоящий проект на примете?"})).toBeVisible();
});

test("mobile menu has an operable work link", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile interaction only");
  await page.goto("/ru");
  await page.getByRole("button", {name: "Открыть меню"}).click();
  await expect(page.getByRole("link", {name: "01 Работы", exact: true})).toBeVisible();
  await page.getByRole("link", {name: "01 Работы", exact: true}).click();
  await expect(page).toHaveURL(/#work$/);
});
