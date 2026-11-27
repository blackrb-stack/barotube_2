// Polyfills for older browsers (Android 5.0-7.0, iOS 12)
import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Browser compatibility check
const isSupportedBrowser = () => {
  const ua = navigator.userAgent;
  
  // Check for very old browsers
  const isOldAndroid = /Android.*Chrome\/([0-9]+)/.exec(ua);
  if (isOldAndroid && parseInt(isOldAndroid[1]) < 63) {
    return false;
  }
  
  const isOldiOS = /iPhone.*OS ([0-9]+)_/.exec(ua);
  if (isOldiOS && parseInt(isOldiOS[1]) < 12) {
    return false;
  }
  
  const isOldIE = /MSIE|Trident/.test(ua);
  if (isOldIE) {
    return false;
  }
  
  return true;
};

if (!isSupportedBrowser()) {
  document.body.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: sans-serif; background: #0f0f0f; color: white; min-height: 100vh;">
      <h1 style="color: #dc2626;">브라우저 업데이트 필요</h1>
      <p style="margin: 20px 0; font-size: 18px;">
        BaroTube를 사용하려면 브라우저나 WebView를 업데이트해주세요.
      </p>
      <div style="margin: 30px 0; padding: 20px; background: #1a1a1a; border-radius: 12px; text-align: left;">
        <h3>지원되는 브라우저:</h3>
        <ul style="line-height: 2; margin-top: 10px;">
          <li>Chrome 63 이상</li>
          <li>Firefox 67 이상</li>
          <li>Safari 12 이상</li>
          <li>Edge 79 이상</li>
        </ul>
      </div>
      <p style="color: #888; font-size: 14px;">
        Android 5.0-6.0: Play Store에서 Chrome WebView를 업데이트하세요.<br>
        Android 7.0+: 기본 브라우저를 최신 버전으로 업데이트하세요.
      </p>
    </div>
  `;
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
}
