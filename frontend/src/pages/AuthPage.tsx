import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../auth";

function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Email and password are required.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
      setMessage("Name is required.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      if (mode === "login") {
        await signIn(email.trim(), password);
        navigate("/map");
        return;
      }

      await signUp(email.trim(), password, name.trim());

      setMessage("Account created. You can now log in.");
      setMode("login");
      setPassword("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link to="/" className="auth-brand">
          <span className="brand-gaia">Gaia</span>
          <span className="brand-phylax">Phylax</span>
        </Link>

        <div>
          <h1>
            Welcome back,
            <span> guardian.</span>
          </h1>

          <p>
            Report environmental signals, grow your seed impact, and unlock eco
            companions as you help protect the planet.
          </p>
        </div>
      </section>

      <section className="auth-card">
        <p className="home-kicker">
          {mode === "login" ? "Login" : "Create account"}
        </p>

        <h2>{mode === "login" ? "Enter Gaia Phylax" : "Join Gaia Phylax"}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label>
              Name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Gaia Guardian"
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@earth.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>

          {message && <p className="form-message">{message}</p>}

          <button className="primary-link auth-submit" disabled={loading}>
            {loading ? "Working..." : mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        <button
          className="auth-switch"
          type="button"
          onClick={() => {
            setMessage("");
            setMode(mode === "login" ? "signup" : "login");
          }}
        >
          {mode === "login"
            ? "No account yet? Sign up"
            : "Already have an account? Login"}
        </button>

        <Link to="/" className="secondary-link auth-back">
          Back home
        </Link>
      </section>
    </main>
  );
}

export default AuthPage;