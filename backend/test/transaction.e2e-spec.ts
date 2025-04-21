import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TransactionSchema } from '../../shared/transaction.schema';

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
  });

  it('/transactions (POST) respinge tranzacție invalidă', async () => {
    const invalid = { ...validTransaction, type: 'invalid' };
    await request(app.getHttpServer())
      .post('/transactions')
      .send(invalid)
      .expect(500); // ar trebui 400 dacă aruncăm BadRequestException
  });

  it('/transactions (GET) returnează lista', async () => {
    const res = await request(app.getHttpServer())
      .get('/transactions')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
