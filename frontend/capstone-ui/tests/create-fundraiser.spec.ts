import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';
import { formatCurrencyToString } from '../src/globals/helpers';
import { getMockUserCreds, printCodeCoverage } from '../test-helpers/test-helpers';

const mockFundraiserTitle = faker.random.words();
const mockFundraiserDescription = faker.random.words();
const mockFundraiserCategory = faker.random.numeric().toString();
const mockFundraiserEndDate = '2024-04-30';
const mockFundraiserGoal = '123456';

const [username, password] = getMockUserCreds();

test("creating a fundraiser", async ({ page }) => {
   await page.coverage.startJSCoverage();

   await page.goto('http://localhost:3000/login');

   await page.getByRole('textbox', { name: 'Email Input Field' }).click();

   await page.getByRole('textbox', { name: 'Email Input Field' }).fill(username);

   await page.getByRole('textbox', { name: 'Email Input Field' }).press('Tab');

   await page.getByRole('textbox', { name: 'Password Input Field' }).fill(password);

   await page.getByRole('button', { name: 'Login Button' }).click();

   await page.getByRole('button', { name: 'Create fundraiser button' }).click();

   await page.getByRole('textbox', { name: 'Fundraiser name input' }).click();

   await page.getByRole('textbox', { name: 'Fundraiser name input' }).fill(mockFundraiserTitle);

   await page.getByRole('spinbutton').click();

   await page.getByRole('spinbutton').fill(mockFundraiserGoal);

   await page.locator('input[name="endDate"]').fill(mockFundraiserEndDate);

   await page.getByRole('combobox').selectOption(mockFundraiserCategory);

   await page.getByRole('textbox', { name: 'Description of fundraiser input' }).click();

   await page.getByRole('textbox', { name: 'Description of fundraiser input' }).fill(mockFundraiserDescription);

   await page.getByRole('button', { name: 'Create fundraiser button' }).click();

   expect(await page.getByText(mockFundraiserTitle)).toBeTruthy();

   expect(await page.getByText(mockFundraiserDescription)).toBeTruthy();

   expect(await page.getByText(`Ends ${mockFundraiserEndDate}`)).toBeTruthy();

   expect(await page.getByText(`/ ${formatCurrencyToString(parseFloat(mockFundraiserGoal))}`)).toBeTruthy();

   const coverage = await page.coverage.stopJSCoverage();

   printCodeCoverage(coverage);
});