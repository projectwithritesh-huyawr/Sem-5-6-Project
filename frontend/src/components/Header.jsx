import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [showPasswords, setShowPasswords] = useState(false);
  const [bookRequests, setBookRequests] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
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

  useEffect(() => {
    if (role !== "admin" && role !== "student") return undefined;

    const fetchBookNotifications = async () => {
      try {
        const endpoint = role === "admin"
          ? "getBookRequests.php"
          : `getBookNotifications.php?studentId=${encodeURIComponent(localStorage.getItem("studentId") || "")}`;
        const response = await fetch(apiUrl(endpoint));
        const data = await response.json();
        setBookRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Book Request Notification Error:", error);
      }
    };

    fetchBookNotifications();
    const requestRefresh = setInterval(fetchBookNotifications, 15000);
    return () => clearInterval(requestRefresh);
  }, [role]);

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

    if (newPassword.length < 3) {
      const message = "New password must be at least 3 characters.";
      setPasswordMessage(message);
      window.alert(message);
      return;
    }

    if (newPassword !== confirmPassword) {
      const message = "New passwords do not match.";
      setPasswordMessage(message);
      window.alert(message);
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
      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          responseText.trim() || "Password service returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(result.message || "Password change failed.");
      }

      setPasswordMessage(result.message);
      window.alert(result.message);

      if (result.status === "success") {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      const message = error.message || "Unable to change password right now.";
      setPasswordMessage(message);
      window.alert(message);
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

        {(role === "admin" || role === "student") && (
          <div className="notification-wrapper">
            <button
              className="notification"
              type="button"
              onClick={() => setShowNotifications((isOpen) => !isOpen)}
              aria-label={`Open book notifications${bookRequests.length ? `, ${bookRequests.length} new` : ""}`}
              aria-expanded={showNotifications}
            >
              🔔
              {bookRequests.length > 0 && (
                <span className="notification-count">{bookRequests.length}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-dropdown-header">
                  <strong>{role === "admin" ? "Book Requests" : "Book Notifications"}</strong>
                  <span>{bookRequests.length} {role === "admin" ? "pending" : "new"}</span>
                </div>
                {bookRequests.length > 0 ? (
                  bookRequests.slice(0, 5).map((request) => (
                    <div className="book-request-notification" key={request._id}>
                      <strong>{role === "admin" ? request.studentName : "Book request rejected"}</strong>
                      <span>{request.bookTitle}</span>
                      {role === "student" && <em>Reason: {request.rejectionReason}</em>}
                    </div>
                  ))
                ) : (
                  <p className="no-notifications">No pending book requests</p>
                )}
                {role === "admin" && (
                  <Link
                    className="view-requests-link"
                    to="/book-requests"
                    onClick={() => setShowNotifications(false)}
                  >
                    View all requests
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

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
                type={showPasswords ? "text" : "password"}
                placeholder="Current password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength="3"
                required
              />
              <input
                type={showPasswords ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength="3"
                required
              />
              <label className="show-password-toggle">
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={(event) => setShowPasswords(event.target.checked)}
                />
                Show password
              </label>
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