import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/edit-book.css";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    status: "reading",
    dateAdded: "",
    description: "",
    cover: null,
  });

  // Load the selected book
  useEffect(() => {
    const savedBooks = JSON.parse(localStorage.getItem("mbl-books") || "[]");

    const selectedBook = savedBooks.find((item) => String(item.id) === id);

    if (selectedBook) {
      setBook({
        title: selectedBook.title || "",
        author: selectedBook.author || "",
        genre: selectedBook.genre || "",
        status: selectedBook.status || "reading",
        dateAdded: selectedBook.dateAdded || "",
        description: selectedBook.description || "",
        cover: selectedBook.cover || null,
      });
    } else {
      alert("Book not found!");
      navigate("/home");
    }
  }, [id, navigate]);

  // Update form values
  function handleChange(e) {
    const { name, value } = e.target;

    setBook({
      ...book,
      [name]: value,
    });
  }

  // Handle cover image
  function handleCover(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setBook((previous) => ({
        ...previous,
        cover: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  // Save changes
  function handleSubmit(e) {
    e.preventDefault();

    const savedBooks = JSON.parse(localStorage.getItem("mbl-books") || "[]");

    const updatedBooks = savedBooks.map((item) =>
      String(item.id) === id ? { ...item, ...book } : item,
    );

    localStorage.setItem("mbl-books", JSON.stringify(updatedBooks));

    alert("Book updated successfully!");
    navigate("/home");
  }

  function handleDelete() {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${book.title}"? This action cannot be undone.`,
    );

    if (!confirmDelete) return;

    const savedBooks = JSON.parse(localStorage.getItem("mbl-books") || "[]");

    const updatedBooks = savedBooks.filter((item) => String(item.id) !== id);

    localStorage.setItem("mbl-books", JSON.stringify(updatedBooks));

    alert("Book deleted successfully!");
    navigate("/home");
  }

  return (
    <>
      <title>Edit . My Book Library</title>
      <div className="edit-page">
        <main
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <header className="modal-header">
            <div>
              <p className="eyebrow">MY BOOK LIBRARY</p>
              <h1 id="dialog-title">Edit book</h1>
            </div>

            <button
              className="close"
              type="button"
              onClick={() => navigate("/home")}
              aria-label="Close"
            >
              ×
            </button>
          </header>

          <form className="editor" onSubmit={handleSubmit}>
            <aside className="cover-column">
              <label className="upload-box">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleCover}
                />

                {book.cover && (
                  <img
                    src={book.cover}
                    alt="Book cover preview"
                    className="image"
                  />
                )}

                <span className="picture-icon" aria-hidden="true">
                  ▧
                </span>

                <span>
                  Click to upload cover image
                  <br />
                  or drag and drop
                </span>

                <small>JPG, PNG (max 5MB)</small>
              </label>
            </aside>

            <section className="fields">
              <label className="form-label">
                Book Title <span>*</span>
                <input
                  type="text"
                  name="title"
                  value={book.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                />
              </label>

              <label className="form-label">
                Author <span>*</span>
                <input
                  type="text"
                  name="author"
                  value={book.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                />
              </label>

              <label className="form-label">
                Genre
                <select name="genre" value={book.genre} onChange={handleChange}>
                  <option value="">Select genre</option>
                  <option>Fantasy</option>
                  <option>Fiction</option>
                  <option>Mystery</option>
                  <option>Romance</option>
                  <option>Science fiction</option>
                  <option>Non-fiction</option>
                </select>
              </label>

              <fieldset className="status-group">
                <legend>Status</legend>

                <div className="status-options">
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="reading"
                      checked={book.status === "reading"}
                      onChange={handleChange}
                    />
                    <span>Reading</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="completed"
                      checked={book.status === "completed"}
                      onChange={handleChange}
                    />
                    <span>Completed</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="want-to-read"
                      checked={book.status === "want-to-read"}
                      onChange={handleChange}
                    />
                    <span>Want to Read</span>
                  </label>
                </div>
              </fieldset>

              <label className="form-label date-label">
                Date Added
                <input
                  type="date"
                  name="dateAdded"
                  value={book.dateAdded}
                  onChange={handleChange}
                />
              </label>

              <label className="form-label description-label">
                Description
                <textarea
                  name="description"
                  maxLength={500}
                  value={book.description}
                  onChange={handleChange}
                  placeholder="Write a short description about the book..."
                />
                <small className="counter">{book.description.length}/500</small>
              </label>

              <div className="actions">
                <button
                  className="cancel"
                  type="button"
                  onClick={() => navigate("/home")}
                >
                  Cancel
                </button>

                <button className="save" type="submit">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="delete-button"
                  onClick={handleDelete}
                >
                  Delete Book
                </button>
              </div>
            </section>
           
          </form>
        </main>
      </div>
    </>
  );
}

export default Edit;
