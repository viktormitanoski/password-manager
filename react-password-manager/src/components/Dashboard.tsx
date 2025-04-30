import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { PasswordEntry } from "../types";
import { clearAuthData } from "../auth";

export default function Dashboard() {
  const [form, setForm] = useState<PasswordEntry>({
    siteName: "",
    siteEmail: "",
    sitePassword: "",
  });

  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthData();         // Clear token and vaultKey from storage
    navigate("/");           // Redirect to login page
  };

  const fetchEntries = async () => {
    try {
      const res = await API.get("/password-entries");
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch entries:", err);
      alert("Session expired or unauthorized. Please log in again.");
      handleLogout(); // Optional: auto-logout if unauthorized
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post("/password-entries", form);
      setForm({ siteName: "", siteEmail: "", sitePassword: "" });
      fetchEntries(); // Refresh entries after saving
    } catch (err) {
      console.error("Failed to create entry:", err);
      alert("Error creating entry.");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Password Vault</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Site Name"
          className="form-control my-2"
          value={form.siteName}
          onChange={(e) => setForm({ ...form, siteName: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Site Email"
          className="form-control my-2"
          value={form.siteEmail}
          onChange={(e) => setForm({ ...form, siteEmail: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Password"
          className="form-control my-2"
          value={form.sitePassword}
          onChange={(e) => setForm({ ...form, sitePassword: e.target.value })}
          required
        />
        <button className="btn btn-primary">Save Password</button>
      </form>

      <table className="table table-striped table-bordered mt-4">
        <thead>
          <tr>
            <th>Site</th>
            <th>Email</th>
            <th>Password</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.siteName}</td>
              <td>{entry.siteEmail}</td>
              <td>{entry.sitePassword}</td>
              <td>{new Date(entry.createdAt || "").toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
