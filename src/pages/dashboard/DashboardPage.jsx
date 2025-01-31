// ... (début du fichier inchangé)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header et autres sections inchangées */}

        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => navigate('/group/create')}
            className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
          >
            <span>+</span> Créer un groupe
          </button>
          <button 
            onClick={() => navigate('/group/join')}
            className="flex items-center gap-2 px-6 py-2 bg-white rounded-md shadow hover:bg-gray-50"
          >
            <span>👥</span> Rejoindre un groupe
          </button>
        </div>

        {/* Reste du fichier inchangé */}
      </div>
    </div>
  );