import "../styles/edit-book.css";
import { useState } from "react";

function Add() {
  const [status, setStatus] = useState("reading");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const book = {
      id: Date.now(),
      title: formData.get("title"),
      author: formData.get("author"),
      genre: formData.get("genre") || "Uncategorized",
      status: status,
      dateAdded: formData.get("date-added"),
      description: description,
      cover: cover,
    };

    try {
      const existingBooks = JSON.parse(
        localStorage.getItem("mbl-books") || "[]",
      );

      existingBooks.push(book);

      localStorage.setItem("mbl-books", JSON.stringify(existingBooks));

      alert("Book added successfully!");

      e.target.reset();
      setStatus("reading");
      setDescription("");
      setCover(null);

      window.location.href = "/home";
    } catch {
      alert(
        "Unable to save this book. The image may be too large. Try a smaller image.",
      );
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setCover(reader.result);
    };

    reader.readAsDataURL(file);
  }

  return (
    <>
      <title>Add . My Book Library</title>
      <div className="edit-page">
        {" "}
        <main
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          {" "}
          <header className="modal-header">
            {" "}
            <div>
              {" "}
              <p className="eyebrow">MY BOOK LIBRARY</p>{" "}
              <h1 id="dialog-title">Add a new book</h1>{" "}
            </div>
            <a className="close" href="/home" aria-label="Close">
              ×
            </a>
          </header>
          <form className="editor" onSubmit={handleSubmit}>
            <aside className="cover-column">
              <label className="upload-box">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                />

                {cover ? (
                  <img
                    src={cover}
                    alt="Book cover preview"
                    style={{
                      width: "100%",
                      maxHeight: "220px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <>
                    <span className="picture-icon" aria-hidden="true">
                      ▧
                    </span>
                    <span>
                      Click to upload cover image
                      <br />
                      or drag and drop
                    </span>
                    <small>JPG, PNG, WebP (max 5MB)</small>
                  </>
                )}
              </label>
            </aside>

            <section className="fields">
              <label className="form-label">
                Book Title <span>*</span>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter book title"
                  required
                />
              </label>

              <label className="form-label">
                Author <span>*</span>
                <input
                  type="text"
                  name="author"
                  placeholder="Enter author name"
                  required
                />
              </label>

              <label className="form-label">
                Genre
                <select name="genre" defaultValue="">
                  <option value="">Select genre</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Science fiction">Science fiction</option>
                  <option value="Non-fiction">Non-fiction</option>
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
                      checked={status === "reading"}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <span>Reading</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="completed"
                      checked={status === "completed"}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <span>Completed</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="want-to-read"
                      checked={status === "want-to-read"}
                      onChange={(e) => setStatus(e.target.value)}
                    />
                    <span>Want to Read</span>
                  </label>
                </div>
              </fieldset>

              <label className="form-label date-label">
                Date Added
                <input
                  type="date"
                  name="date-added"
                  defaultValue={new Date().toLocaleDateString("en-CA")}
                />
              </label>

              <label className="form-label description-label">
                Description
                <textarea
                  name="description"
                  maxLength={500}
                  placeholder="Write a short description about the book..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <small className="counter">{description.length}/500</small>
              </label>

              <div className="actions">
                <a className="cancel" href="/home">
                  Cancel
                </a>

                <button className="save" type="submit">
                  Add
                </button>
              </div>
            </section>
          </form>
        </main>
      </div>
    </>
  );
}

export default Add;
