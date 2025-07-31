
import React from 'react';
import type { AppUser } from '../types';
import ZolariLogo from './icons/ZolariLogo';

interface HeaderProps {
  user: AppUser | null;
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, isAuthenticated, onLogin, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            <ZolariLogo className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">Zolari</span>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center space-x-2">
                   {user?.picture && <img src={user.picture} alt="Profile" className="h-8 w-8 rounded-full" />}
                   <span className="text-sm font-medium text-slate-600">{user?.email}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="bg-primary-600 text-white font-bold py-2 px-4 rounded-md text-sm hover:bg-primary-700 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
