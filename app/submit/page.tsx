'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface FileChange {
  filename: string
  codeBefore: string
  codeAfter: string
}


function SubmitPage({}: {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const entryId = searchParams.get('entryId')

  const [projectName, setProjectName] = useState('')
  const [taskNo, setTaskNo] = useState('')
  const [taskName, setTaskName] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<FileChange[]>([
    { filename: '', codeBefore: '', codeAfter: '' },
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (entryId) {
      fetch(`/api/entries/${entryId}`)
        .then((res) => res.json())
        .then((data) => {
          setProjectName(data.projectName || '')
          setTaskNo(data.taskNo || '')
          setTaskName(data.taskName || '')
          setDescription(data.description || '')
          setFiles(
            data.files?.length > 0
              ? data.files
              : [{ filename: '', codeBefore: '', codeAfter: '' }]
          )
        })
    }
  }, [entryId])

  const addFile = () => {
    setFiles((prev) => [
      ...prev,
      { filename: '', codeBefore: '', codeAfter: '' },
    ])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const updateFile = (index: number, key: keyof FileChange, value: string) => {
    const updated = [...files]
    updated[index][key] = value
    setFiles(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !projectName ||
      !taskNo ||
      !taskName ||
      files.some((f) => !f.filename || !f.codeBefore || !f.codeAfter)
    ) {
      alert('Please fill all required fields.')
      return
    }

    setLoading(true)

    const payload = { projectName, taskNo, taskName, description, files }
    const method = entryId ? 'PUT' : 'POST'
    const endpoint = entryId ? `/api/entries/${entryId}` : '/api/entries'

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setLoading(false)
    if (res.ok) {
      router.refresh()
      router.push('/')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        {entryId ? 'Edit Entry' : 'Submit Entry'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Task No</label>
          <input
            type="text"
            value={taskNo}
            onChange={(e) => setTaskNo(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Task Name</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-3 py-2 w-full rounded"
            rows={3}
          />
        </div>

        <div className="space-y-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="border p-4 rounded space-y-2 bg-gray-50 relative"
            >
              <div>
                <label className="block text-sm font-medium">Filename</label>
                <input
                  type="text"
                  value={file.filename}
                  onChange={(e) =>
                    updateFile(index, 'filename', e.target.value)
                  }
                  className="border px-2 py-1 w-full rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Code Before</label>
                <textarea
                  value={file.codeBefore}
                  onChange={(e) =>
                    updateFile(index, 'codeBefore', e.target.value)
                  }
                  className="border px-2 py-1 w-full rounded"
                  rows={25}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Code After</label>
                <textarea
                  value={file.codeAfter}
                  onChange={(e) =>
                    updateFile(index, 'codeAfter', e.target.value)
                  }
                  className="border px-2 py-1 w-full rounded"
                  rows={25}
                  required
                />
              </div>
              {index > 0 && (
                <button
                  type="button"
                  className="absolute top-2 right-2 text-xs text-red-600"
                  onClick={() => removeFile(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addFile}
          className="border border-dashed px-4 py-2 rounded text-sm"
        >
          + Add File
        </button>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded mt-4 block"
        >
          {loading ? 'Submitting…' : entryId ? 'Update' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default function SubmitPageWrapper() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <SubmitPage />
    </Suspense>
  )
}
