
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiUrl } from "../services/api";
import "../css/Home.css";

function Home() {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchStudents();
    fetchIssuedBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        apiUrl("getBooks.php")
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setBooks(data);
      }
    } catch (error) {
      console.log("Books Error:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        apiUrl("getStudents.php")
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (error) {
      console.log("Students Error:", error);
    }
  };

  const fetchIssuedBooks = async () => {
    try {
      const response = await fetch(
        apiUrl("getIssuedBooks.php")
      );

      const data = await response.json();

      if (Array.isArray(data)) {
        setIssuedBooks(data);
      }
    } catch (error) {
      console.log("Issued Books Error:", error);
    }
  };

  const currentlyIssued = issuedBooks.filter(
    (book) =>
      book.status === "Issued" ||
      book.status === "Overdue"
  ).length;

  const returnedBooks = issuedBooks.filter(
    (book) => book.status === "Returned"
  ).length;

  return (
    <>
      <Navbar />

      <section className="hero">
        <h1>Library Management System</h1>

        <p>
          Welcome to our digital library. Manage books, students,
          issue and return books easily.
        </p>

        <Link to="/register">
          <button>Get Started</button>
        </Link>
      </section>

      <section className="facts">

        <div className="card">
          <h2>{books.length}</h2>
          <p>Books</p>
        </div>

        <div className="card">
          <h2>{students.length}</h2>
          <p>Students</p>
        </div>

        <div className="card">
          <h2>{currentlyIssued}</h2>
          <p>Issued Books</p>
        </div>

        <div className="card">
          <h2>{returnedBooks}</h2>
          <p>Returned Books</p>
        </div>

      </section>

      <section className="features">

        <h2>Our Features</h2>

        <div className="feature-container">

          <div className="feature-card">
            <h3>📚 Book Management</h3>
            <p>Add, Update and Delete books easily.</p>
          </div>

          <div className="feature-card">
            <h3>👨‍🎓 Student Records</h3>
            <p>Manage student information efficiently.</p>
          </div>

          <div className="feature-card">
            <h3>📖 Issue Books</h3>
            <p>Issue books to students with one click.</p>
          </div>

          <div className="feature-card">
            <h3>🔄 Return Books</h3>
            <p>Track returned books automatically.</p>
          </div>

          <div className="feature-card">
            <h3>🔍 Search Books</h3>
            <p>Find any book instantly.</p>
          </div>

          <div className="feature-card">
            <h3>📊 Reports</h3>
            <p>View library reports anytime.</p>
          </div>

        </div>

      </section>

      <section className="latest-books">

        <h2>Latest Books</h2>

        <div className="book-container">

          <div className="book-card">
            <img
              src="https://covers.openlibrary.org/b/isbn/9780140328721-M.jpg"
              alt="Matilda"
            />

            <h3>Matilda</h3>
            <p>Roald Dahl</p>

            <button>Available</button>
          </div>

          <div className="book-card">
            <img
              src="https://covers.openlibrary.org/b/isbn/9780439554930-M.jpg"
              alt="Harry Potter"
            />

            <h3>Harry Potter</h3>
            <p>J.K. Rowling</p>

            <button>Available</button>
          </div>

          <div className="book-card">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyKjtzaduCXdRaT1V9mBrBV5JMXPqA6XaRFL2B4lBgeg&s=10"
              alt="Python"
            />

            <h3>Python</h3>
            <p>Python Programming</p>

            <button>Available</button>
          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Home;

