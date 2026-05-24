import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

/**
 * Cloudflare Access JWT validation.
 *
 * Preview deployments (served from `*.workers.dev`) are gated behind a
 * Cloudflare Access login: Access authenticates the user at the edge and
 * forwards the request with a signed JWT, which we verify here as the
 * enforcement point. Production (a custom domain) stays public.
 *
 * Required vars (see wrangler.jsonc):
 * - `CF_ACCESS_TEAM_DOMAIN`: full team domain URL, e.g.
 *   `https://your-team.cloudflareaccess.com`.
 * - `CF_ACCESS_AUD`: the Access application's Application Audience (AUD) tag.
 *
 * @see https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json
 */

/** Header Cloudflare Access sets on every authenticated request. */
const ACCESS_JWT_HEADER = 'cf-access-jwt-assertion';
/** Cookie fallback (not guaranteed to be forwarded). */
const ACCESS_JWT_COOKIE = 'CF_Authorization';

/**
 * Remote JWKS sets, cached per team domain for the lifetime of the isolate.
 * `createRemoteJWKSet` additionally caches the fetched keys internally and
 * only refetches when an unknown key id is seen, so this avoids hitting the
 * certs endpoint on every request.
 */
const jwksByTeamDomain = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getJwks(teamDomain: string) {
  let jwks = jwksByTeamDomain.get(teamDomain);
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`${teamDomain}/cdn-cgi/access/certs`));
    jwksByTeamDomain.set(teamDomain, jwks);
  }
  return jwks;
}

/** Whether this request targets a preview deployment that must be gated. */
function isPreviewDeployment(url: URL): boolean {
  return url.hostname.endsWith('.workers.dev');
}

/** Read the Access JWT from the header, falling back to the cookie. */
function readAccessToken(request: Request): string | null {
  const header = request.headers.get(ACCESS_JWT_HEADER);
  if (header != null && header !== '') {
    return header;
  }

  const cookie = request.headers.get('cookie');
  if (cookie == null || cookie === '') {
    return null;
  }
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${ACCESS_JWT_COOKIE}=([^;]+)`));
  if (match == null) {
    return null;
  }
  return decodeURIComponent(match[1]!);
}

/**
 * Verify a Cloudflare Access JWT. Checks the signature against the team's
 * public keys and validates the `iss`, `aud`, and `exp` claims.
 *
 * @throws when the token is missing, malformed, expired, or fails verification.
 */
export async function verifyAccessJwt(
  token: string,
  teamDomain: string,
  aud: string
): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getJwks(teamDomain), {
    issuer: teamDomain,
    audience: aud,
  });
  return payload;
}

/**
 * Enforce Cloudflare Access on preview deployments.
 *
 * @returns a `Response` to short-circuit the request when access is denied, or
 *   `null` when the request may proceed to the app.
 */
export async function enforceAccess(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);

  // Only guard previews; a custom production domain is served publicly.
  if (!isPreviewDeployment(url)) {
    return null;
  }

  // Annotated as `string` so the guard below narrows correctly: wrangler types
  // the configured values as string literals (e.g. "" until they are filled in).
  const teamDomain: string = env.CF_ACCESS_TEAM_DOMAIN;
  const aud: string = env.CF_ACCESS_AUD;

  // Fail closed: an unconfigured preview must not be publicly viewable.
  if (teamDomain === '' || aud === '') {
    return new Response('Cloudflare Access is not configured for this preview deployment.', {
      status: 500,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const token = readAccessToken(request);
  if (token == null || token === '') {
    return new Response('Missing Cloudflare Access token.', {
      status: 401,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  try {
    await verifyAccessJwt(token, teamDomain, aud);
    return null;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'verification failed';
    return new Response(`Invalid Cloudflare Access token: ${message}`, {
      status: 403,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
}
