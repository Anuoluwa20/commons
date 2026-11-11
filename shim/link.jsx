import { forwardRef } from 'react';
import { split, hashFor, getPath } from './routes';
import { go } from './go';

/* Stand-in for next/link in the preview build. */
const Link = forwardRef(function Link({ href, onClick, children, ...rest }, ref) {
  const { path, anchor } = split(href);
  const target = path ?? getPath();
  const h = anchor && target === getPath() ? '#' + anchor : hashFor(target);
  const handle = e => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    go(target, anchor);
  };
  return <a ref={ref} href={h} onClick={handle} {...rest}>{children}</a>;
});
export default Link;
