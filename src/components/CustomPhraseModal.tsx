import React, { useState } from 'react';
import { TypingPhrase } from '../types';
import { loadCustomPhrases, saveCustomPhrase, deleteCustomPhrase } from '../utils/metrics';
import { ArrowLeft, Plus, Trash2, FileText, Play } from 'lucide-react';

interface CustomPhraseModalProps {
  onSelectPhrase: (phrase: TypingPhrase) => void;
  onBackToPractice: () => void;
}

export const CustomPhraseModal: React.FC<CustomPhraseModalProps> = ({
  onSelectPhrase,
  onBackToPractice,
}) => {
  const [customList, setCustomList] = useState(loadCustomPhrases());
  const [newText, setNewText] = useState('');
  const [category, setCategory] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) {
      setErrorMsg('Por favor, digite ou cole um texto.');
      return;
    }
    if (newText.trim().length < 15) {
      setErrorMsg('O texto deve ter pelo menos 15 caracteres para uma prática eficaz.');
      return;
    }

    const updated = saveCustomPhrase(newText.trim(), category.trim() || 'Texto Próprio');
    setCustomList(updated);
    setNewText('');
    setCategory('');
    setErrorMsg('');
  };

  const handleDelete = (id: string) => {
    const updated = deleteCustomPhrase(id);
    setCustomList(updated);
  };

  const handlePracticeCustom = (item: { id: string; text: string; category: string }) => {
    const phrase: TypingPhrase = {
      id: item.id,
      text: item.text,
      difficulty: 'livre',
      category: item.category,
      author: 'Personalizado',
    };
    onSelectPhrase(phrase);
    onBackToPractice();
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToPractice}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] text-slate-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-800 transition-all duration-200 cursor-pointer active:scale-95 shadow-xs"
          title="Voltar para a prática"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Frases & Textos Personalizados
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Adicione redações, artigos ou trechos que você precisa treinar para concursos, vestibulares ou trabalho
          </p>
        </div>
      </div>

      {/* Add Custom Text Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col gap-4"
      >
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-500" />
          Adicionar Novo Texto de Treino
        </h2>

        {errorMsg && (
          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-900">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Categoria ou Tópico (opcional):
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Redação ENEM, Código, E-mail corporativo..."
            className="px-4 py-2.5 text-sm bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Frase ou Parágrafo:
          </label>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={3}
            placeholder="Cole ou digite aqui o texto que deseja praticar..."
            className="px-4 py-3 text-sm bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 resize-none font-mono-typing transition-colors"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/25 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Salvar Frase</span>
          </button>
        </div>
      </form>

      {/* List of Custom Phrases */}
      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
          Seus Textos Salvos ({customList.length})
        </h2>

        {customList.length === 0 ? (
          <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            Nenhum texto próprio adicionado ainda. Use o formulário acima para cadastrar seu primeiro trecho!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {customList.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs hover:border-cyan-400/50 transition-colors"
              >
                <div className="flex flex-col gap-1 max-w-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.text.length} caracteres</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.text.split(/\s+/).length} palavras</span>
                  </div>
                  <p className="font-mono-typing text-sm text-slate-800 dark:text-slate-200 line-clamp-2">
                    {item.text}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => handlePracticeCustom(item)}
                    className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-400/30 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Praticar</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                    title="Excluir este texto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
