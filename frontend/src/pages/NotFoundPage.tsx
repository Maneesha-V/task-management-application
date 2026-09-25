import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

const NotFoundPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base px-4 text-center text-ink">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to={user ? "/dashboard" : "/login"}
        className="mt-6 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        {user ? "Back to Dashboard" : "Go to Login"}
      </Link>
    </div>
  );
};

export default NotFoundPage;