import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { TransactionSchema } from '../../../../shared-constants/transaction.schema';

const validTransaction = {
  id: 't1',
  userId: 'u1',
  type: 'income',
  amount: 100,
  currency: 'RON',
  date: '2025-04-21',
  category: 'salary',
  subcategory: 'income.salary',
};

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transactions (POST) acceptă tranzacție validă', async () => {
    const res = await request(app.getHttpServer())
      .post('/transactions')
      .send(validTransaction)
      .expect(201);
    expect(res.body).toMatchObject(validTransaction);
    createdId = res.body.id;
  });

  it('/transactions (POST) respinge tranzacție invalidă', async () => {
    const invalid = { ...validTransaction, type: 'invalid' };
    await request(app.getHttpServer())
      .post('/transactions')
      .send(invalid)
      .expect(400); // input invalid => 400
  });

  it('/transactions (GET) returnează lista cu structură paginată', async () => {
    const res = await request(app.getHttpServer())
      .get('/transactions')
      .expect(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('limit');
    expect(res.body).toHaveProperty('offset');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  it('/transactions (GET) filtrare după type', async () => {
    // adaugă două tranzacții de tip "expense"
    await request(app.getHttpServer())
      .post('/transactions')
      .send({ ...validTransaction, id: 't2', type: 'expense', category: 'food', subcategory: 'expenses.food' });
    await request(app.getHttpServer())
      .post('/transactions')
      .send({ ...validTransaction, id: 't3', type: 'expense', category: 'housing', subcategory: 'expenses.housing' });
    const res = await request(app.getHttpServer())
      .get('/transactions?type=expense')
      .expect(200);
    expect(res.body.data.every((t: any) => t.type === 'expense')).toBe(true);
  });

  it('/transactions (GET) filtrare după category', async () => {
    const res = await request(app.getHttpServer())
      .get('/transactions?category=food')
      .expect(200);
    expect(res.body.data.every((t: any) => t.category === 'food')).toBe(true);
  });

  it('/transactions (GET) paginare cu limit și offset', async () => {
    const res = await request(app.getHttpServer())
      .get('/transactions?limit=1&offset=1')
      .expect(200);
    expect(res.body.data.length).toBeLessThanOrEqual(1);
    expect(res.body.limit).toBe(1);
    expect(res.body.offset).toBe(1);
  });

  it('/transactions (GET) sortare descrescătoare după amount', async () => {
    // Adaugă încă o tranzacție cu amount mai mare
    await request(app.getHttpServer())
      .post('/transactions')
      .send({ ...validTransaction, id: 't4', amount: 1000 });
    const res = await request(app.getHttpServer())
      .get('/transactions?sort=-amount')
      .expect(200);
    expect(res.body.data[0].amount).toBeGreaterThanOrEqual(res.body.data[res.body.data.length - 1].amount);
  });

  it('/transactions/:id (GET) returnează detalii pentru tranzacție existentă', async () => {
    const res = await request(app.getHttpServer())
      .get(`/transactions/${createdId}`)
      .expect(200);
    expect(res.body).toMatchObject(validTransaction);
  });

  it('/transactions/:id (GET) returnează 404 pentru tranzacție inexistentă', async () => {
    await request(app.getHttpServer())
      .get('/transactions/inexistent')
      .expect(404);
  });

  it('/transactions/:id (PUT) actualizează tranzacția', async () => {
    const updated = { ...validTransaction, amount: 999 };
    const res = await request(app.getHttpServer())
      .put(`/transactions/${createdId}`)
      .send(updated)
      .expect(200);
    expect(res.body.amount).toBe(999);
  });

  it('/transactions/:id (PUT) returnează 404 dacă nu există', async () => {
    const updated = { ...validTransaction, amount: 777 };
    await request(app.getHttpServer())
      .put('/transactions/inexistent')
      .send(updated)
      .expect(404);
  });

  it('/transactions/:id (DELETE) șterge tranzacția', async () => {
    await request(app.getHttpServer())
      .delete(`/transactions/${createdId}`)
      .expect(204);
  });

  it('/transactions/:id (DELETE) returnează 404 dacă nu există', async () => {
    await request(app.getHttpServer())
      .delete('/transactions/inexistent')
      .expect(404);
  });
});
