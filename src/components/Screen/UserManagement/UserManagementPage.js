import React, { useMemo, useState } from "react";
import Modal from "../../Modal/Modal";
import StatusBadge from "../../Modal/StatusBadge";
import { mockUsers } from "../../data/mockData";
import "./UserManagementPage.scss";

const emptyUser = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "Viewer",
  status: "Active",
};

export default function UserManagementPage() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [form, setForm] = useState(emptyUser);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        if (role !== "All" && user.role !== role) return false;
        if (status !== "All" && user.status !== status) return false;
        if (search) {
          const keyword = search.toLowerCase();
          return (
            user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword)
          );
        }
        return true;
      }),
    [role, status, search, users],
  );

  const openNew = () => {
    setEditing(null);
    setForm(emptyUser);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({ ...emptyUser, ...user, password: "", confirmPassword: "" });
    setShowModal(true);
  };

  const saveUser = () => {
    if (!form.name || !form.email) return;

    if (editing) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editing.id
            ? {
                ...user,
                name: form.name,
                email: form.email,
                role: form.role,
                status: form.status,
              }
            : user,
        ),
      );
    } else {
      setUsers((prev) => [
        {
          id: prev.length + 1,
          name: form.name,
          email: form.email,
          password: form.password || "changeme123",
          role: form.role,
          status: form.status,
          lastLogin: null,
          created: "2026-05-19",
          ip: "192.168.1.40",
        },
        ...prev,
      ]);
    }

    setShowModal(false);
  };

  return (
    <div className="page animate-fadeIn">
      <div className="card">
        <div className="page-toolbar">
          <div>
            <div className="card-title">User Management</div>
            <div className="card-subtitle">
              Quản lý tài khoản, role, trạng thái và hành động reset password.
            </div>
          </div>
          <div className="page-toolbar-actions">
            <input
              className="form-input"
              style={{ width: 220 }}
              placeholder="Search name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="form-select"
              style={{ width: 140 }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Viewer">Viewer</option>
              <option value="Operator">Operator</option>
              <option value="Admin">Admin</option>
              <option value="Engineer">Engineer</option>
            </select>
            <select
              className="form-select"
              style={{ width: 140 }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Locked">Locked</option>
            </select>
            <button className="btn btn-primary" onClick={openNew}>
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td>USR-{String(user.id).padStart(3, "0")}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <StatusBadge status={user.status} />
                  </td>
                  <td>{user.lastLogin || "-"}</td>
                  <td>{user.created}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => openEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() =>
                          setUsers((prev) =>
                            prev.map((item) =>
                              item.id === user.id
                                ? {
                                    ...item,
                                    status:
                                      item.status === "Locked"
                                        ? "Active"
                                        : "Locked",
                                  }
                                : item,
                            ),
                          )
                        }
                      >
                        {user.status === "Locked" ? "Unlock" : "Lock"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "Edit User" : "Add User"}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={saveUser}>
              Save User
            </button>
          </>
        }
      >
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className="form-input"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>Viewer</option>
              <option>Operator</option>
              <option>Admin</option>
              <option>Engineer</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Locked</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
