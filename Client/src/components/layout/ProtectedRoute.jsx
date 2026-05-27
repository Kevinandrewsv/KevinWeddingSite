import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAdminProfile } from "../../hooks/useAdmin";
import useAuthStore from "../../store/authStore";
import { LoadingState } from "../common";

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const {
    isLoading,
    isError,
    isSuccess,
  } = useAdminProfile();

  useEffect(() => {
    if (isError) {
      logout();
    }
  }, [isError, logout]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
        <LoadingState message="Checking admin session..." />
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isSuccess) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
      <LoadingState message="Checking admin session..." />
    </div>
  );
};

export default ProtectedRoute;