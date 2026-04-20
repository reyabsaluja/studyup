'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // For demo purposes, navigate directly to dashboard
    setTimeout(() => {
      router.push('/')
      setLoading(false)
    }, 800)
  }

  const handleDemoLogin = () => {
    setLoading(true)
    setTimeout(() => {
      router.push('/')
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[var(--accent-primary)] opacity-[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-[var(--accent-secondary)] opacity-[0.04] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-8 h-8 text-[var(--accent-primary)]" />
          <span style={{ fontFamily: 'var(--font-display)' }} className="text-3xl">StudyUp</span>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl p-8">
          <h1 className="text-xl font-semibold mb-1">{isSignUp ? 'Create your account' : 'Welcome back'}</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {isSignUp ? 'Start your learning journey today.' : 'Sign in to continue studying.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Chen"
                  className="w-full px-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-disabled)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-disabled)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-default)] rounded-lg text-sm text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-disabled)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[var(--accent-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-subtle)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[var(--bg-secondary)] px-3 text-[var(--text-disabled)]">or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-secondary)] text-sm font-medium rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
          >
            Continue with Demo Account
          </button>

          <p className="text-center text-xs text-[var(--text-tertiary)] mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[var(--accent-primary)] hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
