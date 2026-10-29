import "../styles/style.css";
import { useState } from "react";

const PROFILE_KEY = "mbl-profiles";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState("");

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

  async function handleSubmit(event) {
    event.preventDefault();

    setFormMessage("");

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    const profiles = getProfiles();

    const emailExists = profiles.some(
      (profile) => profile.email === cleanEmail,
    );

    if (emailExists) {
      setFormMessage("This email is already registered.");
      return;
    }

    try {
      // Hash the password
      const passwordHash = await hashPassword(password);

      // Create a new profile
      const newProfile = {
        id: Date.now(),
        username: cleanUsername,
        email: cleanEmail,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString(),
      };

      // Add the new profile to the array
      profiles.push(newProfile);

      // Save profiles to localStorage
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));

      setFormMessage("Account created successfully!");

      // Clear the form
      setUsername("");
      setEmail("");
      setPassword("");

      // Redirect to the login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 550);
    } catch {
      setFormMessage(
        "Unable to save your profile. Please check your browser storage.",
      );
    }
  }

  return (
    <>
      <div className="signup-page">
        <title>Sign Up . My Book Library</title>
        <main className="card">
          <header className="brand">
            <div className="brandname">My Book Library</div>
            <p className="tagline">Small steps. Big stories.</p>
          </header>

          <section>
            <h1>Create your account</h1>
            <p className="intro">
              Start your reading journey today <em>✧</em>
            </p>

            <form id="signup-form" onSubmit={handleSubmit}>
              <label className="field">
                <b aria-hidden="true">♙</b>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  autocomplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </label>

              <label className="field">
                <b aria-hidden="true">✉</b>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  autocomplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>

              <label className="field">
                <b aria-hidden="true">♙</b>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  autocomplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <b
                  type="button"
                  className="toggle-password"
                  id="toggle-password"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  ◉
                </b>
              </label>

              <button className="primary" type="submit">
                Sign Up
              </button>
            </form>

            <p id="form-message" role="status" aria-live="polite">
              {formMessage}
            </p>

            <p className="switch">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </section>
        </main>
      </div>
    </>
  );
}

export default SignUp;
