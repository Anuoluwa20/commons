import { useSyncExternalStore } from 'react';
import { getPath, subscribe } from './routes';
export const usePathname = () => useSyncExternalStore(subscribe, getPath, () => '/');
export const useRouter = () => ({ push: h => { location.hash = h; } });
