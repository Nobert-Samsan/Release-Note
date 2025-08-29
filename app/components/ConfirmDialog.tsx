'use client'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  onCancel: () => void
  message: string
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  onCancel,
  message,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative z-10 bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6 text-sm text-gray-700">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
