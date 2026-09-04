import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { requestConfirmation } from "../components/NotificationHost";
import { apiUrl } from "../services/api";
import "../css/IssueBook.css";

function IssueBook() {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [bookId, setBookId] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchBooks();
    fetchIssuedBooks();
  }, []);

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const response = await fetch(
        apiUrl("getStudents.php")
      );

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.log("Student Error:", error);
    }
  };

  // Fetch Books
  const fetchBooks = async () => {
    try {
      const response = await fetch(
        apiUrl("getBooks.php")
      );

      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.log("Book Error:", error);
    }
  };

  // Fetch Issued Books
  const fetchIssuedBooks = async () => {
    try {
      const response = await fetch(
        apiUrl("getIssuedBooks.php")
      );

      const data = await response.json();
      setIssuedBooks(data);
    } catch (error) {
      console.log("Issued Books Error:", error);
    }
  };

  // Issue Book
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedStudent = students.find(
      (student) => student._id === studentId
    );

    const selectedBook = books.find(
      (book) => book._id === bookId
    );

    if (!selectedStudent || !selectedBook) {
      alert("Please select Student and Book");
      return;
    }

    try {
      const response = await fetch(
        apiUrl("issueBook.php"),
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            studentId: selectedStudent._id,
            studentName: selectedStudent.name,
            bookId: selectedBook._id,
            bookTitle: selectedBook.title,
            issueDate: issueDate,
            returnDate: returnDate,
          }),
        }
      );

      const result = await response.json();

      alert(result.message);

      fetchIssuedBooks();

      setStudentId("");
      setBookId("");
      setIssueDate("");
      setReturnDate("");

    } catch (error) {
      console.log("Issue Book Error:", error);
      alert("Something went wrong");
    }
  };

  // Return Book
  const handleReturn = async (id) => {
    const confirmReturn = await requestConfirmation(
      "Are you sure you want to return this book?"
    );

    if (!confirmReturn) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl("returnBook.php"),
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: id,
          }),
        }
      );

      const result = await response.json();

      alert(result.message);

      if (result.status === "success") {
        fetchIssuedBooks();
      }

    } catch (error) {
      console.log("Return Book Error:", error);
      alert("Something went wrong");
    }
  };

  const handleClearHistory = async () => {
    const confirmed = await requestConfirmation(
      "Returned books ki history clear karni hai? Active issued books safe rahengi."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        apiUrl("clearIssuedHistory.php"),
        { method: "DELETE" }
      );
      const result = await response.json();
      alert(result.message);

      if (result.status === "success") {
        fetchIssuedBooks();
      }
    } catch (error) {
      console.log("Clear History Error:", error);
      alert("Unable to clear issued books history");
    }
  };

  return (
    <>
      <Sidebar />

      <div className="main-content">
        <Header />

        <BackButton />
        <div className="issue-header">
          <h1>Issue Book</h1>
        </div>

        {/* Issue Book Form */}

        <div className="issue-form">

          <h2>Issue New Book</h2>

          <form onSubmit={handleSubmit}>

            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            >
              <option value="">
                Select Student
              </option>

              {students.map((student) => (
                <option
                  key={student._id}
                  value={student._id}
                >
                  {student.name}
                </option>
              ))}
            </select>


            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              required
            >
              <option value="">
                Select Book
              </option>

              {books.map((book) => (
                <option
                  key={book._id}
                  value={book._id}
                  disabled={book.quantity <= 0}
                >
                  {book.title} — Available: {book.quantity}
                  {book.quantity <= 0 ? " (Not Available)" : ""}
                </option>
              ))}
            </select>


            <div className="date-field">
              <label htmlFor="issue-date">Book Issued Date</label>
              <input
                id="issue-date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
              />
            </div>


            <div className="date-field">
              <label htmlFor="return-date">Book Returning Date (Due Date)</label>
              <input
                id="return-date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>


            <button type="submit">
              Issue Book
            </button>

          </form>

        </div>


        {/* Issued Books Table */}

        <div className="issued-books">
          <div className="issued-books-heading">
            <h2>Issued Books</h2>
            <button className="clear-history-btn" type="button" onClick={handleClearHistory}>
              Clear Returned History
            </button>
          </div>

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>Student</th>
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {issuedBooks.length > 0 ? (

                  issuedBooks.map((book) => (

                    <tr key={book._id}>

                      <td>
                        {book.studentName}
                      </td>

                      <td>
                        {book.bookTitle}
                      </td>

                      <td>
                        {book.issueDate}
                      </td>

                      <td>
                        {book.returnDate}
                      </td>

                      <td>

                        {book.status === "Issued" ? (

                          <span className="status-issued">
                            Issued
                          </span>

                        ) : (

                          <span className="returned">
                            Returned
                          </span>

                        )}

                      </td>


                      <td>

                        {book.status === "Issued" ? (

                          <button
                            className="return-btn"
                            onClick={() =>
                              handleReturn(book._id)
                            }
                          >
                            Return Book
                          </button>

                        ) : (

                          <span className="returned">
                            Returned
                          </span>

                        )}

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="no-books"
                    >
                      No Issued Books Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
}

export default IssueBook;