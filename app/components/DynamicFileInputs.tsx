'use client'

import { useEffect, useState } from 'react'

type FileChange = {
  filename: string
  codeBefore: string
  codeAfter: string
}

interface DynamicFileInputsProps {
  /** Called whenever the files array changes */
  onChange: (files: FileChange[]) => void
  /** Optional initial value (e.g., when editing) */
  value?: FileChange[]
}

export default function DynamicFileInputs({ onChange, value }: DynamicFileInputsProps) {
  const [files, setFiles] = useState<FileChange[]>(
    value && value.length
      ? value
      : [{ filename: '', codeBefore: '', codeAfter: '' }]
  )

  // Sync parent any time local files change
  useEffect(() => {
    onChange(files)
  }, [files, onChange])

  const updateFile = (
    index: number,
    field: keyof FileChange,
    v: string
  ) => {
    setFiles(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: v }
      return next
    })
  }

  const addFile = () => {
    setFiles(prev => [...prev, { filename: '', codeBefore: '', codeAfter: '' }])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {files.map((f, i) => (
        <div key={i} className="border rounded-md p-4 relative space-y-3">
          <div>
            <label className="text-sm">Filename *</label>
            <input
              required
              className="w-full border px-2 py-1 rounded"
              value={f.filename}
              onChange={(e) => updateFile(i, 'filename', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Code BEFORE changes *</label>
            <textarea
              required
              rows={6}
              className="w-full border px-2 py-1 rounded"
              value={f.codeBefore}
              onChange={(e) => updateFile(i, 'codeBefore', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Code AFTER changes *</label>
            <textarea
              required
              rows={6}
              className="w-full border px-2 py-1 rounded"
              value={f.codeAfter}
              onChange={(e) => updateFile(i, 'codeAfter', e.target.value)}
            />
          </div>

          {i !== 0 && (
            <button
              type="button"
              className="absolute top-2 right-2 text-sm text-red-600 hover:text-red-700"
              onClick={() => removeFile(i)}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addFile}
        className="border border-dashed px-4 py-2 rounded text-sm"
      >
        + Add File
      </button>
    </div>
  )
}
