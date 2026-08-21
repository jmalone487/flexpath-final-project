import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load categories.");
        }

        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCategories(
          categories.filter((category) => category.id !== id)
        );
      } else {
        alert(
          "Unable to delete category. Status: " + response.status
        );
      }
    } catch (error) {
      alert("Unable to delete category.");
    }
  }

  return (
    <main className="container mt-5">
      <h1>Categories</h1>

      <p className="lead">
        Browse Bobbi J products by category.
      </p>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="row">
        {categories.map((category) => (
          <div
            className="col-md-4 mb-4"
            key={category.id}
          >
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  {category.name}
                </h5>

                <p className="card-text">
                  {category.description}
                </p>

                <Link
                  to={`/categories/${category.id}/edit`}
                  className="btn btn-outline-dark"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  className="btn btn-outline-danger ms-2"
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Categories;