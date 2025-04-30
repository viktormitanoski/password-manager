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
  const [editId, setEditId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthData();
    navigate("/");
  };

  const fetchEntries = async () => {
    try {
      const res = await API.get("/password-entries");
      setEntries(res.data);
    } catch (err) {
      alert("Session expired. Please log in again.");
      handleLogout();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId !== null) {
        // Update existing entry
        await API.put(`/password-entries/${editId}`, form);
        setEditId(null);
      } else {
        // Create new entry
        await API.post("/password-entries", form);
      }
      setForm({ siteName: "", siteEmail: "", sitePassword: "" });
      fetchEntries();
    } catch (err) {
      alert("Error saving entry.");
    }
  };

  const handleEdit = (entry: PasswordEntry) => {
    setEditId(entry.id!);
    setForm({
      siteName: entry.siteName,
      siteEmail: entry.siteEmail,
      sitePassword: entry.sitePassword,
    });
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    const confirmed = window.confirm("Are you sure you want to delete this password?");
    if (!confirmed) return;

    try {
      await API.delete(`/password-entries/${id}`);
      fetchEntries();
    } catch (err) {
      alert("Failed to delete entry.");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="container my-5">
      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>🛡️ Your Vault</h2>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Site Name"
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Site Email"
                value={form.siteEmail}
                onChange={(e) => setForm({ ...form, siteEmail: e.target.value })}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Password"
                value={form.sitePassword}
                onChange={(e) => setForm({ ...form, sitePassword: e.target.value })}
                required
              />
            </div>
          </div>
          <button className="btn btn-primary w-100">
            {editId !== null ? "Update Entry" : "Save Password"}
          </button>
        </form>

        {entries.length === 0 ? (
          <div className="text-center mt-5 text-muted">
            <h5>Your vault is empty.</h5>
          </div>
        ) : (
          <table className="table table-striped table-hover mt-4 shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Site</th>
                <th>Email</th>
                <th>Password</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.siteName}</td>
                  <td>{entry.siteEmail}</td>
                  <td>{entry.sitePassword}</td>
                  <td>{new Date(entry.createdAt || "").toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(entry)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(entry.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
