import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { accessToken, checkedAuth } = useAppSelector((state) => state.auth);
  console.log({accessToken, checkedAuth});
  
  if (!checkedAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-slate-400">
        Loading...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
