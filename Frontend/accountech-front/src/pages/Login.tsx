import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      {/* GAUCHE : Image de Branding (Remplace tout le contenu précédent) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
        <img
          src="/login-illustration.png" // Place ton image dans le dossier 'public' avec ce nom
          alt="AccountTech AI Branding"
          className="w-full h-full object-cover"
        />
        {/* Optionnel : un léger voile sombre si l'image est trop claire */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      {/* DROITE : Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              Connexion
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              Accédez à votre espace comptable
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-cyan-600 mb-2 italic">
                "Le maître du jeu, c'est vous."
              </label>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="mouhamadoumansoursow123@gmail.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-gray-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all bg-gray-50/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-medium">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  defaultChecked
                />
                Se souvenir de moi
              </label>
              <a
                href="#"
                className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-200 transition-all active:scale-[0.98] mt-2"
            >
              Se Connecter
            </button>
          </form>

          <div className="mt-10 text-center">
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
                Ou
              </span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>
            <p className="text-gray-600 mt-4">
              Vous n'avez pas de compte ?{" "}
              <a
                href="#"
                className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors"
              >
                Créer un compte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
