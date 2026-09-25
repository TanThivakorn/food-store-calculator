import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { MAX_QUANTITY } from '../src/calculator/constants/menu.constant';

describe('POST /calculator', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.listen(0, '127.0.0.1');
  });

  afterAll(async () => {
    await app?.close();
  });

  it('returns a calculation breakdown', async () => {
    await request(app.getHttpServer())
      .post('/calculator')
      .send({ items: { red: 1, green: 2, orange: 5 }, isMember: true })
      .expect(200)
      .expect({
        subtotal: 730,
        bundleDiscount: 28,
        memberDiscount: 70.2,
        total: 631.8,
      });
  });

  it.each([{}, { green: 0 }, { orange: MAX_QUANTITY }])(
    'accepts valid items %j',
    async (items) => {
      await request(app.getHttpServer())
        .post('/calculator')
        .send({ items, isMember: false })
        .expect(200);
    },
  );

  const invalidOrders: Record<string, unknown>[] = [
    { items: {} },
    { isMember: false },
    { items: {}, isMember: 'true' },
    { items: {}, isMember: 1 },
    { items: {}, isMember: null },
    { items: null, isMember: false },
    { items: [], isMember: false },
    { items: 'orange', isMember: false },
    { items: { orange: -1 }, isMember: false },
    { items: { orange: 1.5 }, isMember: false },
    { items: { orange: '2' }, isMember: false },
    { items: { orange: null }, isMember: false },
    { items: { orange: true }, isMember: false },
    { items: { orange: {} }, isMember: false },
    { items: { orange: MAX_QUANTITY + 1 }, isMember: false },
    { items: { cyan: 1 }, isMember: false },
    { items: { Red: 1 }, isMember: false },
    { items: {}, isMember: false, extra: true },
  ];

  it.each(invalidOrders)('rejects malformed order %j', async (body) => {
    await request(app.getHttpServer())
      .post('/calculator')
      .send(body)
      .expect(400);
  });

  it('rejects invalid JSON', async () => {
    await request(app.getHttpServer())
      .post('/calculator')
      .set('Content-Type', 'application/json')
      .send('{"items":')
      .expect(400);
  });

  it('rejects an array body', async () => {
    await request(app.getHttpServer()).post('/calculator').send([]).expect(400);
  });
});
