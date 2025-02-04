// src/components/ui/Toast.jsx
import { Toaster, toast } from 'react-hot-toast';

// Configuration par défaut des toasts
const toastConfig = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: 'white',
    color: '#374151', // text-gray-700
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  success: {
    icon: '✅',
    style: {
      border: '1px solid #34D399', // border-green-400
    },
  },
  error: {
    icon: '❌',
    style: {
      border: '1px solid #F87171', // border-red-400
    },
  },
  loading: {
    icon: '⏳',
    style: {
      border: '1px solid #60A5FA', // border-blue-400
    },
  },
};

// Composant à ajouter dans Layout.jsx
export const ToastProvider = () => {
  return (
    <Toaster
      position={toastConfig.position}
      toastOptions={toastConfig}
    />
  );
};

// Fonctions utilitaires pour afficher les toasts
export const showToast = {
  success: (message) => toast.success(message, toastConfig.success),
  error: (message) => toast.error(message, toastConfig.error),
  loading: (message) => toast.loading(message, toastConfig.loading),
  promise: async (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Chargement...',
        success: messages.success || 'Opération réussie',
        error: messages.error || 'Une erreur est survenue',
      },
      toastConfig
    );
  },
};