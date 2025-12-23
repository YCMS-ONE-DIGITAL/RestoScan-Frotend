
export default function ConfirmBox({ open, onClose, onConfirm, title, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal Box */}
      <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl w-[90%] max-w-md border border-gray-700">
        
        <h2 className="text-xl font-semibold mb-3">{title}</h2>
        <p className="text-gray-400">{message}</p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
