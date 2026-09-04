import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { requestConfirmation } from "../components/NotificationHost";
import { apiUrl } from "../services/api";
import "../css/ReturnBook.css";

function ReturnBook() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  const studentId = searchParams.get("studentId");

  useEffect(() => {
    if (studentId) {
      fetchIssuedBooks();
    } else {
      console.log("Student ID not found in URL");
      setLoading(false);
    }
  }, [studentId]);

  const fetchIssuedBooks = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        apiUrl("getIssuedBooks.php")
      );

      const data = await response.json();

      console.log("Student ID from URL:", studentId);
      console.log("Issued Books:", data);

      if (!Array.isArray(data)) {
        console.log("Invalid issued books data");
        setIssuedBooks([]);
        return;
      }

      const studentBooks = data.filter(
        (book) =>
          String(book.studentId).trim() === String(studentId).trim() &&
          String(book.status).trim().toLowerCase() === "issued"
      );

      console.log("Books for selected student:", studentBooks);

      setIssuedBooks(studentBooks);

      if (studentBooks.length > 0) {
        setStudentName(studentBooks[0].studentName || "");
      } else {
        setStudentName("");
      }

    } catch (error) {
      console.log("Issued Books Error:", error);
      alert("Unable to load issued books");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!studentId) {
    return (
      <>
        <Sidebar />

        <div className="main-content">
          <Header />

          <div className="return-book-page">

            <h1>Return Book</h1>

            <div className="no-return-books">

              <h2>
                Student Not Selected
              </h2>

              <p>
                Student ID was not provided.
              </p>

            </div>

          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar />

      <div className="main-content">

        <Header />

        <div className="return-book-page">

          <h1>Return Book</h1>

          {studentName && (
            <h2>
              Student: {studentName}
            </h2>
          )}

          {issuedBooks.length > 0 ? (

            <div className="return-books-container">

              {issuedBooks.map((book) => (

                <div
                  className="return-book-card"
                  key={book._id}
                >

                  <div className="return-book-info">

                    <h2>
                      {book.bookTitle}
                    </h2>

                    <p>
                      <strong>Issue Date:</strong>{" "}
                      {book.issueDate || "-"}
                    </p>

                    <p>
                      <strong>Due Date:</strong>{" "}
                      {book.returnDate || "-"}
                    </p>

                    <p>
                      <strong>Late Days:</strong>{" "}
                      {book.lateDays || 0}
                    </p>

                    <p>
                      <strong>Fine:</strong>{" "}
                      ₹{book.fine || 0}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {book.status}
                    </p>

                  </div>

                  <button
                    className="return-book-btn"
                    onClick={() =>
                      handleReturn(book._id)
                    }
                  >
                    Return Book
                  </button>

                </div>

              ))}

            </div>

          ) : (

            <div className="no-return-books">

              <h2>
                No Issued Books Found
              </h2>

              <p>
                This student currently has no issued books.
              </p>

            </div>

          )}

        </div>

      </div>
    </>
  );
}

export default ReturnBook;