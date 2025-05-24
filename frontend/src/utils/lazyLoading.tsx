/**
 * Utilități pentru încărcarea lazy a componentelor
 * 
 * Acest fișier oferă funcții helper pentru a implementa încărcarea lazy
 * a componentelor React, folosind Suspense și ErrorBoundary.
 */

import React, { lazy, Suspense, ComponentType, ReactNode } from 'react';

// Componentul de loading implicit
const DefaultLoader = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Componentul de eroare implicit
const DefaultErrorFallback = ({ error }: { error: Error }) => (
  <div className="bg-red-50 border border-red-200 rounded p-4 m-2">
    <h3 className="text-red-800 font-medium">A apărut o eroare</h3>
    <p className="text-red-600 text-sm">{error.message}</p>
  </div>
);

/**
 * Boundary pentru erori
 * Captează erorile din componente și afișează un fallback
 */
interface ErrorBoundaryProps {
  fallback: ComponentType<{ error: Error }>;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Eroare în componenta React:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      const { fallback: Fallback } = this.props;
      return <Fallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

/**
 * Opțiuni pentru încărcarea lazy a componentelor
 */
interface LazyLoadOptions {
  /** Componentul de afișat în timpul încărcării */
  loader?: ComponentType;
  /** Componentul de afișat în caz de eroare */
  errorFallback?: ComponentType<{ error: Error }>;
  /** Dacă să includă automatic ErrorBoundary */
  withErrorBoundary?: boolean;
  /** Delay minim pentru loader (ms), util pentru a evita flash-uri de loading */
  minDelay?: number;
}

/**
 * Încarcă lazy un component React cu Suspense și ErrorBoundary opțional
 * 
 * @example
 * const LazyComponent = lazyLoad(() => import('./HeavyComponent'));
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): React.ComponentType<React.ComponentProps<T>> {
  const {
    loader: Loader = DefaultLoader,
    errorFallback: ErrorFallbackComponent = DefaultErrorFallback,
    withErrorBoundary = true,
    minDelay = 0
  } = options;

  // Adăugăm delay minim dacă este specificat
  const importWithDelay = async () => {
    const start = Date.now();
    const Component = await importFn();
    
    // Dacă încărcarea a fost mai rapidă decât minDelay, așteptăm
    const elapsed = Date.now() - start;
    if (minDelay && elapsed < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - elapsed));
    }
    
    return Component;
  };

  // Creăm componentul lazy
  const LazyComponent = lazy(importWithDelay);

  // Returnam componentul cu Suspense și opțional ErrorBoundary
  return (props: React.ComponentProps<T>) => {
    const Wrapped = (
      <Suspense fallback={<Loader />}>
        <LazyComponent {...props} />
      </Suspense>
    );

    if (withErrorBoundary) {
      return (
        <ErrorBoundary fallback={ErrorFallbackComponent}>
          {Wrapped}
        </ErrorBoundary>
      );
    }

    return Wrapped;
  };
}

/**
 * Încarcă lazy un grup de componente, util pentru codesplitting pe module/secțiuni
 * 
 * @example
 * const { UserList, UserDetails } = lazyLoadComponents({
 *   UserList: () => import('./UserList'),
 *   UserDetails: () => import('./UserDetails')
 * });
 */
export function lazyLoadComponents<T extends Record<string, () => Promise<{ default: ComponentType<any> }>>>(
  componentMap: T,
  options: LazyLoadOptions = {}
): { [K in keyof T]: React.ComponentType<any> } {
  const result: Record<string, React.ComponentType<any>> = {};

  for (const key in componentMap) {
    result[key] = lazyLoad(componentMap[key], options);
  }

  return result as { [K in keyof T]: React.ComponentType<any> };
}

/**
 * Preîncarcă un component fără a-l renderiza
 * Util pentru a anticipa navigarea utilizatorului
 */
export function preloadComponent(importFn: () => Promise<{ default: ComponentType<any> }>): void {
  importFn().catch(error => {
    console.warn('Preîncărcarea componentului a eșuat:', error);
  });
}

/**
 * Hook pentru a preîncărca mai multe componente bazat pe rutele posibile
 * 
 * @example
 * usePrefetchRoutes([
 *   { path: '/dashboard', component: () => import('./Dashboard') },
 *   { path: '/settings', component: () => import('./Settings') }
 * ]);
 */
export function usePrefetchRoutes(
  routes: Array<{ path: string; component: () => Promise<{ default: ComponentType<any> }> }>,
  prefetchAll: boolean = false
): void {
  React.useEffect(() => {
    // Dacă prefetchAll e true, preîncărcăm toate componentele imediat
    if (prefetchAll) {
      routes.forEach(route => {
        preloadComponent(route.component);
      });
      return;
    }

    // Altfel, preîncărcăm doar când utilizatorul face hover pe link-uri
    const handleLinkHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const closestLink = target.closest('a');
      
      if (closestLink) {
        const href = closestLink.getAttribute('href');
        if (href) {
          const matchingRoute = routes.find(route => {
            // Verificăm dacă href-ul link-ului corespunde cu path-ul rutei
            return href === route.path || href.startsWith(`${route.path}/`);
          });

          if (matchingRoute) {
            preloadComponent(matchingRoute.component);
          }
        }
      }
    };

    // Adăugăm un listener de hover pentru document
    document.addEventListener('mouseover', handleLinkHover);

    return () => {
      document.removeEventListener('mouseover', handleLinkHover);
    };
  }, [routes, prefetchAll]);
} 
