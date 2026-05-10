import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { AnalyzerProvider } from './context/AnalyzerContext';
import { CookieConsent } from './components/CookieConsent';
import { router } from './routes';

export default function App() {
  useEffect(() => {
    // Ye line browser ko pichli scroll position bhulne ko kehti hai
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Aur refresh pe hamesha upar le aati hai
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuthProvider>
      <AnalyzerProvider>
        <RouterProvider router={router} />
        <CookieConsent />
      </AnalyzerProvider>
    </AuthProvider>
  );
}