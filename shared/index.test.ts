// Importăm fișierul JSON cu require pentru compatibilitate maximă cu Jest și TypeScript
// (importul ESM poate da erori la runtime în unele configurații Jest)
// @ts-ignore
const categories = require('./categories.json');

import { TransactionSchema } from './transaction.schema';

describe('Transaction model', () => {
  describe('runtime validation cu TransactionSchema (zod)', () => {
    const validTransaction = {
      id: 'uuid-1',
      userId: 'user-1',
      type: 'income',
      amount: 100,
      currency: 'RON',
      date: '2025-04-21',
      category: 'salary',
      subcategory: 'income.salary',
    };

    it('acceptă o tranzacție validă', () => {
      expect(() => TransactionSchema.parse(validTransaction)).not.toThrow();
    });

    it('respinge tranzacție cu type invalid', () => {
      expect(() => TransactionSchema.parse({ ...validTransaction, type: 'invalid' })).toThrow();
    });

    it('respinge tranzacție fără câmpuri obligatorii', () => {
      expect(() => TransactionSchema.parse({})).toThrow();
      expect(() => TransactionSchema.parse({ id: 'x' })).toThrow();
    });

    it('respinge recurrence invalid', () => {
      expect(() => TransactionSchema.parse({ ...validTransaction, recurrence: 'biweekly' })).toThrow();
    });
  });
  const baseTransaction = {
    id: 'uuid-123',
    userId: 'user-1',
    amount: 100,
    currency: 'RON',
    date: '2025-04-21',
    category: 'salary',
    subcategory: 'income.salary',
  };

  it('acceptă un venit valid', () => {
    const t: import('./index').Transaction = {
      ...baseTransaction,
      type: 'income',
    };
    expect(t.type).toBe('income');
    expect(typeof t.amount).toBe('number');
    expect(typeof t.currency).toBe('string');
  });

  it('acceptă o cheltuială validă', () => {
    const t: import('./index').Transaction = {
      ...baseTransaction,
      type: 'expense',
      category: 'housing',
      subcategory: 'expenses.housing.gas',
      description: 'factura gaz',
      status: 'cleared',
    };
    expect(t.type).toBe('expense');
    expect(t.status).toBe('cleared');
  });

  it('acceptă o economie validă', () => {
    const t: import('./index').Transaction = {
      ...baseTransaction,
      type: 'saving',
      category: 'savings',
      subcategory: 'savings.emergency_fund',
      recurring: true,
      recurrence: 'monthly',
    };
    expect(t.type).toBe('saving');
    expect(t.recurring).toBe(true);
    expect(t.recurrence).toBe('monthly');
  });

  it('acceptă un transfer valid', () => {
    const t: import('./index').Transaction = {
      ...baseTransaction,
      type: 'transfer',
      accountId: 'cont-economii',
      status: 'pending',
    };
    expect(t.type).toBe('transfer');
    expect(t.accountId).toBe('cont-economii');
  });

  it('nu permite valori invalide pentru recurrence', () => {
    // @ts-expect-error
    const t: import('./index').Transaction = { ...baseTransaction, type: 'expense', recurrence: 'biweekly' };
    expect(['none','daily','weekly','monthly','yearly']).not.toContain(t.recurrence);
  });

  it('permite câmpuri opționale lipsă', () => {
    const t: import('./index').Transaction = {
      id: 'uuid-2',
      userId: 'user-2',
      type: 'income',
      amount: 10,
      currency: 'EUR',
      date: '2025-04-21',
      category: 'salary',
      subcategory: 'income.salary',
    };
    expect(t.description).toBeUndefined();
    expect(t.recurring).toBeUndefined();
    expect(t.status).toBeUndefined();
  });
});

