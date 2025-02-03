import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUsername, updateUserPassword, deleteUserAccount } = useAuthContext();
  
  // États pour les différents formulaires
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  // États pour les valeurs des formulaires
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  
  // États pour le chargement et les messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Gestion du changement de pseudo
  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await updateUsername(newUsername);
      setSuccess('Pseudo mis à jour avec succès');
      setIsEditingUsername(false);
    } catch (error) {
      setError('Erreur lors de la mise à jour du pseudo');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion du changement de mot de passe
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await updateUserPassword(passwords.new);
      setSuccess('Mot de passe mis à jour avec succès');
      setIsChangingPassword(false);
      setPasswords({ new: '', confirm: '' });
    } catch (error) {
      setError('Erreur lors de la mise à jour du mot de passe');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la suppression du compte
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError('');
    try {
      await deleteUserAccount();
      navigate('/login');
    } catch (error) {
      setError('Erreur lors de la suppression du compte');
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Messages de succès/erreur */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              {success}
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Section Pseudo */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Pseudo</h3>
                {!isEditingUsername && (
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="text-sm text-pink-500 hover:text-pink-600"
                  >
                    Modifier
                  </button>
                )}
              </div>

              {isEditingUsername ? (
                <form onSubmit={handleUsernameSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Nouveau pseudo"
                    required
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingUsername(false)}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                      disabled={isLoading}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-900">{user?.username || user?.email?.split('@')[0]}</p>
              )}
            </div>

            <hr />

            {/* Section Mot de passe */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Mot de passe</h3>
                {!isChangingPassword && (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="text-sm text-pink-500 hover:text-pink-600"
                  >
                    Modifier
                  </button>
                )}
              </div>

              {isChangingPassword && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Nouveau mot de passe"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Confirmer le mot de passe"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                      disabled={isLoading}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <hr />

            {/* Section Suppression de compte */}
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Supprimer le compte</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Attention : cette action est irréversible
                  </p>
                </div>
                <button
                  onClick={() => setIsConfirmingDelete(true)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmation de suppression */}
        {isConfirmingDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Êtes-vous sûr de vouloir supprimer votre compte ?
              </h3>
              <p className="text-gray-500 mb-6">
                Cette action supprimera définitivement votre compte ainsi que toutes vos données associées.
                Cette action est irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Suppression...' : 'Confirmer la suppression'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;