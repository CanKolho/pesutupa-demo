export const DATABASE_URL = Deno.env.get("DATABASE_URL");
export const SEND_EMAIL = `${Deno.env.get("SEND_EMAIL")}`;
export const PASSWORD = `${Deno.env.get("PASSWROD")}`;

const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

export const SECRET = key