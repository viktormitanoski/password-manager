import React, { useState } from "react";
import axios from "axios";
import { User } from "../types";
import { Link } from "react-router-dom";

export default function Signup() {
  const [user, setUser] = useState<User>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

    try {
      await axios.post("http://localhost:8080/users/register", user);
      setSuccess("User registered successfully!");
      setError(null);
      setUser({ email: "", password: "" });
    } catch (err: any) {
      setError(err.response?.data || "Registration failed.");
      setSuccess(null);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "100%", maxWidth: "420px" }}>
        <h3 className="text-center mb-4">📝 Create Account</h3>

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
          <div className="form-group mb-4">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              placeholder="Create a secure password"
            />
            <small className="form-text text-muted">
              Must be 8+ characters with at least 1 number and 1 special character
            </small>
          </div>
          <button type="submit" className="btn btn-success w-100 mb-2">Register</button>
        </form>

        <div className="text-center mt-2">
          <small>
            Already registered? <Link to="/">Login here</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
