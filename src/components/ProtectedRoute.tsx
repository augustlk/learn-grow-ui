import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const token = localStorage.getItem("token");

  if (!token) {
    localStorage.setItem(
      "redirectAfterLogin",
      window.location.pathname
    );
    return <Navigate to="/auth" />;
  }

  return children;
}