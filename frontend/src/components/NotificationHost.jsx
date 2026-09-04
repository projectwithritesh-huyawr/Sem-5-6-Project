import { useEffect, useState } from "react";
import "../css/Notification.css";

export const requestConfirmation = (message) => new Promise((resolve) => {
  window.dispatchEvent(new CustomEvent("library:confirm", {
    detail: { message, resolve }
  }));
});

function NotificationHost() {
  const [notice, setNotice] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    const nativeAlert = window.alert;
    const showNotice = (message) => {
      setNotice({
        type: "info",
        title: "Library message",
        text: String(message)
      });
    };

    window.alert = showNotice;
    return () => {
      window.alert = nativeAlert;
    };
  }, []);

  useEffect(() => {
    const openConfirmation = (event) => setConfirmation(event.detail);
    window.addEventListener("library:confirm", openConfirmation);
    return () => window.removeEventListener("library:confirm", openConfirmation);
  }, []);

  const closeConfirmation = (result) => {
    confirmation?.resolve(result);
    setConfirmation(null);
  };

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = setTimeout(() => setNotice(null), 4200);
    return () => clearTimeout(timeout);
  }, [notice]);

  if (!notice && !confirmation) return null;

  return (
    <div className="notification-host" role="status" aria-live="polite">
      {notice && (
        <div className="site-notification">
          <div className="site-notification-icon">i</div>
          <div>
            <h2>{notice.title}</h2>
            <p>{notice.text}</p>
          </div>
          <button type="button" onClick={() => setNotice(null)} aria-label="Close message">&times;</button>
        </div>
      )}
      {confirmation && (
        <div className="confirm-backdrop">
          <div className="confirm-dialog" role="dialog" aria-modal="true">
            <div className="confirm-icon">?</div>
            <h2>Are you sure?</h2>
            <p>{confirmation.message}</p>
            <div className="confirm-actions">
              <button type="button" className="confirm-cancel" onClick={() => closeConfirmation(false)}>Cancel</button>
              <button type="button" className="confirm-ok" onClick={() => closeConfirmation(true)}>Yes, continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationHost;