test('dummy test', () => { expect(1 + 1).toBe(2); });

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

  it('are subcategoriile corecte pentru cheltuieli.appearance', () => {
    expect(categories.expenses.appearance).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'expenses.appearance.clothing' }),
        expect.objectContaining({ key: 'expenses.appearance.salon' }),
        expect.objectContaining({ key: 'expenses.appearance.cosmetics' }),
        expect.objectContaining({ key: 'expenses.appearance.surgery' }),
        expect.objectContaining({ key: 'expenses.appearance.personal_hygiene' }),
        expect.objectContaining({ key: 'expenses.appearance.pet_hygiene' }),
        expect.objectContaining({ key: 'expenses.appearance.cleaning_services' }),
        expect.objectContaining({ key: 'expenses.appearance.pet_clothing' })
      ])
    );
  });

  it('are subcategoriile corecte pentru cheltuieli.education', () => {
    expect(categories.expenses.education).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'expenses.education.taxes' }),
        expect.objectContaining({ key: 'expenses.education.kindergarten' }),
        expect.objectContaining({ key: 'expenses.education.courses' }),
        expect.objectContaining({ key: 'expenses.education.materials' }),
        expect.objectContaining({ key: 'expenses.education.licenses' })
      ])
    );
  });

  it('are subcategoriile corecte pentru cheltuieli.career', () => {
    expect(categories.expenses.career).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'expenses.career.taxes' }),
        expect.objectContaining({ key: 'expenses.career.cv_services' }),
        expect.objectContaining({ key: 'expenses.career.consulting' })
      ])
    );
  });

  it('are subcategoriile corecte pentru cheltuieli.health', () => {
    expect(categories.expenses.health).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'expenses.health.medicine' }),
        expect.objectContaining({ key: 'expenses.health.prevention' }),
        expect.objectContaining({ key: 'expenses.health.surgery' }),
        expect.objectContaining({ key: 'expenses.health.therapy' }),
        expect.objectContaining({ key: 'expenses.health.subscriptions' }),
        expect.objectContaining({ key: 'expenses.health.insurance' }),
        expect.objectContaining({ key: 'expenses.health.vet' }),
        expect.objectContaining({ key: 'expenses.health.pet_medicine' })
      ])
    );
  });

  it('are subcategoriile corecte pentru cheltuieli.nutrition', () => {
    expect(categories.expenses.nutrition).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'expenses.nutrition.food' }),
        expect.objectContaining({ key: 'expenses.nutrition.restaurants' }),
        expect.objectContaining({ key: 'expenses.nutrition.takeaway' }),
        expect.objectContaining({ key: 'expenses.nutrition.orders' }),
        expect.objectContaining({ key: 'expenses.nutrition.coffee' }),
        expect.objectContaining({ key: 'expenses.nutrition.pet_food' })
      ])
    );
  });

  it('are subcategoriile corecte pentru cheltuieli.housing', () => {
    expect(categories.expenses.housing).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'expenses.housing.maintenance' }),
        expect.objectContaining({ key: 'expenses.housing.water' }),
        expect.objectContaining({ key: 'expenses.housing.gas' }),
        expect.objectContaining({ key: 'expenses.housing.electricity' }),
        expect.objectContaining({ key: 'expenses.housing.phone' }),
        expect.objectContaining({ key: 'expenses.housing.cable_tv' }),
        expect.objectContaining({ key: 'expenses.housing.internet' }),
        expect.objectContaining({ key: 'expenses.housing.repairs' }),
        expect.objectContaining({ key: 'expenses.housing.cleaning_products' }),
        expect.objectContaining({ key: 'expenses.housing.cleaning_services' }),
        expect.objectContaining({ key: 'expenses.housing.furniture' }),
        expect.objectContaining({ key: 'expenses.housing.electronics' }),
        expect.objectContaining({ key: 'expenses.housing.insurance' }),
        expect.objectContaining({ key: 'expenses.housing.tax' }),
        expect.objectContaining({ key: 'expenses.housing.rent' }),
        expect.objectContaining({ key: 'expenses.housing.garbage' })
      ])
    );
  });

  it('are subcategoriile corecte pentru cheltuieli.leisure', () => {
    expect(categories.expenses.leisure).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'expenses.leisure.books' }),
        expect.objectContaining({ key: 'expenses.leisure.music' }),
        expect.objectContaining({ key: 'expenses.leisure.magazines' }),
        expect.objectContaining({ key: 'expenses.leisure.movies' }),
        expect.objectContaining({ key: 'expenses.leisure.gym' }),
        expect.objectContaining({ key: 'expenses.leisure.online_services' }),
        expect.objectContaining({ key: 'expenses.leisure.cinema' }),
        expect.objectContaining({ key: 'expenses.leisure.pools' }),
        expect.objectContaining({ key: 'expenses.leisure.games' }),
        expect.objectContaining({ key: 'expenses.leisure.gifts' }),
        expect.objectContaining({ key: 'expenses.leisure.hobbies' }),
        expect.objectContaining({ key: 'expenses.leisure.sports_equipment' }),
        expect.objectContaining({ key: 'expenses.leisure.gambling' }),
        expect.objectContaining({ key: 'expenses.leisure.smoking' })
      ])
    );
  });

  it('are subcategoriile corecte pentru cheltuieli.travel', () => {
    expect(categories.expenses.travel).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'expenses.travel.accommodation' }),
        expect.objectContaining({ key: 'expenses.travel.tickets' }),
        expect.objectContaining({ key: 'expenses.travel.tolls' }),
        expect.objectContaining({ key: 'expenses.travel.tourist_tickets' }),
        expect.objectContaining({ key: 'expenses.travel.souvenirs' }),
        expect.objectContaining({ key: 'expenses.travel.insurance' }),
        expect.objectContaining({ key: 'expenses.travel.pet_hotel' }),
        expect.objectContaining({ key: 'expenses.travel.car_rental' }),
        expect.objectContaining({ key: 'expenses.travel.equipment_rental' }),
        expect.objectContaining({ key: 'expenses.travel.food' })
      ])
    );
  });

  it('are subcategoriile corecte pentru cheltuieli.transport', () => {
    expect(categories.expenses.transport).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'expenses.transport.public_transport' }),
        expect.objectContaining({ key: 'expenses.transport.revisions' }),
        expect.objectContaining({ key: 'expenses.transport.tolls' }),
        expect.objectContaining({ key: 'expenses.transport.parking' }),
        expect.objectContaining({ key: 'expenses.transport.wash' }),
        expect.objectContaining({ key: 'expenses.transport.rca' }),
        expect.objectContaining({ key: 'expenses.transport.casco' }),
        expect.objectContaining({ key: 'expenses.transport.accessories' }),
        expect.objectContaining({ key: 'expenses.transport.fuel' }),
        expect.objectContaining({ key: 'expenses.transport.road_tax' }),
        expect.objectContaining({ key: 'expenses.transport.tax' }),
        expect.objectContaining({ key: 'expenses.transport.tires' }),
        expect.objectContaining({ key: 'expenses.transport.tire_hotel' }),
        expect.objectContaining({ key: 'expenses.transport.repairs' })
      ])
    );
  });

  it('are subcategoriile corecte pentru cheltuieli.investments', () => {
    expect(categories.expenses.investments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'expenses.investments.project1' }),
        expect.objectContaining({ key: 'expenses.investments.project2' }),
        expect.objectContaining({ key: 'expenses.investments.project3' }),
        expect.objectContaining({ key: 'expenses.investments.project4' }),
        expect.objectContaining({ key: 'expenses.investments.project5' }),
        expect.objectContaining({ key: 'expenses.investments.project6' }),
        expect.objectContaining({ key: 'expenses.investments.project7' }),
        expect.objectContaining({ key: 'expenses.investments.project8' }),
        expect.objectContaining({ key: 'expenses.investments.project9' }),
        expect.objectContaining({ key: 'expenses.investments.project10' }),
        expect.objectContaining({ key: 'expenses.investments.project11' }),
        expect.objectContaining({ key: 'expenses.investments.project12' }),
        expect.objectContaining({ key: 'expenses.investments.project13' })
      ])
    );
  });
});
