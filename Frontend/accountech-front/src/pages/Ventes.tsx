import React from "react";
import { Layout } from "../components/Layout";
import {
  Plus,
  Search,
  Download,
  Filter,
  MoreHorizontal,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

// Données fictives pour le tableau
const ventesData = [
  {
    id: "FAC-2024-001",
    client: "Entreprise Alpha",
    date: "10 Jan 2024",
    montant: "150 000",
    statut: "Payé",
    methode: "Virement",
  },
  {
    id: "FAC-2024-002",
    client: "M. Abdoulaye Diop",
    date: "09 Jan 2024",
    montant: "45 000",
    statut: "En attente",
    methode: "Caisse",
  },
  {
    id: "FAC-2024-003",
    client: "Saly Boutique",
    date: "08 Jan 2024",
    montant: "210 500",
    statut: "Payé",
    methode: "Wave",
  },
  {
    id: "FAC-2024-004",
    client: "Garage Moderne",
    date: "07 Jan 2024",
    montant: "89 000",
    statut: "Annulé",
    methode: "Chèque",
  },
  {
    id: "FAC-2024-005",
    client: "Hôtel de la Place",
    date: "06 Jan 2024",
    montant: "500 000",
    statut: "En attente",
    methode: "Virement",
  },
];

const StatutBadge = ({ statut }: { statut: string }) => {
  const styles: any = {
    Payé: "bg-emerald-50 text-emerald-700 border-emerald-100",
    "En attente": "bg-amber-50 text-amber-700 border-amber-100",
    Annulé: "bg-rose-50 text-rose-700 border-rose-100",
  };
  const Icons: any = {
    Payé: CheckCircle2,
    "En attente": Clock,
    Annulé: AlertCircle,
  };
  const Icon = Icons[statut];

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-fit ${styles[statut]}`}
    >
      <Icon size={12} />
      {statut}
    </span>
  );
};

const Ventes = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* ENTÊTE DE PAGE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Gestion des Ventes
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Suivez vos factures et transactions clients
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
              <Download size={18} /> Exporter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              <Plus size={18} /> Nouvelle Vente
            </button>
          </div>
        </div>

        {/* BARRE DE FILTRES */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher un client, un numéro de facture..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-lg transition-all">
            <Filter size={18} /> Filtres avancés
          </button>
        </div>

        {/* TABLEAU */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Référence
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Client
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Montant
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Statut
                </th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ventesData.map((vente) => (
                <tr
                  key={vente.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <FileText size={16} />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">
                        {vente.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-600">
                    {vente.client}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {vente.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-800">
                      {vente.montant}{" "}
                      <small className="text-[10px] text-slate-400">XOF</small>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatutBadge statut={vente.statut} />
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-slate-400 hover:text-slate-600 transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION SIMPLE */}
          <div className="p-4 border-t border-gray-50 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-bold">
              Affichage de 5 sur 24 ventes
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold text-slate-500 hover:bg-gray-50 transition-all disabled:opacity-50">
                Précédent
              </button>
              <button className="px-3 py-1 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-900 transition-all">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ventes;
