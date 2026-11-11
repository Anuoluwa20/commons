import Link from 'next/link';
export default function NotFound() {
  return <main id="main"><section className="page-head"><div className="wrap"><span className="eyebrow"><span className="dot"></span>404</span><h1>This seat’s empty</h1><p className="lead">The page you’re after isn’t here. The next event is.</p><Link className="btn" href="/events/24" style={{ marginTop: 'var(--space-6)' }}>See Commons #24</Link></div></section></main>;
}
