
import React, { useState } from 'react';
import { Lock, User, LogIn, UserPlus } from 'lucide-react';
import { UserRole } from '../types';
import { supabase } from '../services/supabase';
import useStore from '../store/store';

const Login: React.FC = () => {
  const { login } = useStore();
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSuccess = (token: string, role: UserRole, username: string) => {
    login(token, role, username);
    // Force a redirect to ensure the app state re-evaluates correctly.
    // This is a robust way to avoid race conditions in the complex App.tsx.
    if (role === 'admin') {
      window.location.href = '/#admin';
    } else if (role === 'kitchen') {
      window.location.href = '/#kitchen';
    } else {
      window.location.href = '/#customer-dashboard';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const email = username.includes('@') ? username : `${username}@sushivision.local`;

      if (isLoginView) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session && data.user) {
          const userRole = data.user.user_metadata.role as UserRole;
          const userName = data.user.user_metadata.username || username;

          if (!userRole) {
            throw new Error("Gebruikersrol niet gevonden. Neem contact op met de beheerder.");
          }
          
          handleAuthSuccess(data.session.access_token, userRole, userName);
        }
      } else {
        const role: UserRole = 'customer';
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
                role: role,
                username: username
            }
          }
        });

        if (error) throw error;
        
        setMessage('Registratie succesvol! Je wordt nu doorgestuurd.');
        if (data.session && data.user) {
             handleAuthSuccess(data.session.access_token, role, username);
        } else {
             setMessage('Registratie succesvol! Controleer je email (indien nodig) en log daarna in.');
             setIsLoginView(true);
        }
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || "Er is een fout opgetreden.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white font-serif">SushiVision AR</h1>
          <p className="text-gray-400">{isLoginView ? 'Login to your account' : 'Create an Account'}</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Gebruikersnaam"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sushi-gold transition"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Wachtwoord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sushi-gold transition"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center bg-red-900/30 py-2 rounded-lg">{error}</p>}
            {message && <p className="text-green-400 text-sm text-center bg-green-900/30 py-2 rounded-lg">{message}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-bold rounded-lg transition-colors disabled:bg-gray-600 flex items-center justify-center gap-2 bg-sushi-gold hover:bg-yellow-400 text-black"
            >
              {isLoading ? 'Laden...' : (isLoginView ? <><LogIn size={18}/> Login</> : <><UserPlus size={18}/> Registreer</>)}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError(null);
                setMessage(null);
              }}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              {isLoginView ? "Nog geen account? Registreer hier" : "Heb je al een account? Login"}
            </button>
          </div>
        </div>
         <a href="/#menu" className="block text-center mt-8 text-gray-500 hover:text-gray-300 transition">&larr; Terug naar menu</a>
      </div>
    </div>
  );
};

export default Login;
