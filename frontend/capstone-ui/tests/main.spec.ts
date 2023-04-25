import { expect, test } from '@playwright/test';
import { printCodeCoverage } from '../test-helpers/test-helpers';

test('dashboard, privacy policy, accessibility statement, and terms and conditions load', async ({ page }) => {
  await page.coverage.startJSCoverage();

  await page.goto('http://localhost:3000/');

  await page.getByRole('link', { name: 'Privacy Policy' }).click();

  expect(await page.getByText('Privacy Policy')).toBeTruthy();

  await page.getByRole('link', { name: 'Accessibility Statement' }).click();

  expect(await page.getByText('Accessibility Statement')).toBeTruthy();

  await page.getByRole('link', { name: 'Terms of Use' }).click();

  expect(await page.getByText('Terms and Conditions', { exact: true })).toBeTruthy();

  await page.getByText('R O M E').click();

  expect(await page.getByText('Dashboard')).toBeTruthy();

  const coverage = await page.coverage.stopJSCoverage();

  printCodeCoverage(coverage);
});