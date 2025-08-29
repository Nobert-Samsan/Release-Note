'use client'

import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import DiffModal from './DiffModal'

export default function EntriesTable({ entries, role }: { entries: any[]; role: string }) {
  const isManager = role === 'manager'
  const isDeveloper = role === 'developer'
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<any | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 6

  const handleOpenAll = (entry: any) => {
    setSelected(entry)
    setOpen(true)
  }

  const handleDelete = async (entryId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this entry?')
    if (!confirmed) return

    await fetch(`/api/entries/${entryId}`, { method: 'DELETE' })
    router.refresh()
  }

  const filteredEntries = useMemo(() => {
    return entries.filter(
      (entry) =>
        entry.projectName.toLowerCase().includes(search.toLowerCase()) ||
        entry.taskName.toLowerCase().includes(search.toLowerCase())
    )
  }, [entries, search])

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage)
  const paginatedEntries = filteredEntries.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="flex justify-between items-center">
       
        <input
          type="text"
          placeholder="Search project/task..."
          className="border px-3 py-2 rounded text-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1) // reset to page 1 when searching
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full border-separate border-spacing-0 rounded-xl bg-white shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Task No</th>
              <th className="px-4 py-3">Task Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Deployment Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEntries.map((entry) => {
              const isDeployed = !!entry.deployedAt
              return (
                <tr key={entry.id} className="border-t text-sm">
                  <td className="px-4 py-3 font-medium">{entry.projectName}</td>
                  <td className="px-4 py-3">{entry.taskNo}</td>
                  <td className="px-4 py-3">{entry.taskName}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-md">{entry.description}</td>
                  <td className="px-4 py-3">
                    {isDeployed ? new Date(entry.deployedAt).toLocaleDateString() : ''}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleOpenAll(entry)}
                      className="rounded-md bg-black px-3 py-1.5 text-white hover:opacity-90"
                    >
                      Preview
                    </button>
                    {isDeveloper && (
                      <>
                        <button
                          onClick={() =>
                            router.push(
                              `/submit?entryId=${entry.id}&projectName=${encodeURIComponent(
                                entry.projectName
                              )}&taskName=${encodeURIComponent(
                                entry.taskName
                              )}&description=${encodeURIComponent(entry.description || '')}`
                            )
                          }
                          disabled={isDeployed}
                          className={`rounded-md px-3 py-1.5 text-white ${
                            isDeployed
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:opacity-90'
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={isDeployed}
                          className={`rounded-md px-3 py-1.5 text-white ${
                            isDeployed
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-red-600 hover:opacity-90'
                          }`}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 pt-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded border text-sm disabled:opacity-50"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border text-sm ${
              page === i + 1 ? 'bg-gray-200 font-bold' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded border text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <DiffModal open={open} onClose={() => setOpen(false)} entry={selected} onUpdate={(e) => setSelected(e)} />
    </div>
  )
}
