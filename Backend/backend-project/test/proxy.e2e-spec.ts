import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import * as http from 'http';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { applyExperimentProxy } from './../src/proxy';

type CapturedRequest = {
  method: string;
  url: string;
  body: string;
  headers: http.IncomingHttpHeaders;
};

describe('Proxy (e2e)', () => {
  let app: INestApplication;
  let target: http.Server;
  const captured: CapturedRequest[] = [];

  beforeAll(async () => {
    target = http.createServer((req, res) => {
      const chunks: Buffer[] = [];
      req.on('data', (c) => chunks.push(c));
      req.on('end', () => {
        captured.push({
          method: req.method ?? '',
          url: req.url ?? '',
          body: Buffer.concat(chunks).toString('utf8'),
          headers: req.headers,
        });
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('x-target-server', 'true');
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            method: req.method,
            url: req.url,
            received: Buffer.concat(chunks).toString('utf8'),
          }),
        );
      });
    });
    await new Promise<void>((resolve) => target.listen(8080, '127.0.0.1', resolve));

    // Use the SAME proxy configuration the application uses in main.ts.
    app = await NestFactory.create(AppModule, { logger: false });
    await applyExperimentProxy(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await new Promise<void>((resolve, reject) =>
      target.close((err) => (err ? reject(err) : resolve())),
    );
  });

  beforeEach(() => {
    captured.length = 0;
  });

  const server = () => app.getHttpServer();

  it('proxies GET /exercises', async () => {
    const res = await request(server()).get('/exercises').expect(200);
    expect(res.headers['x-target-server']).toBe('true');
    expect(captured).toHaveLength(1);
    expect(captured[0].method).toBe('GET');
    expect(captured[0].url).toBe('/exercises');
  });

  it('proxies GET /exercises/123 with query', async () => {
    await request(server()).get('/exercises/123?foo=bar').expect(200);
    expect(captured[0].method).toBe('GET');
    expect(captured[0].url).toBe('/exercises/123?foo=bar');
  });

  it('proxies POST /experiments with JSON body', async () => {
    const res = await request(server())
      .post('/experiments')
      .send({ hello: 'world' })
      .expect(200);
    expect(captured[0].method).toBe('POST');
    expect(captured[0].url).toBe('/experiments');
    expect(JSON.parse(captured[0].body)).toEqual({ hello: 'world' });
    expect(JSON.parse(res.text).received).toBe('{"hello":"world"}');
  });

  it('proxies PUT /experiments/42', async () => {
    await request(server()).put('/experiments/42').send({ a: 1 }).expect(200);
    expect(captured[0].method).toBe('PUT');
    expect(captured[0].url).toBe('/experiments/42');
  });

  it('proxies DELETE /exercises/9', async () => {
    await request(server()).delete('/exercises/9').expect(200);
    expect(captured[0].method).toBe('DELETE');
    expect(captured[0].url).toBe('/exercises/9');
  });

  it('proxies PATCH /experiments/9', async () => {
    await request(server()).patch('/experiments/9').send({ a: 2 }).expect(200);
    expect(captured[0].method).toBe('PATCH');
    expect(captured[0].url).toBe('/experiments/9');
  });

  it('does NOT proxy unrelated routes', async () => {
    await request(server()).get('/not-a-proxy-route').expect(404);
    expect(captured).toHaveLength(0);
  });
});
