// src/lib/mockJwt.ts
type JwtPayload = Record<string, unknown>;

function base64UrlEncode(obj: object) {
  const json = JSON.stringify(obj);
  const b64 = Buffer.from(json, "utf8").toString("base64");
  return b64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function createMockJwt(payload: JwtPayload) {
  // header can be anything; jwt-decode just needs valid base64url JSON
  const header = base64UrlEncode({ alg: "none", typ: "JWT" });
  const body = base64UrlEncode(payload);
  const signature = "dev"; // placeholder
  return `${header}.${body}.${signature}`;
}