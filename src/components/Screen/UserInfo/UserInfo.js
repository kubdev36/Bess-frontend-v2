import React, { useState, useEffect } from "react";
import './UserInfo.scss'
import { useAuth } from "../../contexts/AuthContext";
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa";
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

      <div className='DAT_UserInfor_Container'>
        <div className='DAT_UserInfor_Container_Row'>
          <div className='DAT_UserInfor_Container_Row_Content'>
            <div className='DAT_UserInfor_Container_Row_Content_Title'>
              Ảnh đại diện
            </div>
            <div className='DAT_UserInfor_Container_Row_Content_Avt'>
              {currentUser?.name?.charAt(0) || "U"}
            </div>
          </div>
          <div className='DAT_UserInfor_Container_Row_Btn'>

          </div>
        </div>
        <div className='DAT_UserInfor_Container_Row'>
          <div className='DAT_UserInfor_Container_Row_Content'>
            <div className='DAT_UserInfor_Container_Row_Content_Title'>
              Tên
            </div>
            <div className='DAT_UserInfor_Container_Row_Content_Label'>
              {currentUser?.name}
            </div>
          </div>
          <div className='DAT_UserInfor_Container_Row_Btn'
            onClick={() => handleOpenModal("Tên", currentUser?.name)}
            aria-label="Change Name"
          >
            Thay đổi
          </div>
        </div>
        <div className='DAT_UserInfor_Container_Row'>
          <div className='DAT_UserInfor_Container_Row_Content'>
            <div className='DAT_UserInfor_Container_Row_Content_Title'>
              Email
            </div>
            <div className='DAT_UserInfor_Container_Row_Content_Label'>
              {currentUser?.email}
            </div>
          </div>
          <div className='DAT_UserInfor_Container_Row_Btn'
            onClick={() => handleOpenModal("Email", currentUser?.email)}
            aria-label="Change Name"
          >
            Thay đổi
          </div>
        </div>
        <div className='DAT_UserInfor_Container_Row'>
          <div className='DAT_UserInfor_Container_Row_Content'>
            <div className='DAT_UserInfor_Container_Row_Content_Title'>
              Số điện thoại
            </div>
            <div className='DAT_UserInfor_Container_Row_Content_Label'>
              1234567890
            </div>
          </div>
          <div className='DAT_UserInfor_Container_Row_Btn'>
            Thay đổi
          </div>
        </div>
        <div className='DAT_UserInfor_Container_Row'>
          <div className='DAT_UserInfor_Container_Row_Content'>
            <div className='DAT_UserInfor_Container_Row_Content_Title'>
              Địa chỉ
            </div>
            <div className='DAT_UserInfor_Container_Row_Content_Label'>
              12 Đông Hưng Thuận 10, phường Đông Hưng Thuận, Thành phố Hồ Chí Minh
            </div>
          </div>
          <div className='DAT_UserInfor_Container_Row_Btn'>
            Thay đổi
          </div>
        </div>
        {changeInfor && (
          <div className="DAT_UserInfor_Modal">
            <div className="DAT_UserInfor_Modal_Container">
              <div className="DAT_UserInfor_Modal_Container_Header">
                <div className="DAT_UserInfor_Modal_Container_Header_Title">
                  Thay đổi {editField}
                </div>
                <div className="DAT_UserInfor_Modal_Container_Header_Close">

                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="25" width="25" xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setChangeInfor(false)}
                  >
                    <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path>
                  </svg>
                </div>
              </div>

              <div className='DAT_UserInfor_Modal_Container_Main'>

                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setValue(e.target.value)
                  }
                />
              </div>

              <div className='DAT_UserInfor_Modal_Container_Foot'>
                <button onClick={handleSave}>
                  Lưu
                </button>
              </div>

            </div>
          </div>
        )}
        <div className='DAT_UserInfor_Container_Row'>
          <div className='DAT_UserInfor_Container_Row_Content'>
            <div className='DAT_UserInfor_Container_Row_Content_Title'>
              Mật khẩu
            </div>
            <div className='DAT_UserInfor_Container_Row_Content_Label'>
              ********
            </div>
          </div>
          <div className='DAT_UserInfor_Container_Row_Btn'
            onClick={() => setChangePassword(true)}
          >
            Đổi mật khẩu
          </div>
          {changePassword && (
            <div className="DAT_UserInfor_Modal">
              <div className="DAT_UserInfor_Modal_Container">
                <div className="DAT_UserInfor_Modal_Container_Header">
                  <div className="DAT_UserInfor_Modal_Container_Header_Title">
                    Thay đổi mật khẩu
                  </div>
                  <div className="DAT_UserInfor_Modal_Container_Header_Close">

                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="25" width="25" xmlns="http://www.w3.org/2000/svg"
                      onClick={() => setChangePassword(false)}
                    >
                      <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path>
                    </svg>
                  </div>
                </div>

                <div className='DAT_UserInfor_Modal_Container_Main'>
                  <div className='DAT_UserInfor_Modal_Container_Main_Label'>
                    Mật khẩu hiện tại
                  </div>
                  <div className='DAT_UserInfor_Modal_Container_Main_Box'>
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
                        <FaRegEye size={20} />
                      ) : (
                        <FaRegEyeSlash size={20} />
                      )}
                    </button>
                  </div>
                  <div className='DAT_UserInfor_Modal_Container_Main_Label'>
                    Mật khẩu mới
                  </div>
                  <div className='DAT_UserInfor_Modal_Container_Main_Box'>
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
                        <FaRegEye size={20} />
                      ) : (
                        <FaRegEyeSlash size={20} />
                      )}
                    </button>
                  </div>
                  <div className='DAT_UserInfor_Modal_Container_Main_Label'>
                    Xác nhận mật khẩu
                  </div>
                  <div className='DAT_UserInfor_Modal_Container_Main_Box'>
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
                        <FaRegEye size={20} />
                      ) : (
                        <FaRegEyeSlash size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className='DAT_UserInfor_Modal_Container_Foot'>
                  <button onClick={handleSave}>
                    Lưu
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
        <div className='DAT_UserInfor_Container_Row'>
          <div className='DAT_UserInfor_Container_Row_Content'>
            <div className='DAT_UserInfor_Container_Row_Content_Title'>
              Quyền hệ thống
            </div>
            <div className='DAT_UserInfor_Container_Row_Content_Label'>
              Yêu cầu quyền thông báo
            </div>
          </div>
          <div className='DAT_UserInfor_Container_Row_Btn'>
            Yêu cầu
          </div>
        </div>
        <div className='DAT_UserInfor_Container_Row'>
          <div className='DAT_UserInfor_Container_Row_Content'>
            <div className='DAT_UserInfor_Container_Row_Content_Title'>
              Thông báo
            </div>
            <div className='DAT_UserInfor_Container_Row_Content_Label'>
              Thông báo Bật/Tắt
            </div>
          </div>
          <div className='DAT_UserInfor_Container_Row_Btn'>
            Bật
          </div>
        </div>
      </div>
    </div>
  )
}
