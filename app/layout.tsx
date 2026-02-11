import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Threads AI 排程系統',
  description: '本地 Threads AI 草稿排程系統',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
