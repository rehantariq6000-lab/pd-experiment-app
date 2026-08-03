import { INestApplication } from '@nestjs/common';

/**
 * Reverse-proxy configuration for the experiment API.
 *
 * All requests (any HTTP method) whose path matches `/exercises/*` or
 * `/experiments/*` are forwarded to the remote experiment server. Everything
 * else is handled by this NestJS application's own controllers.
 */
export const PROXY_PATHS = ['/exercises/**', '/experiments/**'];

export const PROXY_TARGET =
  process.env.EXPERIMENT_API_TARGET ?? 'http://localhost:8080';

/**
 * Registers the experiment-API proxy middleware on the given Nest application.
 *
 * `http-proxy-middleware` v3 is ESM-only, so it is loaded via dynamic import.
 * `fixRequestBody` re-streams JSON bodies that Nest's body parser has already
 * consumed, so POST/PATCH/PUT payloads reach the target intact.
 */
export async function applyExperimentProxy(
  app: INestApplication,
): Promise<void> {
  const { createProxyMiddleware, fixRequestBody } = await import(
    'http-proxy-middleware'
  );

  app.use(
    createProxyMiddleware({
      pathFilter: PROXY_PATHS,
      target: PROXY_TARGET,
      changeOrigin: true,
      on: {
        proxyReq: fixRequestBody,
      },
    }),
  );
}
