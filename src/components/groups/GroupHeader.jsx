import React, { useState } from 'react';
import { Settings } from 'lucide-react';

const GroupHeader = ({ 
  group, 
  isAdmin, 
  onRename, 
  onDelete, 
  onLeave, 
  MembersList
}) => {
  const [showMembers, setShowMembers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const CopyButton = ({ code }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button
        onClick={handleCopy}
        className="text-pink-600 dark:text-pink-400 text-sm hover:text-pink-700 dark:hover:text-pink-300"
      >
        {copied ? 'Copié !' : 'Copier'}
      </button>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8">
      {/* Section principale */}
      <div className="p-6">
        {/* Titre et bouton settings */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {group?.name}
            </h1>
            {group?.description && (
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {group.description}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 lg:hidden"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Stats principales (visibles sur desktop et mobile) */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span className="font-medium">Admin :</span>
            <span>{group?.adminUsername}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span className="font-medium">Prédictions :</span>
            <span>{group?.members?.filter(m => m.hasSubmitted)?.length || 0} / {group?.members?.length || 0}</span>
          </div>
        </div>

        {/* Infos mobiles uniquement */}
        <div className="lg:hidden">
          {/* Code d'invitation */}
          <div className="mt-4 flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
            <span className="font-medium">Code d'invitation :</span>
            <span className="font-mono">{group.inviteCode}</span>
            <CopyButton code={group.inviteCode} />
          </div>

          {/* Bouton voir les participants */}
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="mt-4 flex items-center gap-2 text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300"
          >
            <span>Voir les participants ({group?.members?.length || 0})</span>
            <svg
              className={`w-4 h-4 transition-transform ${showMembers ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Settings menu (mobile only) */}
          {showSettings && (
            <div className="mt-4 py-4 border-t border-gray-100 dark:border-gray-700">
              <div className="space-y-2">
                {isAdmin && (
                  <>
                    <button
                      onClick={onRename}
                      className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                    >
                      Modifier le nom du groupe
                    </button>
                    <button
                      onClick={onDelete}
                      className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      Supprimer le groupe
                    </button>
                  </>
                )}
                <button
                  onClick={onLeave}
                  className="w-full text-left px-4 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded"
                >
                  Quitter le groupe
                </button>
              </div>
            </div>
          )}

          {/* Liste des membres (accordéon) */}
          <div
            className={`transition-all duration-200 ${
              showMembers ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <MembersList members={group.members} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupHeader;