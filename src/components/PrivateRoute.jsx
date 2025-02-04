onsole.log("🔐 PrivateRoute - test");
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  console.log("🔐 Vérification PrivateRoute - User:", user);
  console.log("⏳ Loading status:", loading);

  if (loading) {
    console.log("⏳ Chargement en cours...");
    return <div>Chargement...</div>;
  }

  if (!user) {
    console.log("🚫 Redirection vers /login");
    return <Navigate to="/login" />;
  }

  console.log("✅ Accès autorisé !");
  return children;
};