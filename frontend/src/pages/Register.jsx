import { Link } from "react-router-dom";
import { useState } from "react";
import { apiUrl } from "../services/api";
import "../css/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        apiUrl("register.php"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            username,
            email,
            course,
            year,
            password,
          }),
        }
      );

      const result = await response.json();

      alert(result.message);

      if (result.success) {
        setName("");
        setUsername("");
        setEmail("");
        setCourse("");
        setYear("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.log("Registration Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="register-page">
      <div className="register-orbit register-orbit-one" />
      <div className="register-orbit register-orbit-two" />
      <main className="register-shell">
        <section className="register-intro">
          <div className="register-brand-mark">L</div>
          <p className="register-eyebrow">JOIN THE READING ROOM</p>
          <h1>Find your next<br />favourite book.</h1>
          <p className="register-intro-copy">Create your library account and keep every chapter of your reading life close.</p>
          <div className="register-book-stacks" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className="register-box">
          <div className="register-heading">
            <p className="register-eyebrow">GET STARTED</p>
            <h2>Student Registration</h2>
            <p>Create your account to access the library.</p>
          </div>

          <form onSubmit={handleRegister}>

          <label htmlFor="register-name">Full name</label>
          <input
            id="register-name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="register-course">Course</label>
          <input
            id="register-course"
            type="text"
            placeholder="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />

          <label htmlFor="register-year">Year</label>
          <input
            id="register-year"
            type="text"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="register-confirm-password">Confirm password</label>
          <input
            id="register-confirm-password"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button className="register-submit" type="submit">
            Register <span aria-hidden="true">-&gt;</span>
          </button>

          </form>

          <p className="register-login-prompt">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

        </section>
      </main>
    </div>
  );
}

export default Register;