import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Application E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });
  });

  describe('Products (Public Endpoints)', () => {
    it('/products (GET) - should return paginated products', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('items');
          expect(res.body).toHaveProperty('metadata');
          expect(Array.isArray(res.body.items)).toBe(true);
          expect(res.body.metadata).toHaveProperty('total');
          expect(res.body.metadata).toHaveProperty('page');
          expect(res.body.metadata).toHaveProperty('limit');
          expect(res.body.metadata).toHaveProperty('totalPages');
        });
    });

    it('/products (GET) - should apply pagination', () => {
      return request(app.getHttpServer())
        .get('/products?page=1&limit=3')
        .expect(200)
        .expect((res) => {
          expect(res.body.metadata.page).toBe(1);
          expect(res.body.metadata.limit).toBe(3);
        });
    });

    it('/products (GET) - should filter by name', () => {
      return request(app.getHttpServer()).get('/products?name=test').expect(200);
    });

    it('/products (GET) - should filter by category', () => {
      return request(app.getHttpServer()).get('/products?category=electronics').expect(200);
    });

    it('/products (GET) - should filter by price range', () => {
      return request(app.getHttpServer()).get('/products?minPrice=10&maxPrice=100').expect(200);
    });

    it('/products/:id (GET) - should return 404 for non-existent product', () => {
      return request(app.getHttpServer()).get('/products/non-existent-id').expect(404);
    });
  });

  describe('Auth Endpoints', () => {
    it('/auth/login (POST) - should return JWT token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(typeof res.body.access_token).toBe('string');
        });
    });
  });

  describe('Reports (Private Endpoints)', () => {
    let authToken: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'testuser' });

      authToken = response.body.access_token;
    });

    it('/reports/deleted-products (GET) - should return 401 without token', () => {
      return request(app.getHttpServer()).get('/reports/deleted-products').expect(401);
    });

    it('/reports/deleted-products (GET) - should return report with valid token', () => {
      return request(app.getHttpServer())
        .get('/reports/deleted-products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalProducts');
          expect(res.body).toHaveProperty('deletedProducts');
          expect(res.body).toHaveProperty('percentageDeleted');
        });
    });

    it('/reports/non-deleted-products (GET) - should return report with filters', () => {
      return request(app.getHttpServer())
        .get('/reports/non-deleted-products?hasPrice=true')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalNonDeletedProducts');
          expect(res.body).toHaveProperty('productsWithPrice');
          expect(res.body).toHaveProperty('percentageWithPrice');
        });
    });

    it('/reports/products-by-category (GET) - should return category breakdown', () => {
      return request(app.getHttpServer())
        .get('/reports/products-by-category')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalProducts');
          expect(res.body).toHaveProperty('categoriesBreakdown');
          expect(Array.isArray(res.body.categoriesBreakdown)).toBe(true);
        });
    });
  });
});
