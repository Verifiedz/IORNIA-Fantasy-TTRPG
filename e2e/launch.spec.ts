import { test, expect, _electron as electron } from "@playwright/test";

// Runs against the built app (npm run build), per CLAUDE.md. Needs a real
// or virtual (e.g. Xvfb) display: the launch sequence's GSAP timeline
// depends on requestAnimationFrame, which Electron's own --headless mode
// never fires, so this cannot run under --ozone-platform=headless.
test("opens the Rules Codex and finds a sample page", async () => {
  const app = await electron.launch({ args: ["."] });
  const window = await app.firstWindow();

  await expect(window.getByRole("heading", { name: "Rules Codex" })).toBeVisible({
    timeout: 10_000,
  });
  await expect(
    window.getByRole("button", { name: "Example Codex Page" }),
  ).toBeVisible();

  await app.close();
});

test("search finds a maneuver and opens the combat reference", async () => {
  const app = await electron.launch({ args: ["."] });
  const window = await app.firstWindow();

  await window.getByRole("heading", { name: "Rules Codex" }).waitFor({ timeout: 10_000 });
  await window.getByPlaceholder("Search the Codex…").fill("Attack");
  await window
    .getByRole("button", { name: /Maneuver list \(placeholder sample data\)/ })
    .click();

  await expect(
    window.getByRole("heading", { name: "Combat Reference" }),
  ).toBeVisible();

  await app.close();
});
