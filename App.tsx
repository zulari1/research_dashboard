import React, { useState, useEffect, useCallback } from 'react';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, SUBMIT_RESEARCH_URL, GET_RESEARCH_URL } from './constants';
import type { AppUser, ResearchResult, ResearchRequestPayload } from './types';
import Header from './components/Header';
import ResearchForm from './components/ResearchForm';
import ResearchResults from './components/ResearchResults';
import Spinner from './components/Spinner';

// Initialize Auth0 client outside component to avoid re-creation
const auth0Client = new Auth0Client({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin
  },
  // Use localstorage to persist session across redirects
  cacheLocation: 'localstorage',
  useRefreshTokens: true
});

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [researchResults, setResearchResults] = useState<ResearchResult[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Handle the redirect callback if the user is returning from Auth0
        if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
            await auth0Client.handleRedirectCallback();
            // Clean up the URL
            window.history.replaceState({}, document.title, "/");
        }

        // Check if the user is authenticated
        const isAuth = await auth0Client.isAuthenticated();
        setIsAuthenticated(isAuth);
        if (isAuth) {
          const userData = await auth0Client.getUser();
          setUser(userData || null);
        }
      } catch (e) {
        console.error('Authentication process failed', e);
        setError('Authentication process failed.');
      } finally {
        setIsAuthLoading(false);
      }
    };
    handleAuth();
  }, []);

  const fetchUserResearch = useCallback(async () => {
    if (!user?.email) return;

    setIsLoadingResults(true);
    try {
      const response = await fetch(GET_RESEARCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch research data.');
      }
      const data: ResearchResult[] = await response.json();
      setResearchResults(data);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('Could not load research results. Please try again later.');
    } finally {
      setIsLoadingResults(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchUserResearch(); // Initial fetch
      const intervalId = setInterval(fetchUserResearch, 30000); // Poll every 30 seconds

      return () => clearInterval(intervalId); // Cleanup interval on logout or unmount
    } else {
      setResearchResults([]); // Clear results on logout
    }
  }, [isAuthenticated, user, fetchUserResearch]);

  const handleLogin = async () => {
    try {
      await auth0Client.loginWithRedirect();
    } catch (e) {
      console.error('Login failed', e);
      setError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleResearchSubmit = async (formData: Omit<ResearchRequestPayload, 'email'>) => {
    if (!user?.email) {
      setError('You must be logged in to submit research.');
      return false;
    }

    const payload: ResearchRequestPayload = {
      ...formData,
      email: user.email,
    };

    try {
      const response = await fetch(SUBMIT_RESEARCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit research request.');
      }
      // Assuming submission is successful, refresh the results immediately
      fetchUserResearch();
      return true; // Indicate success
    } catch (e) {
      console.error(e);
      setError('Failed to submit research. Please try again.');
      return false; // Indicate failure
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header
        user={user}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {isAuthenticated ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-1">
              <ResearchForm onSubmit={handleResearchSubmit} />
            </div>
            <div className="lg:col-span-2">
              <ResearchResults results={researchResults} isLoading={isLoadingResults} />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to Zolari</h1>
            <p className="text-xl text-slate-600 mb-8">Your AI-Powered Research Co-pilot</p>
            <button
              onClick={handleLogin}
              className="bg-primary-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-primary-700 transition-colors"
            >
              Log In to Get Started
            </button>
          </div>
        )}
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;