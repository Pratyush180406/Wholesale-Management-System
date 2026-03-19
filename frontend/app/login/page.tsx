"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setAuth, isAuthenticated, DEMO_CREDENTIALS } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.replace("/");
  }, [router]);

  const handleLogin = async () => {
    setError("");
    if (!form.username || !form.password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700)); // simulate auth delay

    const match = DEMO_CREDENTIALS.find(
      (c) => c.username === form.username && c.password === form.password
    );

    if (match) {
      setAuth({ username: match.username, role: match.role, loginTime: Date.now() });
      router.replace("/");
    } else {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-grid" />
      <div className="login-bg-glow" />

      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">📦</div>
          <div className="login-logo-title">WMS</div>
          <div className="login-logo-sub">Warehouse OS · Admin Panel</div>
        </div>

        <div className="login-divider">— Secure Access —</div>

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Username</label>
          <div className="input-icon-wrap">
            <span className="input-icon">◈</span>
            <input
              className="form-input"
              placeholder="Enter username"
              value={form.username}
              autoComplete="username"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 22 }}>
          <label className="form-label">Password</label>
          <div className="input-icon-wrap" style={{ position: "relative" }}>
            <span className="input-icon">◎</span>
            <input
              className="form-input"
              type={showPass ? "text" : "password"}
              placeholder="Enter password"
              value={form.password}
              autoComplete="current-password"
              style={{ paddingRight: 44 }}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer",
                fontSize: 13,
              }}
            >
              {showPass ? "hide" : "show"}
            </button>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleLogin}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Authenticating..." : "⏎  Sign In"}
        </button>

        <div className="login-hint">
          demo: admin / admin123 &nbsp;·&nbsp; manager / mgr123
        </div>
      </div>
    </div>
  );
}
