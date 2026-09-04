import { apiUrl } from "../services/api";
import "../css/AddBook.css";

function AddBook({
  onBookAdded,
  title,
  setTitle,
  author,
  setAuthor,
  category,
  setCategory,
  quantity,
  setQuantity,
  editId,
  setEditId,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? apiUrl("updateBook.php")
      : apiUrl("addBook.php");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editId,
          title,
          author,
          category,
          quantity,
        }),
      });

      const result = await response.json();

      alert(result.message);

      if (result.status === "success") {
        setTitle("");
        setAuthor("");
        setCategory("");
        setQuantity("");
        setEditId(null);

        onBookAdded();
      }
    } catch (error) {
      console.log("Add Book Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="add-book">
      <h2>
        {editId ? "Update Book" : "Add New Book"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button type="submit">
          {editId ? "Update Book" : "Save Book"}
        </button>
      </form>
    </div>
  );
}

export default AddBook;