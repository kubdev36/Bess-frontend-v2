import React, { useEffect } from 'react';
import { FaTriangleExclamation } from 'react-icons/fa6';
import { LuCheck, LuLock, LuX } from 'react-icons/lu';
import './Modal.scss';

export default function Modal({ isOpen, onClose, title, children, footer, size = 'medium', danger = false }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content modal-${size} ${danger ? 'modal-danger' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {danger && <span className="modal-warning-icon"><FaTriangleExclamation /></span>}
            {title}
          </h3>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <LuX />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  changes,
  requirePassword,
  requireReason,
  danger,
  confirmText = 'Confirm',
  loading,
}) {
  const [password, setPassword] = React.useState('');
  const [reason, setReason] = React.useState('');
  const [error, setError] = React.useState('');

  const handleConfirm = () => {
    if (requirePassword && !password) {
      setError('Mật khẩu là bắt buộc');
      return;
    }
    if (requireReason && !reason.trim()) {
      setError('Lý do là bắt buộc');
      return;
    }
    setError('');
    onConfirm({ password, reason });
    setPassword('');
    setReason('');
  };

  const handleClose = () => {
    setPassword('');
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title || 'Confirm Action'}
      danger={danger}
      footer={
        <>
          <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={handleConfirm} disabled={loading}>
            {loading ? '...' : <><LuCheck /> {confirmText}</>}
          </button>
        </>
      }
    >
      {message && <p className="modal-message">{message}</p>}
      {changes && changes.length > 0 && (
        <div className="modal-changes-table">
          <table className="table">
            <thead><tr><th>Parameter</th><th>Old</th><th>New</th></tr></thead>
            <tbody>
              {changes.map((c, i) => (
                <tr key={i}>
                  <td>{c.label}</td>
                  <td className="text-secondary">{c.oldValue}</td>
                  <td className="font-semibold text-primary">{c.newValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {requireReason && (
        <div className="form-group mt-base">
          <label className="form-label">Reason</label>
          <input className="form-input" placeholder="Enter reason..." value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
      )}
      {requirePassword && (
        <div className="form-group mt-base">
          <label className="form-label modal-form-label">
            <LuLock />
            Enter password to confirm
          </label>
          <input className="form-input" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      )}
      {error && <p className="form-error mt-sm">{error}</p>}
    </Modal>
  );
}
