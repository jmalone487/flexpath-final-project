import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load products.");
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => setError(error.message));
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProducts(
          products.filter((product) => product.id !== id)
        );
      } else {
        alert("Unable to delete product. Status: " + response.status);
      }
    } catch (error) {
      alert("Unable to delete product.");
    }
  }

  const displayedProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "low") {
        return Number(a.price) - Number(b.price);
      }

      if (sortOrder === "high") {
        return Number(b.price) - Number(a.price);
      }

      return 0;
    });

  return (
    <main className="container mt-5">
      <h1>Bobbi J Products</h1>

      <p className="lead">
        Discover products selected for everyday life.
      </p>

      <div className="row mb-4">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="">Sort Products</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="row">
        {displayedProducts.map((product) => (
          <div
            className="col-md-4 mb-4"
            key={product.id}
          >
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  {product.name}
                </h5>

                <p className="card-text">
                  {product.description}
                </p>

                <h4>
                  ${Number(product.price).toFixed(2)}
                </h4>

                <p>
                  In Stock: {product.quantity}
                </p>

                <Link
                  to={`/products/${product.id}`}
                  className="btn btn-dark"
                >
                  View Product
                </Link>

                <Link
                  to={`/products/${product.id}/edit`}
                  className="btn btn-outline-dark ms-2"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  className="btn btn-outline-danger ms-2"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayedProducts.length === 0 && !error && (
        <div className="alert alert-secondary">
          No products found.
        </div>
      )}
    </main>
  );
}

export default Products;
