import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout } from "../components/Layout";
import {
  Plus,
  X,
  Paperclip,
  Wallet,
  Loader2,
  Trash2,
  Edit2,
  UploadCloud,
} from "lucide-react";

const Caisse = () => {
  // --- ÉTATS ---
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const initialForm = {
    type: "Décaissement (-)",
    motif: "",
    montant: "",
    date: new Date().toISOString().split("T")[0],
    mode: "Espèces",
  };
  const [formData, setFormData] = useState(initialForm);

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/transactions");
      setTransactions(res.data);
    } catch (e) {
      console.error("Erreur chargement transactions", e);
    }
  };

  // --- GESTION DE L'UPLOAD ET OCR (PDF & IMAGES) ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsAnalyzing(true);

    const data = new FormData();
    data.append("file", file);

    try {
      // Envoi au backend pour conversion PDF -> Image -> OCR
      const res = await axios.post(
        "http://127.0.0.1:8000/transactions/analyze",
        data
      );

      // Mise à jour automatique des champs avec les données extraites par l'IA
      setFormData((prev) => ({
        ...prev,
        montant:
          res.data.montant > 0 ? res.data.montant.toString() : prev.montant,
        motif: res.data.motif || prev.motif,
      }));
    } catch (err) {
      console.error("Erreur lors de l'analyse", err);
      alert(
        "L'IA n'a pas pu lire le document. Vous pouvez remplir les champs manuellement."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- SOUMISSION DU FORMULAIRE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    if (selectedFile) data.append("file", selectedFile);

    try {
      if (editingId) {
        await axios.put(
          `http://127.0.0.1:8000/transactions/${editingId}`,
          data
        );
      } else {
        await axios.post("http://127.0.0.1:8000/transactions", data);
      }
      closeModal();
      fetchTransactions();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Une erreur est survenue");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setSelectedFile(null);
    setFormData(initialForm);
  };

  const totalSolde = transactions.reduce(
    (acc, t: any) =>
      t.type === "Encaissement (+)"
        ? acc + Number(t.montant)
        : acc - Number(t.montant),
    0
  );

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
        {/* SECTION PRINCIPALE */}
        <div
          className={`p-8 overflow-y-auto transition-all duration-500 ${
            previewUrl ? "w-7/12" : "w-full"
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                Caisse centrale
              </h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-tighter">
                Gestion des flux & Justificatifs IA
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <Plus size={20} /> Nouvelle opération
            </button>
          </div>

          {/* BANDEAU SOLDE */}
          <div
            className={`p-6 rounded-[2.5rem] text-white mb-8 shadow-xl flex items-center gap-4 transition-colors ${
              totalSolde >= 0
                ? "bg-blue-600 shadow-blue-100"
                : "bg-rose-600 shadow-rose-100"
            }`}
          >
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
              <Wallet size={32} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                Solde disponible en caisse
              </p>
              <h2 className="text-3xl font-black">
                {totalSolde.toLocaleString()} FCFA
              </h2>
            </div>
          </div>

          {/* TABLEAU */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">
                    Réf & Date
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">
                    Désignation
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">
                    Montant
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((t: any) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700">{t.ref}</span>
                      <br />
                      <span className="text-[10px] text-slate-400 font-bold">
                        {t.date}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">
                      {t.motif}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-black ${
                        t.type.includes("+")
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {t.type.includes("+") ? "+" : "-"}{" "}
                      {t.montant.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-1">
                      <button
                        onClick={() => {
                          setEditingId(t.id);
                          setFormData({ ...t, montant: t.montant.toString() });
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm("Supprimer ?")) {
                            await axios.delete(
                              `http://127.0.0.1:8000/transactions/${t.id}`
                            );
                            fetchTransactions();
                          }
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                      {t.has_doc && (
                        <button
                          onClick={() =>
                            setPreviewUrl(
                              `http://127.0.0.1:8000/uploads/${t.facture_id}`
                            )
                          }
                          className="p-2 text-slate-400 hover:text-blue-600"
                        >
                          <Paperclip size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* APERÇU PDF / IMAGE */}
        {previewUrl && (
          <div className="w-5/12 bg-white border-l border-slate-200 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Justificatif numérisé
              </span>
              <button
                onClick={() => setPreviewUrl(null)}
                className="p-2 hover:bg-rose-100 text-rose-500 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <iframe
              src={previewUrl}
              className="flex-1 w-full"
              title="Justificatif"
            />
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800">
                {editingId ? "Modifier" : "Nouvelle Opération"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {!editingId && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Document (PDF/Image)
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-3xl p-6 text-center flex flex-col items-center justify-center gap-2 group ${
                      isAnalyzing
                        ? "bg-blue-50 border-blue-400"
                        : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                      accept=".pdf,image/*"
                    />
                    {isAnalyzing ? (
                      <>
                        <Loader2
                          className="animate-spin text-blue-600"
                          size={32}
                        />
                        <span className="text-xs font-bold text-blue-600 animate-pulse">
                          L'IA déchiffre le document...
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                          <UploadCloud size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          {selectedFile
                            ? selectedFile.name
                            : "Cliquez ou glissez le justificatif"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Flux
                  </label>
                  <select
                    className="w-full bg-slate-50 p-4 rounded-2xl font-bold"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="Encaissement (+)">Encaissement (+)</option>
                    <option value="Décaissement (-)">Décaissement (-)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Mode
                  </label>
                  <select
                    className="w-full bg-slate-50 p-4 rounded-2xl font-bold"
                    value={formData.mode}
                    onChange={(e) =>
                      setFormData({ ...formData, mode: e.target.value })
                    }
                  >
                    <option value="Espèces">Espèces</option>
                    <option value="Virement">Virement</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Désignation
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border border-transparent focus:border-blue-400"
                  value={formData.motif}
                  onChange={(e) =>
                    setFormData({ ...formData, motif: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Montant (FCFA)
                </label>
                <input
                  type="number"
                  className="w-full bg-slate-50 p-4 rounded-2xl font-black text-2xl text-blue-600 outline-none border border-transparent focus:border-blue-400"
                  value={formData.montant}
                  onChange={(e) =>
                    setFormData({ ...formData, montant: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 ${
                  isAnalyzing
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isAnalyzing
                  ? "Analyse en cours..."
                  : editingId
                  ? "Enregistrer"
                  : "Valider"}
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Caisse;
