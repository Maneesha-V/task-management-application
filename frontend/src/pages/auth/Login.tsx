import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../app/hooks";
import { loginUser } from "../../features/auth/authSlice";


const inputClass =
  "rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-ink placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-slate-700 bg-surface p-6"
      >
        <h1 className="mb-6 text-xl font-semibold text-ink">Log in</h1>
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-slate-400">
          No account?{" "}
          <Link to="/register" className="text-accent hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
