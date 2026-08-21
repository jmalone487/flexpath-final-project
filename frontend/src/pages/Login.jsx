import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      console.log("Login status:", response.status);

      if (!response.ok) {
        throw new Error("Invalid username or password.");
      }

      const data = await response.json();

      localStorage.setItem("token", data.accessToken.token);
      localStorage.setItem("username", username);

      console.log("Login successful");

      window.location.href = "/products";
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <main className="container mt-5">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>

          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>

          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-dark">
          Login
        </button>
      </form>
    </main>
  );
}

export default Login;