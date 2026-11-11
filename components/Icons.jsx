const svg = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };

export const Logo = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <circle cx="32" cy="32" r="15" fill="#FF5B1F" />
    <g className="logo-seats" fill="currentColor">
      {[[32, 7], [49.7, 14.3], [57, 32], [49.7, 49.7], [32, 57], [14.3, 49.7], [7, 32], [14.3, 14.3]].map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r="5" />)}
    </g>
  </svg>
);
export const Arrow = () => <svg {...svg} strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const Close = () => <svg {...svg} strokeWidth="2.2"><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const Menu = () => <svg {...svg} strokeWidth="2.2"><path d="M4 8h16M4 16h16" /></svg>;
export const Cal = () => <svg {...svg}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;
export const Share = () => <svg {...svg}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" /></svg>;
export const Users = () => <svg {...svg}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6" /></svg>;
export const Mic = () => <svg {...svg}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>;
export const Cup = () => <svg {...svg}><path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2M12 3v2" /></svg>;
export const Plus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
export const Pause = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>;
export const Play = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5l12 7-12 7z" /></svg>;
