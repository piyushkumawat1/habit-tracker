export default function Dialog({ isOpen, onClose, children, maxWidth = 500 }) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" style={{ maxWidth }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
