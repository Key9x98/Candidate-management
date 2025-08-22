import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import your page components
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route: Login Page */}
          {/* Anyone can access this route. */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          {/* This route uses the ProtectedRoute component as a wrapper. */}
          {/* Only authenticated users can access nested routes. */}
          <Route path="/" element={<ProtectedRoute />}>
            {/* The DashboardPage will only be rendered if the user is logged in. */}
            {/* 'index' means this is the default route for the parent '/'. */}
            <Route index element={<DashboardPage />} />
            {/* You can add more protected routes here, e.g., /settings, /profile */}
            {/* <Route path="settings" element={<SettingsPage />} /> */}
          </Route>
          
          {/* Redirect from root to dashboard if authenticated, handled by ProtectedRoute */}
          {/* This ensures that visiting "/" automatically goes to the dashboard if logged in. */}
           <Route path="/" element={<Navigate to="/" replace />} />


          {/* 404 Not Found Route */}
          {/* The "*" path matches any URL that hasn't been matched by the routes above. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;