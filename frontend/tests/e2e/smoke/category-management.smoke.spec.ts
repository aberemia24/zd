import { test, expect } from '@playwright/test';
import { CategoryEditorPage } from '../support/pages/CategoryEditorPage';
import { AuthPage } from '../support/pages/AuthPage';

/**
 * 🟢 SMOKE TESTS - CATEGORY MANAGEMENT
 * 
 * Testează workflow-urile critice pentru gestionarea categoriilor:
 * - Navigare la Options Page și CategoryEditor
 * - Vizualizare categorii existente
 * - Accesibilitate și UI basics
 * - Verificare funcționalitate de bază
 */

test.describe('🟢 Category Management Smoke Tests', { tag: '@smoke' }, () => {
  let categoryEditorPage: CategoryEditorPage;
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    categoryEditorPage = new CategoryEditorPage(page);
    authPage = new AuthPage(page);

    // Autentificare cu fix-ul pentru logica corectă
    const loginResult = await authPage.loginWithPrimaryAccount();
    expect(loginResult.success).toBe(true);
  });

  test('utilizatorul poate accesa CategoryEditor din Options', async () => {
    // Deschide CategoryEditor din Options page
    await categoryEditorPage.openFromOptionsPage();

    // Verifică că modal-ul CategoryEditor s-a deschis
    await expect(categoryEditorPage.modal).toBeVisible();
    await expect(categoryEditorPage.categoriesSection).toBeVisible();
  });

  test('utilizatorul poate selecta o categorie și vizualiza subcategoriile', async () => {
    // Deschide CategoryEditor
    await categoryEditorPage.openFromOptionsPage();

    // Selectează categoria 'FOOD' 
    await categoryEditorPage.selectCategory('FOOD');

    // Verifică că subcategoriile sunt afișate
    await expect(categoryEditorPage.subcategoriesSection).toBeVisible();
    await expect(categoryEditorPage.subcategoriesWrapper).toBeVisible();

    // Verifică că există cel puțin o subcategorie
    const subcategoryCount = await categoryEditorPage.getSubcategoryCount();
    expect(subcategoryCount).toBeGreaterThan(0);
  });

  test('utilizatorul poate adăuga o subcategorie nouă', async () => {
    // Deschide CategoryEditor și selectează categoria
    await categoryEditorPage.openFromOptionsPage();
    await categoryEditorPage.selectCategory('FOOD');

    // Generează un nume unic pentru subcategorie
    const uniqueSubcatName = `TestSubcat${Date.now()}`;

    // Adaugă subcategoria
    await categoryEditorPage.addSubcategory(uniqueSubcatName);

    // Verifică că subcategoria apare în listă
    await categoryEditorPage.verifySubcategoryExists(uniqueSubcatName);

    // Verifică că are flagul de custom
    await categoryEditorPage.verifyCustomFlag(uniqueSubcatName);
  });

  test('utilizatorul poate redenumi o subcategorie', async () => {
    // Deschide CategoryEditor și selectează categoria
    await categoryEditorPage.openFromOptionsPage();
    await categoryEditorPage.selectCategory('FOOD');

    // Adaugă o subcategorie de test
    const originalName = `Original${Date.now()}`;
    await categoryEditorPage.addSubcategory(originalName);

    // Redenumește subcategoria
    const newName = `Renamed${Date.now()}`;
    await categoryEditorPage.renameSubcategory(originalName, newName);

    // Verifică că noul nume există și vechiul nu mai există
    await categoryEditorPage.verifySubcategoryExists(newName);
    await categoryEditorPage.verifySubcategoryNotExists(originalName);
  });

  test('utilizatorul poate șterge o subcategorie custom', async () => {
    // Deschide CategoryEditor și selectează categoria
    await categoryEditorPage.openFromOptionsPage();
    await categoryEditorPage.selectCategory('FOOD');

    // Adaugă o subcategorie de test
    const testSubcatName = `ToDelete${Date.now()}`;
    await categoryEditorPage.addSubcategory(testSubcatName);
    await categoryEditorPage.verifySubcategoryExists(testSubcatName);

    // Șterge subcategoria (cu confirmare)
    await categoryEditorPage.deleteSubcategory(testSubcatName, true);

    // Verifică că subcategoria nu mai există
    await categoryEditorPage.verifySubcategoryNotExists(testSubcatName);
  });

  test('utilizatorul poate închide CategoryEditor cu Escape', async () => {
    // Deschide CategoryEditor
    await categoryEditorPage.openFromOptionsPage();

    // Verifică că modal-ul este deschis
    await expect(categoryEditorPage.modal).toBeVisible();

    // Închide cu Escape key
    await categoryEditorPage.closeWithEscape();

    // Verifică că modal-ul s-a închis
    await expect(categoryEditorPage.modal).not.toBeVisible();
  });

  test('utilizatorul poate închide CategoryEditor cu butonul Close', async () => {
    // Deschide CategoryEditor
    await categoryEditorPage.openFromOptionsPage();

    // Verifică că modal-ul este deschis
    await expect(categoryEditorPage.modal).toBeVisible();

    // Închide cu butonul
    await categoryEditorPage.closeWithButton();

    // Verifică că modal-ul s-a închis
    await expect(categoryEditorPage.modal).not.toBeVisible();
  });
}); 