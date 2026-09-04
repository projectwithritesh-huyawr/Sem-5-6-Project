import { useEffect, useState } from "react";
import { apiUrl } from "../services/api";
import "../css/Header.css";

const defaultProfileImage = "https://i.pinimg.com/236x/5a/bd/98/5abd985735a8fd4adcb0e795de6a1005.jpg?nii=t";

const getProfileImageKey = (role) => {
  if (role === "student") {
    return `profileImage_student_${localStorage.getItem("studentId") || "guest"}`;
  }

  return `profileImage_admin_${localStorage.getItem("username") || "admin"}`;
};

function Header({
  name = "Admin",
  role = "admin",
  profile = {}
}) {
  const profileImageKey = getProfileImageKey(role);
  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem(profileImageKey) || localStorage.getItem("profileImage") || defaultProfileImage
  );
  const [showProfile, setShowProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const hasCustomProfileImage = Boolean(
    localStorage.getItem(profileImageKey) || localStorage.getItem("profileImage")
  );

  useEffect(() => {
    const syncProfileImage = () => {
      setProfileImage(localStorage.getItem(profileImageKey) || defaultProfileImage);
    };

    window.addEventListener("profileImageChanged", syncProfileImage);
    return () => window.removeEventListener("profileImageChanged", syncProfileImage);
  }, [profileImageKey]);

  const profileDetails = role === "student"
    ? [
        ["Name", profile.name || name],
        ["Email", profile.email],
        ["Username", profile.username || localStorage.getItem("username")],
        ["Course", profile.course],
        ["Year", profile.year]
      ]
    : [
        ["Name", name],
        ["Username", localStorage.getItem("username") || "admin"],
        ["Role", "Library Manager"]
      ];

  const removeProfileImage = () => {
    localStorage.removeItem(profileImageKey);
    localStorage.removeItem("profileImage");
    setProfileImage(defaultProfileImage);
    window.dispatchEvent(new Event("profileImageChanged"));
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage("");

    if (newPassword.length < 6) {
      setPasswordMessage("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        apiUrl("changePassword.php"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: localStorage.getItem("username"),
            currentPassword,
            newPassword
          })
        }
      );
      const result = await response.json();
      setPasswordMessage(result.message);

      if (result.status === "success") {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setPasswordMessage("Unable to change password right now.");
    }
  };

  return (
    <div className="header">
      
      <div className="header-left">
        <h1>Dashboard</h1>

        <p>
          Welcome Back, {name} 👋
        </p>
      </div>

      <div className="header-right">

        <input
          type="text"
          placeholder="Search..."
        />

        <span className="notification">
          🔔
        </span>

        <button
          className="profile-button"
          type="button"
          onClick={() => setShowProfile(true)}
          aria-label="Open profile"
        >
          <img src={profileImage} alt={role} />
        </button>

      </div>

      {showProfile && (
        <div className="profile-modal-backdrop" onClick={() => setShowProfile(false)}>
          <section
            className="profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="profile-close"
              type="button"
              onClick={() => setShowProfile(false)}
              aria-label="Close profile"
            >
              &times;
            </button>
            <img className="profile-modal-image" src={profileImage} alt={role} />
            <h2 id="profile-title">{profile.name || name}</h2>
            <p className="profile-modal-role">
              {role === "student" ? "Student" : "Library Manager"}
            </p>
            <div className="profile-details">
              {profileDetails.map(([label, value]) => (
                <div className="profile-detail-row" key={label}>
                  <span>{label}</span>
                  <strong>{value || "N/A"}</strong>
                </div>
              ))}
            </div>
            {hasCustomProfileImage && (
              <button
                className="remove-profile-button"
                type="button"
                onClick={removeProfileImage}
              >
                Remove picture
              </button>
            )}
            <form className="password-form" onSubmit={changePassword}>
              <h3>Change Password</h3>
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength="6"
                required
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength="6"
                required
              />
              <button type="submit">Update password</button>
              {passwordMessage && <p className="password-message">{passwordMessage}</p>}
            </form>
          </section>
        </div>
      )}

    </div>
  );
}

export default Header;