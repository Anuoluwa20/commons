'use client';
import { MotionProvider, MotionRoot } from './Motion';
import { ToastProvider } from './Toast';
import { RSVPProvider } from './RSVP';
import { Header, Footer, StickyRSVP } from './Chrome';

export default function Shell({ children }) {
  return (
    <MotionProvider>
      <ToastProvider>
        <RSVPProvider>
          <a className="skip" href="#main">Skip to content</a>
          <Header />
          {children}
          <Footer />
          <StickyRSVP />
          <MotionRoot />
        </RSVPProvider>
      </ToastProvider>
    </MotionProvider>
  );
}
