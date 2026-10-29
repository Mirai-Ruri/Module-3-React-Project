import "../styles/style.css";
import { useState } from "react";

const PROFILE_KEY = "mbl-profiles"; 
const SESSION_KEY = "mbl-current-user";

function getProfiles() {
  try {
    const profiles = JSON.parse(localStorage.getItem(PROFILE_KEY));

    return Array.isArray(profiles) ? profiles : [];
  } catch {
    return [];
  }
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function Login() {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleTogglePassword() {
    setShowPassword((previousValue) => !previousValue);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isLoading) return;
    setMessage("");

    const normalizedIdentity = identity.trim().toLowerCase();
    if (!normalizedIdentity || !password) {
      setMessage("Please enter your username/email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const profiles = getProfiles();

      const user = profiles.find((profile) => {
        return (
          profile.email?.toLowerCase() === normalizedIdentity ||
          profile.username?.toLowerCase() === normalizedIdentity
        );
      });

      if (!user || !user.passwordHash) {
        setMessage("Invalid username/email or password.");
        return;
      }

      const enteredPasswordHash = await hashPassword(password);

      if (enteredPasswordHash !== user.passwordHash) {
        setMessage("Invalid username/email or password.");
        return;
      }
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          userId: user.id,
          username: user.username,
          email: user.email,
        }),
      );

      setMessage("Welcome back! Opening your library...");

      setTimeout(() => {
        window.location.href = "/home";
      }, 450);
    } catch (error) {
      console.error("Login error:", error);

      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="login-page">
        <title>Log In . My Book Library</title>
        <main className="card">
          <header className="brand">
            <div className="brandname">My Book Library</div>
            <p className="tagline">Small steps. Big stories.</p>
          </header>

          <section>
            <h1>Welcome back</h1>
            <p className="intro">
              Log in to continue your journey <em>✧</em>
            </p>

            <form id="login-form" onSubmit={handleSubmit}>
              <label className="field">
                <b aria-hidden="true">✉</b>
                <input
                  type="text"
                  id="identity"
                  name="identity"
                  placeholder="Email address or username"
                  autocomplete="username"
                  value={identity}
                  onChange={(event) => setIdentity(event.target.value)}
                  required
                />
              </label>

              <label className="field">
                <b aria-hidden="true">♙</b>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  autocomplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <b
                  type="button"
                  className="toggle-password"
                  id="toggle-password"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed="false"
                  onClick={handleTogglePassword}
                >
                  ◉
                </b>
              </label>

              <p className="forgot-row">
                <a className="forgot" href="forgot-password.html">
                  Forgot your password?
                </a>
              </p>

              <button type="submit" className="primary" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p id="form-message" role="status" aria-live="polite">
              {message}
            </p>

            <p className="switch">
              Don’t have an account? <a href="/">Sign up</a>
            </p>
          </section>
        </main>
      </div>
    </>
  );
}
export default Login;
