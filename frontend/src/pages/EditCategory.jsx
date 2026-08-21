import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EditCategory() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    fetch(`/api/categories/${id}`)
      .then((response) => response.json())
      .then((category) => {
        setName(category.name);
        setDescription(category.description);
        setIsPublic(category.public);
      });
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
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
        alert("Unable to update category. Status: " + response.status);
      }
    } catch (error) {
      alert("Unable to update category.");
    }
  }

  return (
    <main className="container mt-5">
      <h1>Edit Category</h1>

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
          Save Changes
        </button>
      </form>
    </main>
  );
}

export default EditCategory;