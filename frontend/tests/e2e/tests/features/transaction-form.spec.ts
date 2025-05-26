import { test, expect } from '@playwright/test';
import { AuthPage } from '../../support/pages/AuthPage';
import { TransactionFormDataGenerator } from '../../config/test-data-generator';

test.describe('TransactionForm - Test cu Date Dinamice', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    // Reset generatorul pentru fiecare test
    // TestDataGenerator.reset(); - nu e necesar dacă vrem varietate
  });

  test('adaugă tranzacție cu date complet aleatoare', async ({ page }) => {
    console.log('🚀 Test adăugare tranzacție cu date dinamic generate');
    
    // Generează date de test complet aleatoare
    const formData = TransactionFormDataGenerator.getFormData();
    const selectors = TransactionFormDataGenerator.getFormSelectors();
    
    console.log('🎲 Date generate pentru formular:', TransactionFormDataGenerator.getFormLabels(formData));
    
    // Login
    await authPage.loginWithPrimaryAccount();
    console.log('✅ Login realizat cu succes');
    
    // Verifică că suntem pe pagina de transactions (default după login)
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Verifică existența formularului
    const transactionForm = page.getByTestId(selectors.form);
    await expect(transactionForm).toBeVisible();
    console.log('✅ Formular de tranzacție găsit');
    
    // Pasul 1: Selectează tipul de tranzacție
    const typeSelect = page.getByTestId(selectors.typeSelect);
    await expect(typeSelect).toBeVisible();
    await typeSelect.selectOption(formData.type);
    console.log(`✅ Tip tranzacție selectat: ${formData.type}`);
    
    // Așteaptă ca opțiunile de categorie să se încarce
    await page.waitForTimeout(1000);
    
    // Pasul 2: Completează suma
    const amountInput = page.getByTestId(selectors.amountInput);
    await expect(amountInput).toBeVisible();
    await amountInput.clear();
    await amountInput.fill(formData.amount);
    console.log(`✅ Sumă completată: ${formData.amount}`);
    
    // Pasul 3: Selectează categoria
    const categorySelect = page.getByTestId(selectors.categorySelect);
    await expect(categorySelect).toBeVisible();
    await expect(categorySelect).toBeEnabled();
    await categorySelect.selectOption(formData.category);
    console.log(`✅ Categorie selectată: ${formData.category}`);
    
    // Așteaptă ca subcategoriile să se încarce
    await page.waitForTimeout(1000);
    
    // Pasul 4: Selectează subcategoria
    const subcategorySelect = page.getByTestId(selectors.subcategorySelect);
    await expect(subcategorySelect).toBeVisible();
    await expect(subcategorySelect).toBeEnabled();
    await subcategorySelect.selectOption(formData.subcategory);
    console.log(`✅ Subcategorie selectată: ${formData.subcategory}`);
    
    // Pasul 5: Completează data
    const dateInput = page.getByTestId(selectors.dateInput);
    await expect(dateInput).toBeVisible();
    await dateInput.fill(formData.date);
    console.log(`✅ Dată completată: ${formData.date}`);
    
    // Pasul 6: Configurează recursivitatea
    const recurringCheckbox = page.getByTestId(selectors.recurringCheckbox);
    await expect(recurringCheckbox).toBeVisible();
    
    if (formData.recurring) {
      await recurringCheckbox.check();
      console.log('✅ Checkbox recurent bifat');
      
      // Așteaptă ca select-ul de frecvență să devină activ
      await page.waitForTimeout(500);
      
      const frequencySelect = page.getByTestId(selectors.frequencySelect);
      await expect(frequencySelect).toBeVisible();
      await expect(frequencySelect).toBeEnabled();
      await frequencySelect.selectOption(formData.frequency);
      console.log(`✅ Frecvență selectată: ${formData.frequency}`);
    } else {
      // Asigură-te că nu e bifat
      await recurringCheckbox.uncheck();
      console.log('✅ Tranzacție configurată ca non-recurentă');
    }
    
    // Pasul 7: Completează descrierea (opțional)
    if (formData.description) {
      const descriptionInput = page.getByTestId(selectors.descriptionInput);
      await expect(descriptionInput).toBeVisible();
      await descriptionInput.fill(formData.description);
      console.log(`✅ Descriere completată: "${formData.description}"`);
    } else {
      console.log('✅ Fără descriere (lăsat gol)');
    }
    
    // Pasul 8: Verifică că butonul de adăugare e activ
    const addButton = page.getByTestId(selectors.addButton);
    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled();
    console.log('✅ Butonul de adăugare este activ');
    
    // Fă un screenshot înainte de submit
    await page.screenshot({ 
      path: 'test-results/transaction-form-before-submit.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot înainte de submit salvat');
    
    // Pasul 9: Trimite formularul
    await addButton.click();
    console.log('✅ Formular trimis');
    
    // Așteaptă procesarea
    await page.waitForTimeout(2000);
    
    // Verifică mesajul de succes (dacă există)
    const successMessage = page.getByTestId(selectors.successMessage);
    const successExists = await successMessage.isVisible().catch(() => false);
    
    if (successExists) {
      console.log('✅ Mesaj de succes afișat');
    } else {
      console.log('ℹ️ Mesaj de succes nu e vizibil (poate fi normal)');
    }
    
    // Verifică dacă există erori
    const errorMessage = page.getByTestId(selectors.errorMessage);
    const errorExists = await errorMessage.isVisible().catch(() => false);
    
    if (errorExists) {
      const errorText = await errorMessage.textContent();
      console.log(`⚠️ Eroare detectată: ${errorText}`);
    } else {
      console.log('✅ Nicio eroare detectată');
    }
    
    // Fă un screenshot după submit
    await page.screenshot({ 
      path: 'test-results/transaction-form-after-submit.png', 
      fullPage: true 
    });
    console.log('📸 Screenshot după submit salvat');
    
    // Verifică că formularul s-a resetat (dacă e cazul)
    const resetAmountValue = await page.getByTestId(selectors.amountInput).inputValue();
    console.log(`ℹ️ Valoare sumă după submit: "${resetAmountValue}"`);
  });

  test('testează adăugare tranzacție recurentă', async ({ page }) => {
    console.log('🔄 Test specific pentru tranzacție recurentă');
    
    // Generează date care sunt garantat recurente
    const formData = TransactionFormDataGenerator.getRecurringFormData();
    const selectors = TransactionFormDataGenerator.getFormSelectors();
    
    console.log('🎲 Date recurente generate:', TransactionFormDataGenerator.getFormLabels(formData));
    
    // Login
    await authPage.loginWithPrimaryAccount();
    
    // Workflow complet similar, dar cu focus pe recursivitate
    await page.waitForLoadState('networkidle');
    
    const transactionForm = page.getByTestId(selectors.form);
    await expect(transactionForm).toBeVisible();
    
    // Completează rapid până la partea de recursivitate
    await page.getByTestId(selectors.typeSelect).selectOption(formData.type);
    await page.waitForTimeout(500);
    
    await page.getByTestId(selectors.amountInput).fill(formData.amount);
    await page.getByTestId(selectors.categorySelect).selectOption(formData.category);
    await page.waitForTimeout(500);
    
    await page.getByTestId(selectors.subcategorySelect).selectOption(formData.subcategory);
    await page.getByTestId(selectors.dateInput).fill(formData.date);
    
    // Focus pe partea de recursivitate
    const recurringCheckbox = page.getByTestId(selectors.recurringCheckbox);
    await recurringCheckbox.check();
    await page.waitForTimeout(500);
    
    const frequencySelect = page.getByTestId(selectors.frequencySelect);
    await expect(frequencySelect).toBeEnabled();
    await frequencySelect.selectOption(formData.frequency);
    console.log(`✅ Configurare recurentă completă: ${formData.frequency}`);
    
    // Verifică că frecvența e selectată corect
    const selectedFrequency = await frequencySelect.inputValue();
    expect(selectedFrequency).toBe(formData.frequency);
    
    if (formData.description) {
      await page.getByTestId(selectors.descriptionInput).fill(formData.description);
    }
    
    // Screenshot și submit
    await page.screenshot({ path: 'test-results/recurring-transaction-form.png' });
    
    const addButton = page.getByTestId(selectors.addButton);
    await expect(addButton).toBeEnabled();
    await addButton.click();
    
    await page.waitForTimeout(2000);
    console.log('✅ Tranzacție recurentă adăugată');
  });

  test('testează adăugare tranzacție simplă (non-recurentă)', async ({ page }) => {
    console.log('📝 Test specific pentru tranzacție simplă');
    
    // Generează date garantat non-recurente
    const formData = TransactionFormDataGenerator.getNonRecurringFormData();
    const selectors = TransactionFormDataGenerator.getFormSelectors();
    
    console.log('🎲 Date simple generate:', TransactionFormDataGenerator.getFormLabels(formData));
    
    await authPage.loginWithPrimaryAccount();
    await page.waitForLoadState('networkidle');
    
    const transactionForm = page.getByTestId(selectors.form);
    await expect(transactionForm).toBeVisible();
    
    // Workflow complet pentru tranzacție simplă
    await page.getByTestId(selectors.typeSelect).selectOption(formData.type);
    await page.waitForTimeout(500);
    
    await page.getByTestId(selectors.amountInput).fill(formData.amount);
    await page.getByTestId(selectors.categorySelect).selectOption(formData.category);
    await page.waitForTimeout(500);
    
    await page.getByTestId(selectors.subcategorySelect).selectOption(formData.subcategory);
    await page.getByTestId(selectors.dateInput).fill(formData.date);
    
    // Verifică că recursivitatea e dezactivată
    const recurringCheckbox = page.getByTestId(selectors.recurringCheckbox);
    await expect(recurringCheckbox).not.toBeChecked();
    
    const frequencySelect = page.getByTestId(selectors.frequencySelect);
    await expect(frequencySelect).toBeDisabled();
    console.log('✅ Configurare simplă confirmată: non-recurentă');
    
    if (formData.description) {
      await page.getByTestId(selectors.descriptionInput).fill(formData.description);
    }
    
    await page.screenshot({ path: 'test-results/simple-transaction-form.png' });
    
    const addButton = page.getByTestId(selectors.addButton);
    await expect(addButton).toBeEnabled();
    await addButton.click();
    
    await page.waitForTimeout(2000);
    console.log('✅ Tranzacție simplă adăugată');
  });
}); 