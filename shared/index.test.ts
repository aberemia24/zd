// Importăm fișierul JSON cu require pentru compatibilitate maximă cu Jest și TypeScript
// (importul ESM poate da erori la runtime în unele configurații Jest)
// @ts-ignore
const categories = require('./categories.json');

describe('categories config', () => {
  it('are structura principală corectă', () => {
    // Categoriile principale
    expect(categories).toHaveProperty('income');
    expect(categories).toHaveProperty('savings');
    expect(categories).toHaveProperty('expenses');
  });

  it('are subcategoriile corecte pentru venituri', () => {
    expect(categories.income).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'income.salary' }),
        expect.objectContaining({ key: 'income.dividends' }),
        expect.objectContaining({ key: 'income.rent' }),
        expect.objectContaining({ key: 'income.meal_tickets' }),
        expect.objectContaining({ key: 'income.gifts' }),
        expect.objectContaining({ key: 'income.copyrights' }),
        expect.objectContaining({ key: 'income.pensions' }),
        expect.objectContaining({ key: 'income.allowances' }),
        expect.objectContaining({ key: 'income.other' }),
        expect.objectContaining({ key: 'income.carryover' })
      ])
    );
  });

  it('are subcategoriile corecte pentru economii', () => {
    expect(categories.savings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'savings.emergency_fund' }),
        expect.objectContaining({ key: 'savings.reserve_fund' }),
        expect.objectContaining({ key: 'savings.general_fund' }),
        expect.objectContaining({ key: 'savings.total' })
      ])
    );
  });

  it('are chei de localizare pentru fiecare subcategorie de cheltuieli', () => {
    Object.values(categories.expenses).forEach((expenseGroup: any) => {
      expenseGroup.forEach((subcategory: any) => {
        expect(subcategory).toHaveProperty('key');
        expect(typeof subcategory.key).toBe('string');
        expect(subcategory.key.startsWith('expenses.')).toBe(true);
      });
    });
  });
});
