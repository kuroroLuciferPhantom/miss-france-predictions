import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import toast from "react-hot-toast";
import { useSeo } from "../../hooks/useSeo";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Gestion des changements de champs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Efface l'erreur du champ modifié
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis.";
    if (!formData.email.trim()) newErrors.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide.";
    if (!formData.message.trim()) newErrors.message = "Le message est requis.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false
      });

      // Reset du formulaire
      setFormData({ name: "", email: "", message: "" });
      toast.success("Message envoyé avec succès !");

    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useSeo({
    title: 'Miss\'Prono - Nous contacter !',
    description: 'Contactez-nous pour toute question ou demande. Nous vous répondrons dans les plus brefs délais.',
  });

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-6 text-center">
        Contact
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
        Une question ou une demande ? Contactez-nous via ce formulaire.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Champ Nom */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Nom
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                     focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 
                     focus:border-transparent"
            placeholder="Votre nom"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Champ Email */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                     focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 
                     focus:border-transparent"
            placeholder="Votre email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Champ Message */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 
                     focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 
                     focus:border-transparent"
            rows="4"
            placeholder="Votre message..."
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        {/* Bouton Envoyer */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 
                   hover:from-pink-600 hover:to-purple-600 text-white font-semibold 
                   py-2 rounded-lg transition-all duration-200 disabled:opacity-50 
                   disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>
    </div>
  );
};

export default ContactPage;