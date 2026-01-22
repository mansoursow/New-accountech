import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Truck,
  Wallet,
  Landmark,
  FileText,
  Sparkles,
  ChevronDown,
  X,
  Menu,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
  { icon: ShoppingCart, label: "Ventes", path: "/ventes" },
  { icon: Users, label: "Clients", path: "/clients" },
  { icon: Package, label: "Achats", path: "/achats" },
  { icon: Truck, label: "Fournisseurs", path: "/fournisseurs" },
  { icon: Wallet, label: "Caisse", path: "/caisse" },
  { icon: Landmark, label: "Banque", path: "/bank" },
  { icon: FileText, label: "Écritures comptables", path: "/ecritures" },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <style>
        {`
          .nice-scrollbar::-webkit-scrollbar { width: 10px; }
          .nice-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 10px; }
          .nice-scrollbar::-webkit-scrollbar-thumb { 
            background: rgba(255, 255, 255, 0.2); 
            border-radius: 10px; 
            border: 2px solid transparent;
            background-clip: padding-box;
          }
        `}
      </style>

      <div
        className={`${
          isCollapsed ? "w-20" : "w-72"
        } h-screen bg-[#0f172a] text-slate-300 flex flex-col border-r border-white/5 transition-all duration-300 shadow-2xl relative`}
      >
        {/* SECTION LOGO + BOUTON X DÉPLACÉ */}
        <div className="p-4 relative">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              {/* Cadre du Logo - Maintenant dédié uniquement à l'image */}
              <div className="bg-white rounded-xl h-16 flex-1 flex items-center justify-center overflow-hidden shadow-lg border border-white/10">
                <img
                  src="/logo-sidebar.png"
                  alt="Logo"
                  className="w-[120%] h-[120%] object-cover transform scale-110"
                />
              </div>

              {/* Bouton X déplacé à droite, hors du cadre blanc */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            /* Mode réduit : Le menu est centré */
            <div className="h-16 flex items-center justify-center">
              <button
                onClick={() => setIsCollapsed(false)}
                className="p-3 rounded-xl bg-white text-[#0f172a] shadow-lg hover:scale-105 transition-transform"
              >
                <Menu size={24} />
              </button>
            </div>
          )}
        </div>

        {/* SÉLECTEUR D'ENTITÉ */}
        <div className="px-4 mb-4 mt-2">
          <button
            className={`w-full bg-[#1e293b]/80 p-3 rounded-xl flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            } border border-white/5`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/20">
                🏢
              </div>
              {!isCollapsed && (
                <span className="text-blue-400 font-bold text-sm tracking-wide">
                  Personnel
                </span>
              )}
            </div>
            {!isCollapsed && (
              <ChevronDown size={14} className="text-slate-500" />
            )}
          </button>
        </div>

        {/* MENU DE NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto nice-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center ${
                  isCollapsed ? "justify-center" : "gap-3"
                } p-3.5 rounded-xl transition-all group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "hover:bg-white/5 text-slate-400"
                }`}
              >
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-slate-300"
                  }
                />
                {!isCollapsed && (
                  <span className="text-[13.5px] font-bold">{item.label}</span>
                )}
              </button>
            );
          })}

          <button
            className={`w-full flex items-center ${
              isCollapsed ? "justify-center" : "gap-3"
            } p-3.5 mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl hover:brightness-110 transition-all`}
          >
            <Sparkles size={20} />
            {!isCollapsed && (
              <span className="text-sm font-black uppercase tracking-wider">
                Assistant IA
              </span>
            )}
          </button>
        </nav>

        {/* UTILISATEUR EN BAS */}
        <div className="p-4 border-t border-white/5 bg-[#0a0f1d]">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-sm border-2 border-white/10 shadow-lg">
                M
              </div>
              {!isCollapsed && (
                <div className="text-left">
                  <p className="text-sm font-black text-white leading-none">
                    M. Mansour SOW
                  </p>
                  <p className="text-[10px] text-blue-400 font-bold uppercase mt-1">
                    Admin
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
