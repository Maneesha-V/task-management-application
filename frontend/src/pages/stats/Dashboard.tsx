import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutUser } from "../../features/auth/authSlice";
import StatsChart from "./StatsChart";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
     <div className="min-h-screen bg-base text-ink">
      <div className="mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {user ? `Signed in as ${user.name}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/tasks"
              className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
            >
              Tasks
            </Link>
            <button
              onClick={() => dispatch(logoutUser())}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        </header>

        <main>
          <StatsChart />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
