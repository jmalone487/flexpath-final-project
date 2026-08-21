import React, { useState } from "react";

function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        description,
        public: isPublic
      })
    });

    if (response.ok) {
      window.location.href = "/categories";
    } else {
      alert("Unable to add category. Status: " + response.status);
    }
  }

  return (
    <main className="container mt-5">
      <h1>Add Category</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={isPublic}
            onChange={(event) => setIsPublic(event.target.checked)}
          />

          <label className="form-check-label">
            Public Category
          </label>
        </div>

        <button type="submit" className="btn btn-dark">
          Add Category
        </button>
      </form>
    </main>
  );
}

export default AddCategory;