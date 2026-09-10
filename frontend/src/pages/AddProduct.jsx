import React, { useState } from "react";

function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  async function handleSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:8080/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            description,
            price: Number(price),
            quantity: Number(quantity),
            public: isPublic,
            categoryId: categoryId ? Number(categoryId) : null
          })
        }
      );

      if (response.ok) {
        window.location.href = "/products";
      } else {
        alert("Unable to add product. Status: " + response.status);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Unable to add product.");
    }
  }

  return (
    <main className="container mt-5">
      <h1>Add Product</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Product Name
          </label>

          <input
            id="productName"
            type="text"
            className="form-control"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productDescription" className="form-label">
            Description
          </label>

          <textarea
            id="productDescription"
            className="form-control"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productPrice" className="form-label">
            Price
          </label>

          <input
            id="productPrice"
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
          <label htmlFor="productQuantity" className="form-label">
            Quantity
          </label>

          <input
            id="productQuantity"
            type="number"
            min="0"
            className="form-control"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productCategory" className="form-label">
            Category ID
          </label>

          <input
            id="productCategory"
            type="number"
            min="1"
            className="form-control"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          />
        </div>

        <div className="form-check mb-3">
          <input
            id="publicProduct"
            type="checkbox"
            className="form-check-input"
            checked={isPublic}
            onChange={(event) => setIsPublic(event.target.checked)}
          />

          <label
            htmlFor="publicProduct"
            className="form-check-label"
          >
            Public Product
          </label>
        </div>

        <button type="submit" className="btn btn-dark">
          Add Product
        </button>
      </form>
    </main>
  );
}

export default AddProduct;