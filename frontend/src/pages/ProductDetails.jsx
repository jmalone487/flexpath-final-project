import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Product not found.");
        }

        return response.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [id]);

  if (error) {
    return (
      <main className="container mt-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <Link
          to="/products"
          className="btn btn-dark"
        >
          Back to Products
        </Link>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mt-5">
        <p>Loading product...</p>
      </main>
    );
  }

  return (
    <main className="container mt-5">

      <div className="card shadow-sm">

        <div className="card-body">

          <h1>
            {product.name}
          </h1>

          <p className="lead">
            {product.description}
          </p>

          <h3>
            ${Number(product.price).toFixed(2)}
          </h3>

          <p>
            Quantity in stock: {product.quantity}
          </p>

          <Link
            to="/products"
            className="btn btn-dark"
          >
            Back to Products
          </Link>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;