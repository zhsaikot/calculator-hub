import { useState, useEffect, useCallback } from 'react';
import { CalculatorId } from '../lib/calculators/types';

export interface RouteState {
  calculatorId: CalculatorId | 'home';
  params: URLSearchParams;
}

export function useHashRoute() {
  const parseHash = (): RouteState => {
    const rawHash = window.location.hash.replace(/^#\/?/, '');
    const [pathPart, queryPart] = rawHash.split('?');
    const calculatorId = (pathPart || 'home') as CalculatorId | 'home';
    const params = new URLSearchParams(queryPart || '');
    return { calculatorId, params };
  };

  const [route, setRoute] = useState<RouteState>(parseHash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((id: CalculatorId | 'home', newParams?: Record<string, string | number>) => {
    let newHash = id === 'home' ? '' : `#/${id}`;
    if (newParams && Object.keys(newParams).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(newParams).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          searchParams.set(k, String(v));
        }
      });
      const q = searchParams.toString();
      if (q) newHash += `?${q}`;
    }
    window.location.hash = newHash;
  }, []);

  return { route, navigateTo };
}
