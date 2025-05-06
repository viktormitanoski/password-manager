import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, vaultKey, loading } = useAuth();

  if (loading) return null; // or show a loading spinner

  if (!token || !vaultKey) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
