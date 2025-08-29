'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('developer')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

 
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    })

    const data = await res.json()

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } else {
      setError(data.message || 'Registration failed')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 p-6 bg-white rounded shadow"
      >
        <h2 className="text-xl font-semibold text-center">Register</h2>
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full border px-3 py-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="w-full border px-3 py-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="developer">Developer</option>
          <option value="manager">Manager</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Registration successful!</p>}

        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  )
}


