/**
 * The Android + iOS app-store buttons, in one place so every download surface
 * (AppNudge, and later AppDownloadCard / DownloadSection) shares the same URLs
 * and icons. Currently only AppNudge consumes this.
 *
 * Props:
 *   className  wrapper classes (layout — caller decides row/stack/width)
 *   btnClass   per-button classes (skin)
 */

export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.rentoktenant&pcampaignid=web_share&pli=1";
export const APP_STORE_URL = "https://apps.apple.com/in/app/rentbasket/id6477462224";

const AndroidIcon = ({ className = "h-4 w-4 shrink-0" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.52 15.34c0 .45-.36.82-.81.82h-1.55v3.1c0 1.05-.86 1.91-1.91 1.91s-1.91-.86-1.91-1.91v-3.1h-1.18v3.1c0 1.05-.86 1.91-1.91 1.91s-1.91-.86-1.91-1.91v-3.1H4.79c-.45 0-.81-.37-.81-.82V8.58h13.54v6.76zm-2.59-11.08l1.27-2.21c.11-.19.05-.43-.14-.54a.403.403 0 00-.54.14l-1.3 2.26a8.21 8.21 0 00-3.46-.75c-1.24 0-2.41.27-3.46.75L6 1.65a.403.403 0 00-.54-.14.406.406 0 00-.14.54l1.27 2.21C4.33 5.29 2.8 7.5 2.75 10.11h16c-.05-2.61-1.58-4.82-3.82-5.85zM7.5 7.64c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6.5 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6.25.94c-.83 0-1.5.67-1.5 1.5v4.54c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10.08c0-.83-.67-1.5-1.5-1.5zM1.25 8.58c-.83 0-1.5.67-1.5 1.5v4.54c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V10.08c0-.83-.67-1.5-1.5-1.5z" />
  </svg>
);

const AppleIcon = ({ className = "h-4 w-4 shrink-0" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const StoreButtons = ({ className = "", btnClass = "" }) => (
  <div className={className}>
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={btnClass}
    >
      <AndroidIcon />
      Android
    </a>
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={btnClass}
    >
      <AppleIcon />
      iOS
    </a>
  </div>
);

export default StoreButtons;
