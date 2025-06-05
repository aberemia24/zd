import { useEffect, useCallback } from 'react';

/**
 * 🚀 SENTRY PERFORMANCE MONITORING HOOK
 * 
 * Hook pentru integrarea cu Sentry pentru:
 * - Performance monitoring
 * - Error tracking
 * - User experience metrics
 * - Custom performance metrics
 */

interface SentryTransaction {
  name: string;
  op: string;
  startTimestamp?: number;
  endTimestamp?: number;
  data?: Record<string, any>;
}

interface PerformanceMetrics {
  fcp?: number;  // First Contentful Paint
  lcp?: number;  // Largest Contentful Paint
  cls?: number;  // Cumulative Layout Shift
  fid?: number;  // First Input Delay
  ttfb?: number; // Time to First Byte
}

export function useSentryPerformance() {
  const isSentryEnabled = process.env.NODE_ENV === 'production' && 
                         process.env.REACT_APP_SENTRY_DSN;

  // Initialize Sentry performance monitoring
  useEffect(() => {
    if (!isSentryEnabled) {
      console.log('Sentry disabled in development');
      return;
    }

    // Initialize Sentry SDK (ar fi importat din @sentry/react)
    // Sentry.init({
    //   dsn: process.env.REACT_APP_SENTRY_DSN,
    //   integrations: [
    //     new Sentry.BrowserTracing(),
    //   ],
    //   tracesSampleRate: 0.1, // Sample 10% of transactions
    //   environment: process.env.NODE_ENV,
    // });

    console.log('Sentry performance monitoring initialized');
  }, [isSentryEnabled]);

  /**
   * Măsoară performanța unei operațiuni cu Sentry
   */
  const measureTransaction = useCallback(
    (name: string, operation: string, fn: () => any): any => {
      if (!isSentryEnabled) {
        return fn();
      }

      const startTime = performance.now();
      
      try {
        // În producție ar fi:
        // const transaction = Sentry.startTransaction({ name, op: operation });
        // Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));
        
        const result = fn();
        
        if (result instanceof Promise) {
          return result.then((value) => {
            const endTime = performance.now();
            console.log(`[Sentry] Transaction ${name} completed in ${(endTime - startTime).toFixed(2)}ms`);
            // transaction.finish();
            return value;
          }).catch((error) => {
            // Sentry.captureException(error);
            // transaction.setStatus('internal_error');
            // transaction.finish();
            console.error(`[Sentry] Transaction ${name} failed:`, error);
            throw error;
          });
        } else {
          const endTime = performance.now();
          console.log(`[Sentry] Transaction ${name} completed in ${(endTime - startTime).toFixed(2)}ms`);
          // transaction.finish();
          return result;
        }
      } catch (error) {
        // Sentry.captureException(error);
        console.error(`[Sentry] Transaction ${name} failed:`, error);
        throw error;
      }
    },
    [isSentryEnabled]
  );

  /**
   * Măsoară o operațiune UI cu context
   */
  const measureUserInteraction = useCallback(
    (action: string, element: string, fn: () => void) => {
      return measureTransaction(
        `ui.${action}`,
        'ui.action',
        () => {
          // Adaugă context pentru debugging
          const context = {
            element,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href,
          };
          
          console.log(`[Sentry] User interaction: ${action} on ${element}`, context);
          
          return fn();
        }
      );
    },
    [measureTransaction]
  );

  /**
   * Măsoară performanța unei cereri API
   */
  const measureApiCall = useCallback(
    async <T>(endpoint: string, request: () => Promise<T>): Promise<T> => {
      return measureTransaction(
        `api.${endpoint}`,
        'http.client',
        async () => {
          const startTime = performance.now();
          
          try {
            const result = await request();
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            // Log performance metrics
            console.log(`[Sentry] API call to ${endpoint} completed in ${duration.toFixed(2)}ms`);
            
            // În producție ar fi:
            // Sentry.addBreadcrumb({
            //   category: 'api',
            //   message: `${endpoint} - ${duration.toFixed(2)}ms`,
            //   level: 'info',
            //   data: { endpoint, duration }
            // });
            
            return result;
          } catch (error) {
            // Sentry.captureException(error, {
            //   tags: { endpoint },
            //   extra: { endpoint, error: error.message }
            // });
            console.error(`[Sentry] API call to ${endpoint} failed:`, error);
            throw error;
          }
        }
      );
    },
    [measureTransaction]
  );

  /**
   * Colectează Web Vitals metrics pentru Sentry
   */
  const collectWebVitals = useCallback(() => {
    if (!isSentryEnabled) return;

    // În producție ar folosi web-vitals library:
    // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
    
    const metrics: PerformanceMetrics = {};
    
    // Mock pentru development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Sentry] Collecting Web Vitals (mocked in development)');
      return;
    }

    // În producție:
    // getCLS((metric) => {
    //   metrics.cls = metric.value;
    //   Sentry.setTag('cls', metric.value < 0.1 ? 'good' : 'poor');
    // });
    
    // getFID((metric) => {
    //   metrics.fid = metric.value;
    //   Sentry.setTag('fid', metric.value < 100 ? 'good' : 'poor');
    // });
    
    // getFCP((metric) => {
    //   metrics.fcp = metric.value;
    //   Sentry.setTag('fcp', metric.value < 1800 ? 'good' : 'poor');
    // });
    
    // getLCP((metric) => {
    //   metrics.lcp = metric.value;
    //   Sentry.setTag('lcp', metric.value < 2500 ? 'good' : 'poor');
    // });
    
    // getTTFB((metric) => {
    //   metrics.ttfb = metric.value;
    //   Sentry.setTag('ttfb', metric.value < 800 ? 'good' : 'poor');
    // });

    console.log('[Sentry] Web Vitals collected:', metrics);
  }, [isSentryEnabled]);

  /**
   * Setează user context pentru Sentry
   */
  const setUserContext = useCallback((userId: string, email?: string) => {
    if (!isSentryEnabled) return;

    // În producție:
    // Sentry.setUser({ id: userId, email });
    console.log(`[Sentry] User context set: ${userId}`, { email });
  }, [isSentryEnabled]);

  /**
   * Capturează o eroare custom cu context
   */
  const captureError = useCallback((error: Error, context?: Record<string, any>) => {
    if (!isSentryEnabled) {
      console.error('[Sentry] Error captured (development):', error, context);
      return;
    }

    // În producție:
    // Sentry.captureException(error, {
    //   extra: context,
    //   tags: { component: 'performance-monitoring' }
    // });
    console.error('[Sentry] Error captured:', error, context);
  }, [isSentryEnabled]);

  /**
   * Măsoară timpul de încărcare a unei pagini
   */
  const measurePageLoad = useCallback((pageName: string) => {
    if (!isSentryEnabled) return;

    return measureTransaction(
      `pageload.${pageName}`,
      'navigation',
      () => {
        // Colectează metrici de încărcare
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (perfData) {
          const metrics = {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
            loadComplete: perfData.loadEventEnd - perfData.fetchStart,
            ttfb: perfData.responseStart - perfData.fetchStart,
          };
          
          console.log(`[Sentry] Page load metrics for ${pageName}:`, metrics);
          
          // În producție ar trimite la Sentry:
          // Sentry.setContext('page_load', metrics);
        }
      }
    );
  }, [measureTransaction, isSentryEnabled]);

  // Colectează Web Vitals la mount
  useEffect(() => {
    collectWebVitals();
  }, [collectWebVitals]);

  return {
    measureTransaction,
    measureUserInteraction,
    measureApiCall,
    measurePageLoad,
    setUserContext,
    captureError,
    collectWebVitals,
    isEnabled: isSentryEnabled,
  };
}

export default useSentryPerformance; 