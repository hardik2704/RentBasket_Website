import { authFetch } from "./client";

export async function updateUserProfile(data) {
  const params = new URLSearchParams({
    user_id: String(data.user_id),
    first_name: data.first_name ?? "",
    last_name: data.last_name ?? "",
    email: data.email ?? "",
    address: data.address ?? "",
    org_name: data.org_name ?? "",
    about_me: data.about_me ?? "",
    social_media_links: data.social_media_links ?? "",
    reg_mobile_num: data.reg_mobile_num ?? "",
  });
  const res = await authFetch(`/update-user-profile?${params}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.data?.messageDescription || body?.message || `Profile update failed (${res.status})`);
  }
  return res.json();
}
