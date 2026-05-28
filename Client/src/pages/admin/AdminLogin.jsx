import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";

import { useLoginAdmin } from "../../hooks/useAdmin";
import useAuthStore from "../../store/authStore";

const AdminLogin = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const loginMutation = useLoginAdmin();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const email = formData.email.trim();
    const password = formData.password.trim();

    if (!email || !password) {
      const message = "Email and password are required.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    logout();

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("Admin login successful.");
          navigate("/admin/dashboard");
        },
        onError: (error) => {
          const message = error?.response?.data?.message || "Admin login failed.";
          setErrorMessage(message);
          toast.error(message);
        },
      }
    );
  };

  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-4 py-8 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.2),transparent_32%)]" />
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.07] shadow-2xl shadow-black/30 backdrop-blur-2xl lg:grid-cols-[1fr_0.9fr]">
        <div className="relative hidden min-h-[650px] overflow-hidden p-10 lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-fuchsia-500/20" />

          <div className="relative flex h-full flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-100">
                <Sparkles size={15} /> Wedding Admin Studio
              </div>

              <h1 className="mt-8 max-w-xl text-6xl font-black leading-[0.95] tracking-tight">
                Control every wedding moment from one beautiful place.
              </h1>

              <p className="mt-6 max-w-lg text-base font-medium leading-8 text-slate-300">
                Review wishes, attendance, gallery memories, polls, chatbot messages and Circle of Love stories with a clean premium dashboard.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["Secure", "Responsive", "Organized"].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.4rem] border border-white/10 bg-white/10 p-4 backdrop-blur-xl"
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  <p className="mt-3 text-sm font-black">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-5 text-slate-950 sm:p-8 lg:p-10">
          <div className="mx-auto flex min-h-[560px] max-w-md flex-col justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-orange-400 text-xl font-black text-white shadow-xl shadow-fuchsia-200">
              KJ
            </div>

            <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-indigo-600">
              Admin access
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Welcome back
            </h2>

            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
              Login to manage your complete wedding invitation application.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-4"
              autoComplete="off"
            >
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Email
                </span>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="off"
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pl-11 text-sm font-bold outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    placeholder="Enter admin email"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                  Password
                </span>

                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pl-11 text-sm font-bold outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    placeholder="Enter password"
                  />
                </div>
              </label>

              {errorMessage && (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white shadow-xl shadow-slate-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loginMutation.isPending ? "Logging in..." : "Enter Admin Dashboard"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-6 inline-flex items-center justify-center gap-2 text-sm font-black text-slate-500 transition hover:text-indigo-700"
            >
              <ArrowLeft size={16} /> Back to website
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;