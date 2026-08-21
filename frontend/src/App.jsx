import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AddCategory from "./pages/AddCategory";
import EditCategory from "./pages/EditCategory";

function App() {
  const username = localStorage.getItem("username");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/";
  }

  return (
    <BrowserRouter>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
          <div className="container-fluid">

            <Link className="navbar-brand" to="/">
              Bobbi J
            </Link>

            <div className="navbar-nav align-items-center">
              <Link className="nav-link" to="/">
                Home
              </Link>

              <Link className="nav-link" to="/products">
                Products
              </Link>

              <Link className="nav-link" to="/categories">
                Categories
              </Link>

              {username && (
                <Link className="nav-link" to="/products/add">
                  Add Product
                </Link>
              )}

              {username && (
                <Link className="nav-link" to="/categories/add">
                  Add Category
                </Link>
              )}

              {username ? (
                <>
                  <span className="navbar-text ms-3 me-3">
                    {username}
                  </span>

                  <button
                    className="btn btn-outline-light"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              )}
            </div>

          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/:id/edit" element={<EditProduct />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/add" element={<AddCategory />} />
          <Route
            path="/categories/:id/edit"
            element={<EditCategory />}
          />

          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;