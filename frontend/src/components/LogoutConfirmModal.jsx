function LogoutConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Logout</h2>
        <p className="text-gray-500 text-sm mb-6">Are you sure you want to logout?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmModal;