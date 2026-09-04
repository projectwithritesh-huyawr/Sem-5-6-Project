import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import Header from "../components/Header";
import AddBook from "../components/AddBook";
import { requestConfirmation } from "../components/NotificationHost";
import { apiUrl } from "../services/api";
import "../css/Books.css";

function Books() {
  const [books, setBooks] = useState([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        apiUrl("getBooks.php")
      );

      const data = await response.json();

      console.log("BOOKS:", data);

      setBooks(data);
    } catch (error) {
      console.log("Fetch Books Error:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = await requestConfirmation(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        apiUrl("deleteBook.php"),
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
        fetchBooks();
      }

    } catch (error) {
      console.log("Delete Book Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="main-content">

      <Header />

      <BackButton />

      <div className="book-header">
        <h1>Manage Books</h1>
      </div>

      <AddBook
        onBookAdded={fetchBooks}
        title={title}
        setTitle={setTitle}
        author={author}
        setAuthor={setAuthor}
        category={category}
        setCategory={setCategory}
        quantity={quantity}
        setQuantity={setQuantity}
        editId={editId}
        setEditId={setEditId}
      />

      <div className="book-table">

        <table>

          <thead>

            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Total</th>
              <th>Available</th>
              <th>Issued</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {books.length > 0 ? (

              books.map((book) => {

                const total = Number(book.totalQuantity ?? book.quantity ?? 0);

                const available = Number(book.quantity ?? 0);

                const issued = Math.max(
                  total - available,
                  0
                );

                return (
                  <tr key={book._id}>

                    <td>{book.title}</td>

                    <td>{book.author}</td>

                    <td>{book.category}</td>

                    <td>{total}</td>

                    <td>{available}</td>

                    <td>{issued}</td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() => {

                          setEditId(book._id);

                          setTitle(book.title);

                          setAuthor(book.author);

                          setCategory(book.category);

                          setQuantity(total);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(book._id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                );
              })

            ) : (

              <tr>

                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >
                  No Books Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Books;