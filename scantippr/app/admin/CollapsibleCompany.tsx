'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CollapsibleCompany({ company }: { company: any }) {
  const [open, setOpen] = useState(true)
  const [guards, setGuards] = useState(company.guards ?? [])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFirst, setEditFirst] = useState('')
  const [editLast, setEditLast] = useState('')
  const [editJob, setEditJob] = useState('')
  const [saving, setSaving] = useState(false)

  const startEdit = (guard: any) => {
    setEditingId(guard.id)
    setEditFirst(guard.first_name)
    setEditLast(guard.last_name)
    setEditJob(guard.job_title ?? '')
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = async (guardId: string) => {
    setSaving(true)
    await supabase
      .from('guards')
      .update({
        first_name: editFirst.trim(),
        last_name: editLast.trim(),
        job_title: editJob.trim() || null,
      })
      .eq('id', guardId)

    setGuards((prev: any[]) =>
      prev.map((g) =>
        g.id === guardId
          ? { ...g, first_name: editFirst.trim(), last_name: editLast.trim(), job_title: editJob.trim() || null }
          : g
      )
    )
    setEditingId(null)
    setSaving(false)
  }

  const toggleActive = async (guard: any) => {
    const newStatus = !guard.is_active
    await supabase
      .from('guards')
      .update({ is_active: newStatus })
      .eq('id', guard.id)

    setGuards((prev: any[]) =>
      prev.map((g) => (g.id === guard.id ? { ...g, is_active: newStatus } : g))
    )
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left mb-2"
      >
        <h3 className="text-lg font-bold text-gray-800">{company.name}</h3>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Job Title</th>
              <th className="pb-2">Employee ID</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">QR Code</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guards.map((guard: any) => (
              <tr key={guard.id} className="border-b last:border-0">
                {editingId === guard.id ? (
                  <>
                    <td className="py-2">
                      <div className="flex gap-1">
                        <input
                          value={editFirst}
                          onChange={(e) => setEditFirst(e.target.value)}
                          className="border rounded px-2 py-1 text-xs w-20"
                        />
                        <input
                          value={editLast}
                          onChange={(e) => setEditLast(e.target.value)}
                          className="border rounded px-2 py-1 text-xs w-20"
                        />
                      </div>
                    </td>
                    <td className="py-2">
                      <input
                        value={editJob}
                        onChange={(e) => setEditJob(e.target.value)}
                        className="border rounded px-2 py-1 text-xs w-32"
                        placeholder="Job title"
                      />
                    </td>
                    <td className="py-2 text-gray-500 text-xs">{guard.id}</td>
                    <td className="py-2">
                      <span className={guard.is_active
                        ? 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-700'
                        : 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500'}>
                        {guard.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2">
                      <a href={'/api/qr/' + guard.id} target="_blank" className="text-blue-500 hover:underline text-xs">
                        Download QR
                      </a>
                      <span className="text-gray-300 mx-1">|</span>
                      <a href={'/guard-card/' + guard.id} target="_blank" className="text-blue-500 hover:underline text-xs">
                        Print card
                      </a>
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(guard.id)}
                          disabled={saving}
                          className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 font-medium">{guard.first_name} {guard.last_name}</td>
                    <td className="py-2 text-gray-500">{guard.job_title || '—'}</td>
                    <td className="py-2 text-gray-500 text-xs">{guard.id}</td>
                    <td className="py-2">
                      <span className={guard.is_active
                        ? 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-700'
                        : 'px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500'}>
                        {guard.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-2">
                      <a href={'/api/qr/' + guard.id} target="_blank" className="text-blue-500 hover:underline text-xs">
                        Download QR
                      </a>
                      <span className="text-gray-300 mx-1">|</span>
                      <a href={'/guard-card/' + guard.id} target="_blank" className="text-blue-500 hover:underline text-xs">
                        Print card
                      </a>
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(guard)}
                          className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(guard)}
                          className={`text-xs px-2 py-1 rounded ${
                            guard.is_active
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {guard.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}