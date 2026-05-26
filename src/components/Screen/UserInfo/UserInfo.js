import React, { useState, useEffect } from "react";
import './UserInfo.scss'
import { useAuth } from "../../contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function UserInfo() {
  const { currentUser, logout } = useAuth();
  const [changeInfor, setChangeInfor] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

      const [passwordCurrent, setPasswordCurrent] = useState("");

  const [editField, setEditField] = useState("");
  const [value, setValue] = useState("");
  const handleOpenModal = (field, currentValue) => {
    setEditField(field);
    setValue(currentValue);
    setChangeInfor(true);
  };

  const [user, setUser] = useState(currentUser);
  const handleSave = () => {
    setUser({
      ...user,
      [editField]: value,
    });

    setChangeInfor(false);
  };

  useEffect(() => {
    if (!changeInfor) return;

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setChangeInfor(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener(
        "keydown",
        handleEsc
      );
    };
  }, [changeInfor]);

  return (
    <div className="DAT_UserInfor">
      <div className="DAT_UserInfor_Card">
        <div className="DAT_UserInfor_Card_Header">
          <div>
            <div className="DAT_UserInfor_Card_Header_Title">User Information</div>
            <div className="DAT_UserInfor_Card_Header_Subtitle">
            </div>
          </div>
          {/* <div className="DAT_UserInfor_Card_Header_Actions">
            <button className="DAT_UserInfor_Card_Header_Actions_Button_Primary">
              Save
            </button>
          </div> */}
        </div>
      </div>

      <div className='DAT_UserInfor_container'>
        <div className='DAT_UserInfor_container_row'>
          <div className='DAT_UserInfor_container_row_content'>
            <div className='DAT_UserInfor_container_row_content_title'>
              Ảnh đại diện
            </div>
            <div className='DAT_UserInfor_container_row_content_avt'>
              {currentUser?.name?.charAt(0) || "U"}
            </div>
          </div>
          <div className='DAT_UserInfor_container_row_btn'>

          </div>
        </div>
        <div className='DAT_UserInfor_container_row'>
          <div className='DAT_UserInfor_container_row_content'>
            <div className='DAT_UserInfor_container_row_content_title'>
              Tên
            </div>
            <div className='DAT_UserInfor_container_row_content_label'>
              {currentUser?.name}
            </div>
          </div>
          <div className='DAT_UserInfor_container_row_btn'
            onClick={() => handleOpenModal("Tên", currentUser?.name)}
            aria-label="Change Name"
          >
            Thay đổi
          </div>
        </div>
        <div className='DAT_UserInfor_container_row'>
          <div className='DAT_UserInfor_container_row_content'>
            <div className='DAT_UserInfor_container_row_content_title'>
              Email
            </div>
            <div className='DAT_UserInfor_container_row_content_label'>
              {currentUser?.email}
            </div>
          </div>
          <div className='DAT_UserInfor_container_row_btn'
            onClick={() => handleOpenModal("Email", currentUser?.email)}
            aria-label="Change Name"
          >
            Thay đổi
          </div>
        </div>
        <div className='DAT_UserInfor_container_row'>
          <div className='DAT_UserInfor_container_row_content'>
            <div className='DAT_UserInfor_container_row_content_title'>
              Số điện thoại
            </div>
            <div className='DAT_UserInfor_container_row_content_label'>
              1234567890
            </div>
          </div>
          <div className='DAT_UserInfor_container_row_btn'>
            Thay đổi
          </div>
        </div>
        <div className='DAT_UserInfor_container_row'>
          <div className='DAT_UserInfor_container_row_content'>
            <div className='DAT_UserInfor_container_row_content_title'>
              Địa chỉ
            </div>
            <div className='DAT_UserInfor_container_row_content_label'>
              12 Đông Hưng Thuận 10, phường Đông Hưng Thuận, Thành phố Hồ Chí Minh
            </div>
          </div>
          <div className='DAT_UserInfor_container_row_btn'>
            Thay đổi
          </div>
        </div>
        {changeInfor && (
          <div className="DAT_UserInfor_modal">
            <div className="DAT_UserInfor_modal_container">
              <div className="DAT_UserInfor_modal_container_header">
                <div className="DAT_UserInfor_modal_container_header_title">
                  Thay đổi {editField}
                </div>
                <div className="DAT_UserInfor_modal_container_header_close">

                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="25" width="25" xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setChangeInfor(false)}
                  >
                    <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path>
                  </svg>
                </div>
              </div>

              <div className='DAT_UserInfor_modal_container_main'>

                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setValue(e.target.value)
                  }
                />
              </div>

              <div className='DAT_UserInfor_modal_container_foot'>
                <button onClick={handleSave}>
                  Lưu
                </button>
              </div>

            </div>
          </div>
        )}
        <div className='DAT_UserInfor_container_row'>
          <div className='DAT_UserInfor_container_row_content'>
            <div className='DAT_UserInfor_container_row_content_title'>
              Mật khẩu
            </div>
            <div className='DAT_UserInfor_container_row_content_label'>
              ********
            </div>
          </div>
          <div className='DAT_UserInfor_container_row_btn'
            onClick={() => setChangePassword(true)}
          >
            Đổi mật khẩu
          </div>
          {changePassword && (
            <div className="DAT_UserInfor_modal">
              <div className="DAT_UserInfor_modal_container">
                <div className="DAT_UserInfor_modal_container_header">
                  <div className="DAT_UserInfor_modal_container_header_title">
                    Thay đổi mật khẩu
                  </div>
                  <div className="DAT_UserInfor_modal_container_header_close">

                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="25" width="25" xmlns="http://www.w3.org/2000/svg"
                      onClick={() => setChangePassword(false)}
                    >
                      <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path>
                    </svg>
                  </div>
                </div>

                <div className='DAT_UserInfor_modal_container_main'>
                  <div className='DAT_UserInfor_modal_container_main_label'>
                    Mật khẩu hiện tại
                  </div>
                  <div className='DAT_UserInfor_modal_container_main_box'>
                    <input
                      type={
                        showPasswordCurrent
                          ? "text"
                          : "password"
                      }
                      value={passwordCurrent}
                      onChange={(e) =>
                        setPasswordCurrent(e.target.value)
                      }
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordCurrent(!showPasswordCurrent)
                      }
                    >
                      {showPasswordCurrent ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                  </div>
                  <div className='DAT_UserInfor_modal_container_main_label'>
                    Mật khẩu mới
                  </div>
                  <div className='DAT_UserInfor_modal_container_main_box'>
                    <input
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(!showNewPassword)
                      }
                    >
                      {showNewPassword ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                  </div>
                  <div className='DAT_UserInfor_modal_container_main_label'>
                    Xác nhận mật khẩu
                  </div>
                  <div className='DAT_UserInfor_modal_container_main_box'>
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Nhập mật khẩu"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className='DAT_UserInfor_modal_container_foot'>
                  <button onClick={handleSave}>
                    Lưu
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
        <div className='DAT_UserInfor_container_row'>
          <div className='DAT_UserInfor_container_row_content'>
            <div className='DAT_UserInfor_container_row_content_title'>
              Quyền hệ thống
            </div>
            <div className='DAT_UserInfor_container_row_content_label'>
              Yêu cầu quyền thông báo
            </div>
          </div>
          <div className='DAT_UserInfor_container_row_btn'>
            Yêu cầu
          </div>
        </div>
        <div className='DAT_UserInfor_container_row'>
          <div className='DAT_UserInfor_container_row_content'>
            <div className='DAT_UserInfor_container_row_content_title'>
              Thông báo
            </div>
            <div className='DAT_UserInfor_container_row_content_label'>
              Thông báo Bật/Tắt
            </div>
          </div>
          <div className='DAT_UserInfor_container_row_btn'>
            Bật
          </div>
        </div>
      </div>
    </div>
  )
}
