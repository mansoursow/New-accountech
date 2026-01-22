import React from "react";
import {
  Wallet,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Layout } from "../components/Layout";

// Carte au style "Soft" avec bordure bleue latérale
const StatCard = ({ title, value, unit, icon: Icon, colorClass }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden group hover:shadow-md transition-shadow relative">
    {/* La barre bleue distinctive à gauche */}
    <div className={`w-1.5 ${colorClass}`}></div>
    <div className="p-6 flex-1 flex items-center justify-between">
      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-800">{value}</h3>
          <span className="text-xs font-bold text-slate-400">{unit}</span>
        </div>
        {/* Ligne bleue de progression sous le chiffre */}
        <div className="w-full h-1 bg-gray-50 mt-4 rounded-full overflow-hidden">
          <div
            className={`h-full ${colorClass.replace(
              "bg-",
              "bg-"
            )} opacity-60 w-3/4`}
          ></div>
        </div>
      </div>
      <div
        className={`p-4 rounded-full border-2 border-gray-50 text-blue-600 bg-blue-50/50`}
      >
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION PERSONNEL */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4 border-l-4 border-blue-600 pl-4">
            <div className="bg-slate-800 p-2 rounded-lg text-white">🏢</div>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">
                Personnel
              </h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase mt-1">
                Gestion financière
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-black">
                M
              </div>
              <span className="text-xs font-bold text-blue-900">
                M. MANSOUR SOW
              </span>
              <ChevronDown size={14} className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* GRILLE DE STATS SOFT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Solde Caisse"
            value="-5100"
            unit="XOF"
            icon={Wallet}
            colorClass="bg-blue-600"
          />
          <StatCard
            title="Total Ventes"
            value="0"
            unit="XOF"
            icon={ArrowUpRight}
            colorClass="bg-blue-500"
          />
          <StatCard
            title="Total Achats"
            value="906.4"
            unit="K XOF"
            icon={Package}
            colorClass="bg-blue-400"
          />
          <StatCard
            title="Clients Actifs"
            value="5"
            unit="Clients"
            icon={Users}
            colorClass="bg-blue-300"
          />
        </div>

        {/* SECTION IA SOFT */}
        <div className="bg-white rounded-2xl p-8 border border-blue-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sparkles size={120} className="text-blue-600" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Sparkles size={28} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  Expertise IA AccounTech
                </h2>
                <p className="text-slate-500 text-sm mt-1 max-w-lg font-medium italic">
                  "Votre solde de caisse est négatif. Souhaitez-vous que
                  j'analyse vos derniers décaissements pour corriger
                  d'éventuelles erreurs ?"
                </p>
              </div>
            </div>
            <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-slate-100 whitespace-nowrap">
              Analyser ma gestion
            </button>
          </div>
        </div>

        {/* PLACEHOLDERS GRAPHIQUES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl h-64 flex items-center justify-center text-gray-400 font-bold text-sm italic uppercase tracking-widest">
            [ Évolution mensuelle ]
          </div>
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl h-64 flex items-center justify-center text-gray-400 font-bold text-sm italic uppercase tracking-widest">
            [ Répartition sectorielle ]
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
