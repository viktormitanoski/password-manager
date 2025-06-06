import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthHeaders } from "../services/api";
import { PasswordEntry } from "../types";
import { useAuth } from "../auth";
import { QRCodeCanvas } from "qrcode.react";
import PasswordGenerator from "./PasswordGenerator";

export default function Dashboard() {
  const [form, setForm] = useState<PasswordEntry>({
    siteName: "",
    siteEmail: "",
    sitePassword: "",
  });

  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [showQR, setShowQR] = useState<PasswordEntry | null>(null);
  const [includeEmail, setIncludeEmail] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);
  const { token, vaultKey, clearAuthData } = useAuth();
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

  const getDecryptedPassword = async (id: number): Promise<string> => {
    try {
      const res = await API.get(`/password-entries/${id}`);
      return res.data.sitePassword;
    } catch (err) {
      alert("Failed to retrieve password.");
      return "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId !== null) {
        await API.put(`/password-entries/${editId}`, form);
        setEditId(null);
      } else {
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
      sitePassword: "",
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
    if (token && vaultKey) {
      setAuthHeaders(token, vaultKey);
      fetchEntries();
    }
  }, [token, vaultKey]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAuthenticated) {
      timer = setTimeout(() => {
        setIsAuthenticated(false);
        setMasterPassword("");
      }, 30 * 1000); // 30 seconds
    }
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  const verifyMasterPassword = async () => {
    try {
      const res = await API.post("/users/verify-password", { password: masterPassword });
      if (res.data.valid) {
        setIsAuthenticated(true);
        setMasterPassword("");
        setShowPasswordModal(false);
        if (pendingAction) {
          await pendingAction();
          setPendingAction(null);
        }
      } else {
        alert("Incorrect master password.");
      }
    } catch (err) {
      alert("Failed to verify master password.");
    }
  };

  const promptForMasterPassword = (action: () => Promise<void>) => {
    setPendingAction(() => action);
    setShowPasswordModal(true);
  };

  const handleSensitiveAction = (action: () => Promise<void>) => {
    if (isAuthenticated) {
      action();
    } else {
      promptForMasterPassword(action);
    }
  };

  const handleUseGeneratedPassword = (generated: string) => {
    setForm((prev) => ({ ...prev, sitePassword: generated }));
    setShowGenerator(false);
  };

  return (
    <div className="container my-5">
      <div className="card p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Your Vault</h2>
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

          <div className="text-end mb-3">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowGenerator(!showGenerator)}
            >
              {showGenerator ? "Hide Generator" : "Generate Password"}
            </button>
          </div>

          {showGenerator && (
            <div className="mb-4">
              <PasswordGenerator onUsePassword={handleUseGeneratedPassword} />
            </div>
          )}

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
                  <td>
                    ••••••••
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      title="Copy Password"
                      onClick={() =>
                        handleSensitiveAction(async () => {
                          const decrypted = await getDecryptedPassword(entry.id!);
                          if (decrypted) {
                            await navigator.clipboard.writeText(decrypted);
                            alert("Password copied to clipboard!");
                          }
                        })
                      }
                    >
                      Copy
                    </button>
                  </td>
                  <td>{new Date(entry.createdAt || "").toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() =>
                        handleSensitiveAction(async () => {
                          handleEdit(entry);
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() =>
                        handleSensitiveAction(async () => {
                          await handleDelete(entry.id);
                        })
                      }
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() =>
                        handleSensitiveAction(async () => {
                          const decrypted = await getDecryptedPassword(entry.id!);
                          if (decrypted) {
                            setShowQR({ ...entry, sitePassword: decrypted });
                            setIncludeEmail(false);
                          }
                        })
                      }
                    >
                      QR Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showQR && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
          onClick={() => setShowQR(null)}
        >
          <div
            className="bg-white p-4 rounded"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "fit-content", maxWidth: "90%" }}
          >
            <h5 className="mb-3 text-center">QR Code for {showQR.siteName}</h5>
            <div className="text-center mb-3">
              <QRCodeCanvas
                value={
                  includeEmail
                    ? `${showQR.siteEmail} | ${showQR.sitePassword}`
                    : showQR.sitePassword
                }
                size={180}
              />
            </div>
            <div className="form-check mb-3 text-center">
              <input
                type="checkbox"
                className="form-check-input"
                checked={includeEmail}
                onChange={(e) => setIncludeEmail(e.target.checked)}
                id="toggleEmail"
              />
              <label className="form-check-label" htmlFor="toggleEmail">
                Include Email
              </label>
            </div>
            <div className="text-center">
              <button className="btn btn-secondary" onClick={() => setShowQR(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50"
        >
          <div
            className="bg-white p-4 rounded"
            style={{ width: "fit-content", maxWidth: "400px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-3 text-center">Enter Master Password</h5>
            <input
              type="password"
              className="form-control mb-3"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              placeholder="Master Password"
              autoFocus
            />
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowPasswordModal(false);
                  setMasterPassword("");
                  setPendingAction(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={verifyMasterPassword}
                disabled={!masterPassword}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}