export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  console.log("🔍 PrivateRoute - État:", { loading, userExists: !!user });

  if (loading) {
    console.log("⏳ PrivateRoute - Chargement...");
    return <LoadingScreen message="Vérification de l'authentification..." />;
  }

  // S'assurer que l'utilisateur est bien chargé avec les données Firestore
  if (!user?.uid) {
    console.log("🚫 PrivateRoute - Pas d'utilisateur ou données incomplètes");
    return <Navigate to="/login" />;
  }

  console.log("✅ PrivateRoute - Accès autorisé pour", user.email);
  return children;
};