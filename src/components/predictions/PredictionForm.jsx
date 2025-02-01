import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert } from '@/components/ui/alert';

const PredictionForm = ({ onSubmit, initialPredictions = null }) => {
  const [predictions, setPredictions] = useState(initialPredictions || {
    top5: Array(5).fill(null),
    qualified: []
  });
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (predictions.top5.some(p => !p)) {
      setError("Veuillez sélectionner le Top 5 complet");
      return;
    }
    if (predictions.qualified.length !== 10) {
      setError("Veuillez sélectionner exactement 10 Miss qualifiées");
      return;
    }

    // Submit
    onSubmit({
      selections: predictions,
      isPublic
    });
  };

  const handleTop5Change = (index, missId) => {
    const newTop5 = [...predictions.top5];
    newTop5[index] = missId;
    setPredictions({ ...predictions, top5: newTop5 });
  };

  const handleQualifiedChange = (missId, isSelected) => {
    let newQualified;
    if (isSelected) {
      if (predictions.qualified.length >= 10) {
        setError("Vous ne pouvez sélectionner que 10 Miss qualifiées");
        return;
      }
      newQualified = [...predictions.qualified, missId];
    } else {
      newQualified = predictions.qualified.filter(id => id !== missId);
    }
    setPredictions({ ...predictions, qualified: newQualified });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <p>{error}</p>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Top 5</h3>
        <div className="space-y-3">
          {["Miss France", "1ère Dauphine", "2ème Dauphine", "3ème Dauphine", "4ème Dauphine"].map((title, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="w-32">{title}</span>
              {/* À remplacer par un composant de sélection avec DnD */}
              <select
                value={predictions.top5[index] || ""}
                onChange={(e) => handleTop5Change(index, e.target.value)}
                className="flex-grow p-2 border rounded"
              >
                <option value="">Sélectionner une Miss</option>
                {/* Liste des Miss à remplir */}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">10 Miss qualifiées</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* À remplacer par la liste des Miss avec checkbox */}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2">
          <Switch
            checked={isPublic}
            onCheckedChange={setIsPublic}
            id="public-switch"
          />
          <label htmlFor="public-switch" className="text-sm">
            Rendre mes pronostics publics
          </label>
        </div>

        <Button 
          type="submit"
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
        >
          Valider mes pronostics
        </Button>
      </div>
    </form>
  );
};

export default PredictionForm;