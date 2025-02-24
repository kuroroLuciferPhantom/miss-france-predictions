// contexts/ScoreModalContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ScoreModalContext = createContext();

export const ScoreModalProvider = ({ children }) => {
  const [scoreModalData, setScoreModalData] = useState(null);

  const showScoreModal = (data) => {
    setScoreModalData(data);
  };

  const hideScoreModal = () => {
    setScoreModalData(null);
  };

  return (
    <ScoreModalContext.Provider value={{ showScoreModal, hideScoreModal }}>
      {children}
      {scoreModalData && (
        <ScoreRevealModal
          isOpen={true}
          onClose={hideScoreModal}
          {...scoreModalData}
        />
      )}
    </ScoreModalContext.Provider>
  );
};

export const useScoreModal = () => {
  const context = useContext(ScoreModalContext);
  if (!context) {
    throw new Error('useScoreModal must be used within a ScoreModalProvider');
  }
  return context;
};