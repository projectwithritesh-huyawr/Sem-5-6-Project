import "../css/about.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/about.css";

function About() {
  return (
    <>
      <Navbar />

      <section className="about">
        <h1>About Our Library</h1>

        <p>
          Our Library Management System is designed to make library
          operations simple, fast, and efficient. Students and librarians
          can easily manage books, issue and return books, and maintain
          records digitally.
        </p>

        <div className="about-boxes">

          <div className="about-card">
            <h2>📚 5000+</h2>
            <p>Books Available</p>
          </div>

          <div className="about-card">
            <h2>👨‍🎓 1000+</h2>
            <p>Students Registered</p>
          </div>

          <div className="about-card">
            <h2>🏫 Since 2026</h2>
            <p>Serving Students</p>
          </div>

        </div>

        <h2 className="mission-title">Our Mission</h2>

        <p className="mission">
          To provide a modern, digital, and user-friendly library system
          that helps students and librarians manage books efficiently.
        </p>

      </section>

      <Footer />
    </>
  );
}

export default About;