
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, AlertCircle, Camera } from 'lucide-react'
import styles from './login.module.css'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/app')
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/app`, // Redirects to app after success
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <div className={styles.pageContainer}>
            {/* Background Decor */}
            <div className={styles.bgDecorTop} />
            <div className={styles.bgDecorBottom} />

            <div className={styles.authCard}>
                <div className={styles.header}>
                    <div className={styles.logoIcon}>
                        <Camera className="w-6 h-6" />
                    </div>
                    <h1 className={styles.title}>Welcome Back</h1>
                    <p className={styles.subtitle}>Sign in to generate outcome-driven captions</p>
                </div>

                {error && (
                    <div className={styles.error}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <div className={styles.actions}>
                    <button
                        onClick={handleGoogleLogin}
                        className={styles.googleBtn}
                        disabled={loading}
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className={styles.googleIcon} />
                        <span className="font-semibold">Continue with Google</span>
                    </button>

                    <div className={styles.divider}>
                        <div className={styles.dividerLine}></div>
                        <span className={styles.dividerTextSpan}>OR CONTINUE WITH EMAIL</span>
                    </div>

                    <form onSubmit={handleLogin} className={styles.form}>
                        <div className={styles.formControl}>
                            <label className={styles.label}>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <Mail className={styles.inputIcon} />
                                <input
                                    type="email"
                                    className={styles.input}
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formControl}>
                            <label className={styles.label}>Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIcon} />
                                <input
                                    type="password"
                                    className={styles.input}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className={styles.loadingSpinner}></div>
                                    Signing in...
                                </div>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p className={styles.footer}>
                    Don&apos;t have an account? <Link href="/signup" className={styles.link}>Sign up completely free</Link>
                </p>
            </div>
        </div>
    )
}
