import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthContext } from '../../contexts/AuthContext';
import { missData, titles } from '../../data/missData';

const AdminResultsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [eventStatus, setEventStatus] = useState(null);
  const [selectedMisses, setSelectedMisses] = useState([]);
  const [availableMisses, setAvailableMisses] = useState([]); // Liste complète des Miss
  const [top5Selections, setTop5Selections] = useState(Array(5).fill(null));
  const [saving, setSaving] = useState(false);

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || !userDoc.data().isAdmin) {
        navigate('/');
      }
    };

    checkAdmin();
  }, [user, navigate]);

  // Charger l'état actuel
  useEffect(() => {
    const fetchEventStatus = async () => {
      try {
        const eventDoc = await getDoc(doc(db, 'eventResults', 'missfranceEventStatus'));
        if (eventDoc.exists()) {
          const data = eventDoc.data();
          setEventStatus(data);
          setSelectedMisses(data.qualified || []);
          setTop5Selections(data.top5 || Array(5).fill(null));
        }

        // Charger la liste des Miss
        const missesDoc = await getDoc(doc(db, 'misses', '2025'));
        if (missesDoc.exists()) {
          setAvailableMisses(missesDoc.data().misses || []);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventStatus();
  }, []);

  const handleQualifiedSelect = (miss) => {
    if (selectedMisses.length >= 15 && !selectedMisses.find(m => m.id === miss.id)) {
      return; // Maximum atteint
    }

    setSelectedMisses(prev => {
      const exists = prev.find(m => m.id === miss.id);
      if (exists) {
        return prev.filter(m => m.id !== miss.id);
      } else {
        return [...prev, miss];
      }
    });
  };

  const handleTop5Select = (position, miss) => {
    setTop5Selections(prev => {
      const newSelections = [...prev];
      // Si la Miss est déjà sélectionnée ailleurs, la retirer
      const currentIndex = newSelections.findIndex(m => m?.id === miss.id);
      if (currentIndex !== -1) {
        newSelections[currentIndex] = null;
      }
      newSelections[position] = miss;
      return newSelections;
    });
  };

  const saveResults = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'eventResults', 'missfranceEventStatus'), {
        qualified: selectedMisses,
        top15Completed: selectedMisses.length === 15,
        top5: top5Selections,
        top5Completed: top5Selections.every(miss => miss !== null),
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Administration des résultats
            </h1>
          </div>

          {/* Sélection des 15 qualifiées */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">
              Les 15 qualifiées {selectedMisses.length}/15
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {missData.map(miss => (
                <div
                  key={miss.id}
                  onClick={() => handleQualifiedSelect(miss)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedMisses.find(m => m.id === miss.id)
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                >
                  <div className="font-medium">{miss.name}</div>
                  <div className="text-sm text-gray-500">{miss.region}</div>
                  {selectedMisses.find(m => m.id === miss.id) && (
                    <div className="text-xs text-pink-600 mt-1">
                      Qualifiée
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sélection du Top 5 */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Le Top 5</h2>
            <div className="space-y-4">
              {titles.map((title, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="font-bold text-lg text-pink-500 w-36">
                    {title}
                  </div>
                  <select
                    value={top5Selections[index]?.id || ''}
                    onChange={(e) => {
                      const miss = selectedMisses.find(m => m.id === Number(e.target.value));
                      handleTop5Select(index, miss || null);
                    }}
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    disabled={selectedMisses.length === 0}
                  >
                    <option value="">Sélectionner une Miss</option>
                    {selectedMisses.map(miss => (
                      <option 
                        key={miss.id} 
                        value={miss.id}
                        disabled={top5Selections.some(selected => selected?.id === miss.id)}
                      >
                        {miss.name} ({miss.region})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-4">
            <button
              onClick={saveResults}
              disabled={saving}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder les résultats'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminResultsPage;