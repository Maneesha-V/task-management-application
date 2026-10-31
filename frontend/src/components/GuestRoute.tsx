import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const GuestRoute = ({ children }: { children: ReactNode }) => {
  const { user, checkedAuth } = useAppSelector((state) => state.auth);

  if (!checkedAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-slate-400">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;