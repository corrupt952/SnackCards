import React from 'react'

export default function Header() {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-8 py-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Reading List</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400 text-lg">Your curated articles and saved reads</p>
      </div>
    </div>
  )
}