'use client'

import { useEffect, useState } from 'react'

interface NoSSRProps {
  children: React.ReactNode
}

export default function NoSSR({ children }: NoSSRProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">読み込み中...</div>
      </div>
    )
  }

  return <>{children}</>
}