import React, { useState } from "react";
import axios from "axios";
import { User } from "../types";
import { Link } from "react-router-dom";
import PasswordGenerator from "./PasswordGenerator";

export default function Signup() {
  const [user, setUser] = useState<User>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [loading, setLoading] = useState(false); // ← Add loading state

  const isPasswordSecure = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordSecure(user.password)) {
      setError("Password must be at least 8 characters long, contain at least one number, and one special character.");
      setSuccess(null);
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/users/register", user);
      setSuccess("User registered successfully!");
      setError(null);
      setUser({ email: "", password: "" });
      setShowGenerator(false);
    } catch (err: any) {
      setError(err.response?.data || "Registration failed.");
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUseGeneratedPassword = (generatedPassword: string) => {
    setUser({ ...user, password: generatedPassword });
    setShowGenerator(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Link
        to="/"
        className="position-absolute top-0 start-0 mt-3 ms-3 text-decoration-none text-muted"
      >
        &larr; Back to Home
      </Link>
      <div className="card p-4" style={{ width: "100%", maxWidth: "420px" }}>
        <h3 className="text-center mb-4">Create Account</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

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
          <div className="form-group mb-2">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              placeholder="Enter a secure password"
            />
            <small className="form-text text-muted">
              Must be 8+ characters with at least 1 number and 1 special character
            </small>
          </div>

          <div className="mb-3 text-center">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowGenerator(!showGenerator)}
            >
              {showGenerator ? "Hide Generator" : "Generate a strong password"}
            </button>
          </div>

          {showGenerator && (
            <div className="mb-3">
              <PasswordGenerator onUsePassword={handleUseGeneratedPassword} />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-success w-100 mb-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="text-center mt-2">
          <small>
            Already registered? <Link to="/login">Login here</Link>
          </small>
        </div>
      </div>
    </div>
  );
}