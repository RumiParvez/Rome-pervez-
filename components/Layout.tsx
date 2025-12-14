
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { IconLogo, IconMenu } from './Icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { APP_NAME } from '../constants';

export const MainLayout: React.FC = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  // Check if we are on the chat page to hide Header/Footer globally
  const isChatPage = location.pathname === '/chat';

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Navbar - Hidden on Chat Page */}
      {!isChatPage && (
        <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                     <IconLogo className="text-white w-5 h-5" />
                  </div>
                  <span className="font-bold text-xl tracking-tight text-white">{APP_NAME}</span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link to="/" className="hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                  <Link to="/chat" className="hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Chat</Link>
                  <Link to="/about" className="hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
                  <Link to="/pricing" className="hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Pricing</Link>
                  
                  <div className="flex items-center gap-4 ml-4">
                       <Link to="/admin" className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-900/50 bg-red-900/10 px-3 py-1 rounded-full uppercase tracking-wider">
                          Admin Panel
                       </Link>
                       <div className="flex items-center gap-2 bg-gray-900 rounded-full pl-2 pr-4 py-1 border border-gray-800">
                           {user && <img src={user.avatar} alt="User" className="w-6 h-6 rounded-full" />}
                           <span className="text-sm text-gray-300 truncate max-w-[100px]">{user?.name || 'Guest'}</span>
                       </div>
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 focus:outline-none">
                  <IconMenu className="block h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-gray-900 pb-3 px-2">
               <Link to="/" className="block hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium text-green-400">Home</Link>
               <Link to="/chat" className="block hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium">Chat</Link>
               <Link to="/pricing" className="block hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium">Pricing</Link>
               <Link to="/about" className="block hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium">About</Link>
               <Link to="/admin" className="block hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium text-red-400">Admin Panel</Link>
            </div>
          )}
        </nav>
      )}

      {/* Content */}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      {/* Footer - Hidden on Chat Page */}
      {!isChatPage && (
        <footer className="bg-black border-t border-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} {APP_NAME}. Powered by Openyhool. 
                <span className="mx-2">|</span>
                <Link to="/admin" className="hover:text-gray-300 transition-colors">Admin</Link>
              </p>
          </div>
        </footer>
      )}
    </div>
  );
};
