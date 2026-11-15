import { test, expect, _electron as electron } from "@playwright/test";

// Runs against the built app (npm run build), per CLAUDE.md. Needs a real
// or virtual (e.g. Xvfb) display: the launch sequence's GSAP timeline
// depends on requestAnimationFrame, which Electron's own --headless mode
// never fires, so this cannot run under --ozone-platform=headless.
test("opens the sample campaign and shows live content", async () => {
  const app = await electron.launch({ args: ["."] });
  const window = await app.firstWindow();

  await expect(window.getByRole("heading", { name: "The Ashen Trial" })).toBeVisible({
    timeout: 10_000,
  });
  await expect(
    window.getByRole("heading", { name: "The Founding of Iornia" }),
  ).toBeVisible();

  await app.close();
});
