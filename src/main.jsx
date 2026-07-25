import "@fontsource-variable/quicksand/wght.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "@fontsource-variable/plus-jakarta-sans/wght-italic.css";
import "@fontsource-variable/playwrite-us-trad/wght.css";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { initAnalytics } from "./lib/analytics.js";

initAnalytics();

createRoot(document.getElementById("root")).render(<App />);
