// TODO: confirm auth header with Shivam — currently assuming Bearer JWT
import { AWS_BASE } from "./config"; // update-kyc lives here
import { authFetch } from "./client";

async function apiFetch(path) {
  const res = await authFetch(path);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.data?.messageDescription || `KYC API failed (${res.status})`);
  }
  return res.json();
}

export async function getKycStatus(mobile) {
  const json = await apiFetch(`/kyc?mobile=${encodeURIComponent(mobile)}`);
  return json.data;
}

export async function getKycDocList(mobile) {
  const json = await apiFetch(`/get-kyc-doc-list?mobile=${encodeURIComponent(mobile)}`);
  return json.data.kyc_docs ?? [];
}

export async function submitKycDoc(mobile, docType, file) {
  const form = new FormData();
  form.append("mobile", mobile);
  form.append("doc_type", docType);
  form.append("kyc_pic", file);
  // Upload lives on AWS_BASE; original did not retry on 401 — preserve that.
  const res = await authFetch("/update-kyc", {
    method: "POST",
    body: form,
    base: AWS_BASE,
    retry: false,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.data?.messageDescription || `KYC upload failed (${res.status})`);
  }
  return res.json();
}
