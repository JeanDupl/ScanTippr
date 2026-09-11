'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AddCompanyPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    setSaving(true)

    let logo_url = null

    if (logoFile) {
      const ext = logoFile.name.split('.').pop()
      const filename = `logo-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(filename, logoFile, { upsert: true })

      if (!uploadError) {
        const { data } = supabase.storage.from('company-logos').getPublicUrl(filename)
        logo_url = data.publicUrl
      }
    }

    await supabase.from('companies').insert({
      name: name.trim(),
      logo_url,
    })

    router.push('/admin')
  }

  return (
    </div>
  )
}