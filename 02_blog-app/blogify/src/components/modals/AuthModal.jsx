import React, { useState } from "react";
import { FiImage, FiArrowLeft } from "react-icons/fi";
import ModalShell from "./ModalShell";

export function AuthModal({ mode, setMode, onClose, onSubmit }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  function submit(event) {
    event.preventDefault();
    if (mode === "reset" && form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onSubmit(form);
  }

  if (mode === "reset") {
    return (
      <ModalShell onClose={onClose} title="Reset Password">
        <form onSubmit={submit} className="grid gap-4" autoComplete="off">
          <p className="text-xs text-violet-200/60 leading-relaxed mb-1">
            Type a secure new password for your account.
          </p>
          <input
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="New Password"
            type="password"
            required
            className="rounded-2xl glass-input px-4 py-3 text-xs font-bold text-white"
          />
          <input
            value={form.confirmPassword}
            onChange={(event) =>
              setForm((current) => ({ ...current, confirmPassword: event.target.value }))
            }
            placeholder="Confirm New Password"
            type="password"
            required
            className="rounded-2xl glass-input px-4 py-3 text-xs font-bold text-white"
          />
          <button className="glow-btn rounded-2xl py-3 text-xs font-black text-white mt-2">
            Save New Password
          </button>
        </form>
      </ModalShell>
    );
  }

  if (mode === "forgot") {
    return (
      <ModalShell onClose={onClose} title="Reset Password">
        <form onSubmit={submit} className="grid gap-4" autoComplete="off">
          <p className="text-xs text-violet-200/60 leading-relaxed mb-1">
            Provide the email associated with your account, and we will transmit a password reset token.
          </p>
          <input
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="Email address"
            type="email"
            required
            className="rounded-2xl glass-input px-4 py-3 text-xs font-bold text-white"
          />
          <button className="glow-btn rounded-2xl py-3 text-xs font-black text-white mt-2">
            Send Reset Link
          </button>
        </form>
        <button
          onClick={() => setMode("login")}
          className="mt-4 flex items-center justify-center gap-2 w-full rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 py-3 text-xs font-bold text-violet-300 transition"
        >
          <FiArrowLeft /> Back to Log In
        </button>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      onClose={onClose}
      title={mode === "login" ? "Welcome Back" : "Create Account"}
    >
      <form onSubmit={submit} className="grid gap-4" autoComplete="off">
        {mode === "register" && (
          <input
            value={form.username}
            onChange={(event) =>
              setForm((current) => ({ ...current, username: event.target.value }))
            }
            placeholder="Username"
            className="rounded-2xl glass-input px-4 py-3 text-xs font-bold text-white"
          />
        )}
        <input
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          placeholder="Email address"
          type="email"
          className="rounded-2xl glass-input px-4 py-3 text-xs font-bold text-white"
        />
        <input
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          placeholder="Password"
          type="password"
          className="rounded-2xl glass-input px-4 py-3 text-xs font-bold text-white"
        />
        {mode === "register" && (
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold text-violet-200 hover:bg-white/10 transition">
            <FiImage className="text-violet-400 shrink-0" />
            <span className="min-w-0 flex-1 truncate">
              {form.profileImage?.name || "Upload profile picture"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  profileImage: event.target.files?.[0] || null,
                }))
              }
            />
          </label>
        )}
        
        {mode === "login" && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-xs font-bold text-purple-400 hover:text-purple-300"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <button className="glow-btn rounded-2xl py-3 text-xs font-black text-white mt-2">
          {mode === "login" ? "Log In" : "Register"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="mt-4 w-full rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 py-3 text-xs font-bold text-violet-300 transition"
      >
        {mode === "login"
          ? "New to Blogify? Register here"
          : "Already have an account? Login here"}
      </button>
    </ModalShell>
  );
}

export default AuthModal;
