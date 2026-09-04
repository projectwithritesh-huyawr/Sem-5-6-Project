import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import "../css/Login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        apiUrl("login.php"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        localStorage.setItem("profileRole", result.role);
        setNotice({
          type: "success",
          title: "Login successful",
          text: "Aapka login ho gaya hai. Welcome back!"
        });

        if (result.role === "admin") {
          localStorage.setItem("username", result.username || "admin");
          setTimeout(() => navigate("/admin-dashboard"), 1100);
        } else if (result.role === "student") {

          localStorage.setItem("studentId", result.studentId);
          localStorage.setItem("username", result.username);

          setTimeout(() => navigate("/student-dashboard"), 1100);
        }
      } else {
        setNotice({
          type: "error",
          title: "Login failed",
          text: result.message || "Username ya password check karein."
        });
      }
    } catch (error) {
      console.error(error);
      setNotice({
        type: "error",
        title: "Server error",
        text: "Server se connection nahi ho paaya. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-orbit orbit-one" />
      <div className="login-orbit orbit-two" />
      <main className="login-shell">
        <section className="login-intro">
          <div className="brand-mark">L</div>
          <p className="eyebrow">THE READING ROOM</p>
          <h1>Open a world<br />of stories.</h1>
          <p className="intro-copy">Your library, beautifully organized. Sign in to continue your reading journey.</p>
          <div className="book-stacks" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className="login-box">
          <div className="login-heading">
            <p className="eyebrow">WELCOME BACK</p>
            <h2>Sign in to Library</h2>
            <p>Access your books and account.</p>
          </div>

          <form onSubmit={handleLogin}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="login-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
            {!isLoading && <span aria-hidden="true">-&gt;</span>}
          </button>
          </form>
          <p className="register-prompt">New to the library? <a href="/register">Create an account</a></p>
        </section>
      </main>
      {notice && (
        <div className="login-notice-backdrop">
          <div className={`login-notice ${notice.type}`} role="alert">
            <div className="notice-icon">{notice.type === "success" ? "✓" : "!"}</div>
            <div>
              <h2>{notice.title}</h2>
              <p>{notice.text}</p>
            </div>
            {notice.type === "error" && (
              <button type="button" onClick={() => setNotice(null)}>Try again</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;