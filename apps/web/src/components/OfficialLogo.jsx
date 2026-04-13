import React from "react";

const OFFICIAL_LOGO_WHITE = "/dark.svg";
const OFFICIAL_LOGO_BLACK = "/light.svg";

export { OFFICIAL_LOGO_WHITE, OFFICIAL_LOGO_BLACK };

export default function OfficialLogo({ theme = 'dark', size = 32, className = "" }) {
  const src = theme === 'light' ? OFFICIAL_LOGO_BLACK : OFFICIAL_LOGO_WHITE;
  return (
    <div className={`flex items-center justify-center transition-all duration-500 ${className}`}>
      <img src={src} alt="SAM Compiler" style={{ width: size, height: size }} />
    </div>
  );
}
