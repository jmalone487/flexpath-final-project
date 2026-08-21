import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((response) => response.json())
      .then((product) => {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setQuantity(product.quantity);
      });
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          quantity: Number(quantity),
          public: true,
          categoryId: 1
        })
      });

      console.log("Update status:", response.status);

      if (response.ok) {
        window.location.href = "/products";
      } else {
        alert("Unable to update product. Status: " + response.status);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to update product.");
    }
  }

  return (
    <main className="container mt-5">
      <h1>Edit Product</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product Name</label>
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

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            min="0"
            className="form-control"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-dark">
          Save Changes
        </button>
      </form>
    </main>
  );
}

export default EditProduct;