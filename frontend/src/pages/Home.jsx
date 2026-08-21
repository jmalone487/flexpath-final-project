import React from "react";

function Home() {
  return (
    <main className="container text-center mt-5">
      <h1>Welcome to Bobbi J</h1>

      <p className="lead">
        Discover products selected for everyday life.
      </p>

      <a href="/products" className="btn btn-dark mt-3">
        Shop Products
      </a>
    </main>
  );
}

export default Home;