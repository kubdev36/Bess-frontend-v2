import React, { useMemo, useState } from "react";
import Modal from "../../Modal/Modal";
import StatusBadge from "../../Modal/StatusBadge";
import { mockUsers } from "../../data/mockData";
import "./UserManagementPage.scss";
import { useIntl } from "react-intl";

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
  const lang = useIntl();

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
    <div className="DAT_UserManagement">
      <div className="DAT_UserManagement_Card">
        <div className="DAT_UserManagement_Card_Info">
          <div className="DAT_UserManagement_Card_Info_Title">{lang.formatMessage({id: "user_management"})}</div>
        </div>
        <div className="DAT_UserManagement_Card_Actions">
          <input
            className="DAT_UserManagement_Card_Actions_FilterInput"
            style={{ width: 220 }}
            placeholder={lang.formatMessage({id: "user_search"})}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="DAT_UserManagement_Card_Actions_FilterSelect"
            style={{ width: 140 }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="All">{lang.formatMessage({id: "all_role"})}</option>
            <option value="Viewer">{lang.formatMessage({id: "viewer_role"})}</option>
            <option value="Operator">{lang.formatMessage({id: "operator_role"})}</option>
            <option value="Admin">{lang.formatMessage({id: "admin_role"})}</option>
            <option value="Engineer">{lang.formatMessage({id: "engineer_role"})}</option>
          </select>
          <select
            className="DAT_UserManagement_Card_Actions_FilterSelect"
            style={{ width: 140 }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="All">{lang.formatMessage({id: "all_status_role"})}</option>
            <option value="Active">{lang.formatMessage({id: "statusActive_role"})}</option>
            <option value="Inactive">{lang.formatMessage({id: "statusInactive_role"})}</option>
            <option value="Locked">{lang.formatMessage({id: "statusLocked_role"})}</option>
          </select>
          <button
            className="DAT_UserManagement_Card_Actions_Button_Primary"
            onClick={openNew}
          >
            {lang.formatMessage({id: "add_user"})}
          </button>
        </div>
      </div>

      <div className="DAT_UserManagement_Container">
        <div className="DAT_UserManagement_Container_Table">
          <table className="DAT_UserManagement_Container_Table_Main">
            <thead>
              <tr>
                <th>{lang.formatMessage({id: "user_id_table"})}</th>
                <th>{lang.formatMessage({id: "user_name_table"})}</th>
                <th>{lang.formatMessage({id: "user_email_table"})}</th>
                <th>{lang.formatMessage({id: "user_role_table"})}</th>
                <th>{lang.formatMessage({id: "user_status_table"})}</th>
                <th>{lang.formatMessage({id: "user_last_login_table"})}</th>
                <th>{lang.formatMessage({id: "user_create_at_table"})}</th>
                <th>{lang.formatMessage({id: "user_action_table"})}</th>
              </tr>
            </thead>
            <tbody className="DAT_UserManagement_Container_Table_Main_Body">
              {filtered.map((user) => (
                <tr key={user.id} className="DAT_UserManagement_Container_Table_Main_Row">
                  <td className="DAT_UserManagement_Container_Table_Main_Cell">
                    USR-{String(user.id).padStart(3, "0")}
                  </td>
                  <td className="DAT_UserManagement_Container_Table_Main_Cell">{user.name}</td>
                  <td className="DAT_UserManagement_Container_Table_Main_Cell">{user.email}</td>
                  <td className="DAT_UserManagement_Container_Table_Main_Cell">{user.role}</td>
                  <td className="DAT_UserManagement_Container_Table_Main_Cell">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="DAT_UserManagement_Container_Table_Main_Cell">
                    {user.lastLogin || "-"}
                  </td>
                  <td className="DAT_UserManagement_Container_Table_Main_Cell">{user.created}</td>
                  <td className="DAT_UserManagement_Container_Table_Main_Cell">
                    <div className="DAT_UserManagement_Container_Table_Actions">
                      <button
                        className="DAT_UserManagement_Container_Table_Actions_Button_GhostSm"
                        onClick={() => openEdit(user)}
                      >
                        {lang.formatMessage({id: "user_edit_button"})}
                      </button>
                      <button
                        className="DAT_UserManagement_Container_Table_Actions_Button_SecondarySm"
                        onClick={() =>
                          setUsers((prev) =>
                            prev.map((item) =>
                              item.id === user.id
                                ? {
                                  ...item,
                                  status:
                                    item.status === "Locked" ? "Active" : "Locked",
                                }
                                : item,
                            ),
                          )
                        }
                      >
                        {user.status === "Locked" ? lang.formatMessage({id: "user_unlock_button"}) : lang.formatMessage({id: "user_locked_button"})}
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
              className="DAT_UserManagement_Modal_Footer_Button_Secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="DAT_UserManagement_Modal_Footer_Button_Primary"
              onClick={saveUser}
            >
              Save User
            </button>
          </>
        }
      >
        <div className="DAT_UserManagement_Form_Grid">
          <div className="DAT_UserManagement_Form_Grid_Group">
            <label className="DAT_UserManagement_Form_Grid_Group_Label">Full Name</label>
            <input
              className="DAT_UserManagement_Form_Grid_Group_Input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="DAT_UserManagement_Form_Grid_Group">
            <label className="DAT_UserManagement_Form_Grid_Group_Label">Email</label>
            <input
              className="DAT_UserManagement_Form_Grid_Group_Input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="DAT_UserManagement_Form_Grid_Group">
            <label className="DAT_UserManagement_Form_Grid_Group_Label">Password</label>
            <input
              className="DAT_UserManagement_Form_Grid_Group_Input"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="DAT_UserManagement_Form_Grid_Group">
            <label className="DAT_UserManagement_Form_Grid_Group_Label">Confirm Password</label>
            <input
              className="DAT_UserManagement_Form_Grid_Group_Input"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>
          <div className="DAT_UserManagement_Form_Grid_Group">
            <label className="DAT_UserManagement_Form_Grid_Group_Label">Role</label>
            <select
              className="DAT_UserManagement_Form_Grid_Group_Select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>Viewer</option>
              <option>Operator</option>
              <option>Admin</option>
              <option>Engineer</option>
            </select>
          </div>
          <div className="DAT_UserManagement_Form_Grid_Group">
            <label className="DAT_UserManagement_Form_Grid_Group_Label">Status</label>
            <select
              className="DAT_UserManagement_Form_Grid_Group_Select"
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
