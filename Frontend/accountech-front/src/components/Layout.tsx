import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Menu latéral fixe */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barre du haut (Header) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800 tracking-tight">
              Tableau de bord
            </h2>
            <span className="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
              Entreprise
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 leading-none">
                M. Mansour SOW
              </p>
              <p className="text-[10px] text-gray-500 font-medium">
                Administrateur
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
              MS
            </div>
          </div>
        </header>

        {/* Zone de défilement du contenu des pages */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
};
