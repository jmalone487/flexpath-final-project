import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [usernameSearch, setUsernameSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8080/api/products",
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`
              }
            : {}
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load products.");
      }

      const data = await response.json();
      setProducts(data);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    const url =
      "http://localhost:8080/api/products/search" +
      `?name=${encodeURIComponent(nameSearch)}` +
      `&username=${encodeURIComponent(usernameSearch)}`;

    try {
      const response = await fetch(url, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {}
      });

      if (!response.ok) {
        throw new Error("Unable to search products.");
      }

      const data = await response.json();
      setProducts(data);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  function handleClearSearch() {
    setNameSearch("");
    setUsernameSearch("");
    loadProducts();
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8080/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setProducts(
          products.filter((product) => product.id !== id)
        );
      } else {
        alert(
          "Unable to delete product. Status: " +
            response.status
        );
      }
    } catch (error) {
      alert("Unable to delete product.");
    }
  }

  const displayedProducts = [...products].sort((a, b) => {
    if (sortOrder === "price-low") {
      return Number(a.price) - Number(b.price);
    }

    if (sortOrder === "price-high") {
      return Number(b.price) - Number(a.price);
    }

    if (sortOrder === "name-az") {
      return a.name.localeCompare(b.name);
    }

    if (sortOrder === "name-za") {
      return b.name.localeCompare(a.name);
    }

    return 0;
  });

  return (
    <main className="container mt-5">
      <h1>Bobbi J Products</h1>

      <p className="lead">
        Discover products selected for everyday life.
      </p>

      <form onSubmit={handleSearch} className="row mb-4">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by product name..."
            value={nameSearch}
            onChange={(event) =>
              setNameSearch(event.target.value)
            }
          />
        </div>

        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by username..."
            value={usernameSearch}
            onChange={(event) =>
              setUsernameSearch(event.target.value)
            }
          />
        </div>

        <div className="col-md-2 mb-2">
          <button
            type="submit"
            className="btn btn-dark w-100"
          >
            Search
          </button>
        </div>

        <div className="col-md-2 mb-2">
          <button
            type="button"
            className="btn btn-outline-secondary w-100"
            onClick={handleClearSearch}
          >
            Clear
          </button>
        </div>
      </form>

      <div className="row mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
          >
            <option value="">Sort Products</option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="name-az">
              Name: A to Z
            </option>

            <option value="name-za">
              Name: Z to A
            </option>
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

                <p>
                  Seller: {product.username}
                </p>

                {!product.public && (
                  <p className="text-muted">
                    Private Product
                  </p>
                )}

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
                  onClick={() =>
                    handleDelete(product.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayedProducts.length === 0 &&
        !error && (
          <div className="alert alert-secondary">
            No products found.
          </div>
        )}
    </main>
  );
}

export default Products;