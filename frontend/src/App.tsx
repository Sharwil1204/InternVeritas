import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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
      <RouterProvider router={router} />
    </AuthProvider>
  );
}