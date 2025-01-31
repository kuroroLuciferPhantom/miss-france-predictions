import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const JoinGroup = () => {
  const [groupCode, setGroupCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      const groupRef = await firebase.firestore()
        .collection('groups')
        .where('code', '==', groupCode)
        .get();

      if (groupRef.empty) {
        setError('Code de groupe invalide');
        return;
      }

      const group = groupRef.docs[0];
      await firebase.firestore()
        .collection('groups')
        .doc(group.id)
        .update({
          members: firebase.firestore.FieldValue.arrayUnion({
            uid: firebase.auth().currentUser.uid,
            displayName: firebase.auth().currentUser.displayName,
            joinedAt: new Date()
          })
        });

      navigate(`/group/${group.id}`);
    } catch (err) {
      setError("Erreur lors de l'ajout au groupe");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-center">Rejoindre un groupe</h2>
      
      <div className="space-y-2">
        <input
          type="text"
          value={groupCode}
          onChange={(e) => setGroupCode(e.target.value)}
          placeholder="Code du groupe"
          className="w-full p-2 border rounded"
          maxLength={6}
        />
        
        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={groupCode.length !== 6}
        >
          Rejoindre
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default JoinGroup;