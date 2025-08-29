'use client'

import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued'

export default function FileDiffModal({ file, onClose }: { file: any, onClose: () => void }) {
  if (!file) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl p-6">
        <h3 className="text-xl font-bold mb-4">{file.filename}</h3>

        <ReactDiffViewer
          oldValue={file.codeBefore || ''}
          newValue={file.codeAfter || ''}
          splitView
          showDiffOnly={false}
          compareMethod={DiffMethod.WORDS}
          leftTitle="Before"
          rightTitle="After"
        />

        <div className="text-right mt-6">
          <button onClick={onClose} className="bg-gray-200 px-4 py-1 rounded">Close</button>
        </div>
      </div>
    </div>
  )
}
