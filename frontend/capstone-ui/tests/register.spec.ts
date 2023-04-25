import { faker } from '@faker-js/faker';
import { test } from "@playwright/test";
import { printCodeCoverage } from '../test-helpers/test-helpers';

const mockFirstName = faker.name.firstName();

const mockLastName = faker.name.lastName();

const mockEmail = `${mockFirstName}.${mockLastName}@gmail.com`;

const mockPassword = faker.random.alpha({
   casing: "mixed",
   count: 10,
}) + faker.random.numeric(5) + "$";

test('user can register', async ({ page }) => {
   await page.coverage.startJSCoverage();

   await page.goto('http://localhost:3000/');

   await page.getByRole('button', { name: 'Log on button' }).click();

   await page.getByRole('link', { name: 'Create one here!' }).click();

   await page.getByRole('textbox', { name: 'First Name Input Field' }).click();

   await page.getByRole('textbox', { name: 'First Name Input Field' }).fill(mockFirstName);

   await page.getByRole('textbox', { name: 'First Name Input Field' }).press('Tab');

   await page.getByRole('textbox', { name: 'Last Name Input Field' }).fill(mockLastName);

   await page.getByRole('textbox', { name: 'Last Name Input Field' }).press('Tab');

   await page.getByRole('textbox', { name: 'Email Input Field' }).fill(mockEmail);

   await page.getByRole('textbox', { name: 'Email Input Field' }).press('Tab');

   await page.getByRole('textbox', { name: 'Password Input Field', exact: true }).fill(mockPassword);

   await page.getByRole('textbox', { name: 'Password Input Field', exact: true }).press('Tab');

   await page.getByRole('textbox', { name: 'Confirm Password Input Field' }).fill(mockPassword);

   await page.getByRole('button', { name: 'Register Button' }).click();

   await page.getByRole('textbox', { name: 'Email Input Field' }).click();

   await page.getByRole('textbox', { name: 'Email Input Field' }).fill(mockEmail);

   await page.getByRole('textbox', { name: 'Email Input Field' }).press('Tab');

   await page.getByRole('textbox', { name: 'Password Input Field' }).fill(mockPassword);

   await page.getByRole('button', { name: 'Login Button' }).click();

   await page.getByText(`Welcome, ${mockFirstName} ${mockLastName}`).click();

   const coverage = await page.coverage.stopJSCoverage();

   printCodeCoverage(coverage);
});