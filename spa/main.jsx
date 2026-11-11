import { createRoot } from 'react-dom/client';
import { useSyncExternalStore, useEffect } from 'react';
import '../styles/site.css';
import '../styles/variants.css';
import '../styles/motion.css';
import '../styles/react.css';
import Shell from '../components/Shell';
import Home from '../components/pages/Home';
import Events from '../components/pages/Events';
import Event from '../components/pages/Event';
import Speakers from '../components/pages/Speakers';
import About from '../components/pages/About';
import Sponsors from '../components/pages/Sponsors';
import { getPath, subscribe, NAMES, setPath } from '../shim/routes';
import { fromHash } from '../shim/go';

const PAGES = { '/': Home, '/events': Events, '/events/24': Event, '/speakers': Speakers, '/about': About, '/sponsors': Sponsors };
const TITLES = { '/': 'Commons #24: Design in the Age of AI', '/events': 'Events · Commons', '/events/24': 'Commons #24 · RSVP', '/speakers': 'Speakers · Commons', '/about': 'About · Commons', '/sponsors': 'Sponsor Commons' };

// Start on the route named in the hash, if any.
const first = location.hash.slice(1);
if (NAMES[first]) setPath(NAMES[first]);

function App() {
  const path = useSyncExternalStore(subscribe, getPath);
  const Page = PAGES[path] || Home;
  useEffect(() => { document.title = TITLES[path] || TITLES['/']; }, [path]);
  useEffect(() => {
    // In-page hash links (#speak, #contact, #main…) scroll instead of routing.
    const onClick = e => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a || e.defaultPrevented || a.getAttribute('href') === '#rsvp') return;
      const id = a.getAttribute('href').slice(1);
      if (!id || NAMES[id]) return;
      e.preventDefault();
      history.replaceState(null, '', '#' + (Object.entries(NAMES).find(([, p]) => p === getPath())?.[0] || 'home'));
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
    };
    document.addEventListener('click', onClick);
    addEventListener('hashchange', fromHash);
    addEventListener('popstate', fromHash);
    return () => { document.removeEventListener('click', onClick); removeEventListener('hashchange', fromHash); removeEventListener('popstate', fromHash); };
  }, []);
  return <Shell><Page key={path} /></Shell>;
}

createRoot(document.getElementById('root')).render(<App />);
