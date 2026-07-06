'use client'

import { useState } from 'react'

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="mb-10">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mb-4 w-full text-left"
      >
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && children}
    </section>
  )
}