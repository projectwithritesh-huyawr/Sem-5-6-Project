import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/Sidebar.css";

const defaultProfileImage = "https://i.pinimg.com/236x/5a/bd/98/5abd985735a8fd4adcb0e795de6a1005.jpg?nii=t";

const getProfileImageKey = (role) => {
  if (role === "student") {
    return `profileImage_student_${localStorage.getItem("studentId") || "guest"}`;
  }

  return `profileImage_admin_${localStorage.getItem("username") || "admin"}`;
};

function Sidebar({
  name = "Admin",
  role = "admin"
}) {
  const isStudent = role === "student";
  const profileImageKey = getProfileImageKey(role);
  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem(profileImageKey) || localStorage.getItem("profileImage") || defaultProfileImage
  );

  useEffect(() => {
    const syncProfileImage = () => {
      setProfileImage(localStorage.getItem(profileImageKey) || defaultProfileImage);
    };

    window.addEventListener("profileImageChanged", syncProfileImage);
    return () => window.removeEventListener("profileImageChanged", syncProfileImage);
  }, [profileImageKey]);

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem(profileImageKey, reader.result);
      window.dispatchEvent(new Event("profileImageChanged"));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="sidebar">

      <h2 className="brand-title">
        <span>LIBRARY</span>
        <span>MANAGEMENT</span>
        <span>SYSTEM</span>
      </h2>

      <ul>

        <li>
          <NavLink
            className={({ isActive }) => isActive ? "active" : ""}
            to={
              isStudent
                ? "/student-dashboard"
                : "/admin-dashboard"
            }
          >
            Dashboard
          </NavLink>
        </li>

        {/* Admin Links */}
        {!isStudent && (
          <>
            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/books">
                Manage Books
              </NavLink>
            </li>

            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/students">
                Students
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/pending-students">
                Pending Students
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/issuebook">
                Issue Book
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/fines">
                Fine Management
              </NavLink>
            </li>
            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/rejected-students">
                Rejected Students
              </NavLink>
            </li>
           
          </>
        )}

        {/* Student Links */}
        {isStudent && (
          <>
            <li>
              <NavLink className={({ isActive }) => isActive ? "active" : ""} to="/student-dashboard">
                My Books
              </NavLink>
            </li>
          </>
        )}

        <li>
          <NavLink to="/login">
            Logout
          </NavLink>
        </li>
        
      </ul>

      <hr />

      <div className="admin-profile">

        <label className="profile-image-picker" title="Choose profile picture">
          <img src={profileImage} alt={role} />
          <span aria-hidden="true">+</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
        </label>

        <h3>
          {isStudent ? name : "Admin"}
        </h3>

        <p>
          {isStudent
            ? "Student"
            : "Library Manager"}
        </p>

      </div>

    </div>
  );
}

export default Sidebar;