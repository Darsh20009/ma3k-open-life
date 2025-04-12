import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set the direction to RTL for Arabic language support
document.documentElement.dir = "rtl";
document.documentElement.lang = "ar";

// Add meta tags for proper viewport
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1';
document.getElementsByTagName('head')[0].appendChild(meta);

// Add title
const titleElement = document.createElement('title');
titleElement.textContent = 'Open Life - محادثة الذكاء الاصطناعي';
document.getElementsByTagName('head')[0].appendChild(titleElement);

// Render the application
createRoot(document.getElementById("root")!).render(<App />);
