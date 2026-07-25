import { authFetch } from "./client";

// The mobile OTP endpoints DON'T use a single success code: /otp-login returns
// 200, but /otp-sign-up returns 201 on success — AND on failure (a wrong OTP on
// signup comes back as 201 with data.messageDescription "Invalid OTP!", verified
// against the live backend 2026-06-15). So we can't gate success on the code
// alone: accept 2xx as "the call was processed", then treat a recognisable
// failure message in the body as the real error. Treating 201 as failure was
// silently breaking EVERY new-user signup — the successful 201 was thrown as if
// the OTP were invalid, surfacing the backend's literal "Invalid OTP!" string.
const OTP_FAILURE_MESSAGE = /invalid otp|not verified|expired/i;

async function otpFetch(path) {
  const res = await authFetch(path, { retry: false });
  const json = await res.json().catch(() => null);
  const code = json?.responseCode;
  const message = json?.data?.messageDescription;
  const codeOk = code >= 200 && code < 300; // 200 (login) AND 201 (sign-up) are success
  if (!res.ok || !json || !codeOk || OTP_FAILURE_MESSAGE.test(message || "")) {
    throw new Error(message || `OTP API failed (${res.status})`);
  }
  return json;
}

// Email OTP endpoints return {status: boolean, message: string} — different shape
// from the mobile OTP endpoints above which use {responseCode, data}.
async function emailOtpFetch(path, method = "POST") {
  const res = await authFetch(path, { method, retry: false });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || `Email OTP API failed (${res.status})`);
  if (!json?.status) throw new Error(json?.message || "Request failed");
  return json;
}

export async function generateOtp(mobile) {
  const json = await otpFetch(`/generate-otp4-new?mobile=${mobile}`);
  return { IsRegistered: json.data.IsRegistered };
}

export async function loginWithOtp(mobile, otp) {
  const json = await otpFetch(`/otp-login?otp=${otp}&mobile=${mobile}`);
  return json.data;
}

export async function signUpWithOtp(mobile, otp, cityId) {
  const json = await otpFetch(`/otp-sign-up?otp=${otp}&city_id=${cityId}&mobile=${mobile}`);
  return json.data;
}

export async function getCities() {
  const json = await otpFetch("/get-ig-cities");
  return json.data.cities;
}

export async function getDeliverySlots() {
  const json = await otpFetch("/get-delivery-slots");
  return json.data.slots; // [{id, slot_name, from, to}]
}

export async function sendEmailOtp(email) {
  await emailOtpFetch(`/send-email-otp?email=${encodeURIComponent(email)}`);
}

export async function verifyEmailOtp(email, otp) {
  await emailOtpFetch(`/verify-email?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
}
