import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { setAuthData } from "../auth";
import { User } from "../types";

export default function Login() {
  const [user, setUser] = useState<User>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/users/login", user);
      const { token, vaultKey } = res.data;
      setAuthData(token, vaultKey);
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "100%", maxWidth: "420px" }}>
        <h3 className="text-center mb-4">🔐 Welcome Back</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mb-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="text-center mt-2">
          <small>
            New here? <Link to="/register">Create an account</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
