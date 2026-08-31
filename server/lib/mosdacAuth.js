/**
 * server/lib/mosdacAuth.js
 * Manages MOSDAC authenticated sessions.
 * Returns a cookie string for subsequent upstream requests.
 */
"use strict";
const axios = require("axios");

const MOSDAC_BASE = "https://mosdac.gov.in";
// ponytail: [no exponential-backoff retry], upgrade when MOSDAC lockout policy is confirmed
let _session = null; // { cookie: string, fetchedAt: number }

async function getMosdacSession() {
  const { MOSDAC_USERNAME, MOSDAC_PASSWORD } = process.env;
  if (!MOSDAC_USERNAME || !MOSDAC_PASSWORD) {
    const err = new Error("Missing MOSDAC_USERNAME or MOSDAC_PASSWORD in environment");
    err.statusCode = 500;
    throw err;
  }

  // Reuse session for up to 25 minutes
  if (_session && Date.now() - _session.fetchedAt < 25 * 60 * 1000) {
    return _session.cookie;
  }

  const resp = await axios.post(
    `${MOSDAC_BASE}/auth/login`,
    { user_credentials: { username: MOSDAC_USERNAME, password: MOSDAC_PASSWORD } },
    { headers: { "Content-Type": "application/json" }, validateStatus: (s) => s < 500 }
  );

  if (resp.status === 401 || resp.status === 403) {
    const err = new Error("MOSDAC authentication failed — verify credentials");
    err.statusCode = 401;
    throw err;
  }

  const setCookie = resp.headers["set-cookie"];
  if (!setCookie || !setCookie.length) {
    const err = new Error("MOSDAC login returned no session cookie");
    err.statusCode = 502;
    throw err;
  }

  const cookie = setCookie.map((c) => c.split(";")[0]).join("; ");
  _session = { cookie, fetchedAt: Date.now() };
  return cookie;
}

/** Call on 401 from downstream to force re-auth on next request */
function invalidateSession() { _session = null; }

module.exports = { getMosdacSession, invalidateSession, MOSDAC_BASE };