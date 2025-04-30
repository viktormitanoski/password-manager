import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setAuthData } from "../auth";
import { User } from "../types";

export default function Login() {
  const [user, setUser] = useState<User>({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/users/login", user);
  
      console.log("Login response:", res.data); // ✅ Show exact keys
  
      const { token, vaultKey } = res.data;
  
      if (!token || !vaultKey) {
        alert("Login succeeded but missing token or vaultKey.");
        return;
      }
  
      setAuthData(token, vaultKey);
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);  // ✅ Show full error
      alert(err.response?.data || "An error occurred during login.");
    }
  };
  

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="form-control my-2"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="form-control my-2"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-success">Login</button>
      </form>
    </div>
  );
}
