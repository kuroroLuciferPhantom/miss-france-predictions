import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const SettingsPage = () => {
  const { user, updatePassword } = useAuthContext();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await updatePassword(passwords.new);
      setSuccess('Votre mot de passe a été mis à jour');
      setIsChangePasswordOpen(false);
      setPasswords({ new: '', confirm: '' });
    } catch (error) {
      setError('Erreur lors du changement de mot de passe');
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Supprimer les données utilisateur de Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      // Supprimer le compte Firebase Auth
      await deleteUser(user);
    } catch (error) {
      setError('Erreur lors de la suppression du compte');
      console.error('Erreur:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Paramètres</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Messages */}
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

          {/* Paramètres du compte */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Changement de mot de passe */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Mot de passe</h3>
                <button
                  onClick={() => setIsChangePasswordOpen(!isChangePasswordOpen)}
                  className="text-sm text-pink-500 hover:text-pink-600"
                >
                  Modifier
                </button>
              </div>

              {isChangePasswordOpen && (
                <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsChangePasswordOpen(false)}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
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

            {/* Suppression du compte */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Supprimer le compte</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Cette action est irréversible. Toutes vos données seront supprimées définitivement.
                  </p>
                </div>
                <button
                  onClick={() => setIsDeleteAccountOpen(true)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmation de suppression */}
        {isDeleteAccountOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Êtes-vous sûr de vouloir supprimer votre compte ?
              </h3>
              <p className="text-gray-500 mb-6">
                Cette action est irréversible. Toutes vos données seront supprimées définitivement.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteAccountOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Suppression...' : 'Supprimer définitivement'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;