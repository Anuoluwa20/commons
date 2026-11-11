'use client';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const [on, setOn] = useState(false);
  const t = useRef();
  const toast = useCallback(m => {
    setMsg(m); setOn(true);
    clearTimeout(t.current); t.current = setTimeout(() => setOn(false), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className={`toast${on ? ' is-on' : ''}`} role="status">{msg}</div>
    </ToastCtx.Provider>
  );
}

export async function copyText(txt, toast) {
  try { await navigator.clipboard.writeText(txt); }
  catch {
    const ta = document.createElement('textarea'); ta.value = txt; document.body.append(ta); ta.select();
    try { document.execCommand('copy'); } catch {}
    ta.remove();
  }
  toast?.('Link copied');
}
