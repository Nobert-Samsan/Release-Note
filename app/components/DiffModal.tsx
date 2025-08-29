'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import FileDiffModal from './FileDiffModal'

interface DiffModalProps {
  open: boolean
  onClose: () => void
  entry?: any
  onUpdate?: (updatedEntry: any) => void
}

export default function DiffModal({
  open,
  onClose,
  entry,
  onUpdate,
}: DiffModalProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const role = session?.user?.role
  const isManager = role === 'manager'

  const [deploymentDate, setDeploymentDate] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any | null>(null)

  useEffect(() => {
    if (!entry) {
      setDeploymentDate('')
      return
    }
    if (entry.deployedAt) {
      const d = new Date(entry.deployedAt)
      if (!isNaN(d.getTime())) {
        setDeploymentDate(d.toISOString().split('T')[0])
      } else if (typeof entry.deployedAt === 'string' && entry.deployedAt.includes('T')) {
        setDeploymentDate(entry.deployedAt.split('T')[0])
      } else {
        setDeploymentDate('')
      }
    } else {
      setDeploymentDate('')
    }
  }, [entry])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => 
      {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleSaveDate = useCallback(async () => {
    if (!entry?.id || !deploymentDate) return
    setSaving(true)
    try {
      const res = await fetch(`/api/entries/${entry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deployedAt: deploymentDate }),
      })
      if (!res.ok) {
        setSaving(false)
        return
      }
      const updated = await res.json()
      onUpdate?.(updated)
      onClose()
      router.refresh()
    } finally {
      setSaving(false)
    }
  }, [entry?.id, deploymentDate, onUpdate, onClose, router])

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <div className="relative z-10 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-1">Release Note : {entry.taskNo}</h3>
            <p className="text-sm text-gray-600 mb-1">Project : {entry.projectName}</p>
            <p className="text-sm text-gray-600 mb-1">Task : {entry.taskName}</p>
            <p className="text-sm text-gray-600 mb-1">Description : {entry.description}</p>
            <p className="text-sm text-gray-500">Developer : {entry.user?.username}</p>

            {isManager && (
              <div className="mt-4">
                <label className="text-sm font-medium">Deployment Date</label>
                <div className="flex gap-3 mt-1">
                  <input
                    type="date"
                    value={deploymentDate}
                    onChange={(e) => setDeploymentDate(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                  <button
                    onClick={handleSaveDate}
                    className="bg-black text-white px-3 py-1 rounded disabled:opacity-50"
                    disabled={saving || !deploymentDate}
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Files Changed</p>
            {entry.files?.length ? (
              <ul className="list-disc pl-5 space-y-1">
                {entry.files.map((file: any, idx: number) => (
                  <li
                    key={idx}
                    className="cursor-pointer text-blue-600 underline"
                    onClick={() => setSelectedFile(file)}
                  >
                    {file.filename}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">—</p>
            )}
          </div>

          <div className="text-right mt-6">
            <button onClick={onClose} className="bg-gray-200 px-4 py-1 rounded">
              Close
            </button>
          </div>
        </div>
      </div>

      {selectedFile && (
        <FileDiffModal file={selectedFile} onClose={() => setSelectedFile(null)} />
      )}
    </>
  )
}
