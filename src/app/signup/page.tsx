
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, AlertCircle, Sparkles } from 'lucide-react'
import styles from './signup.module.css'

export default function Signup() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/login?message=Check your email to confirm your account')
        }
    }

    const handleGoogleSignup = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/app`,
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        }
    }

    return (
        <div className={styles.pageContainer}>
            {/* Background Ambience */}
            <div className={styles.bgDecorTop} />
            <div className={styles.bgDecorBottom} />

            <div className={styles.authCard}>
                <div className={styles.header}>
                    <div className={styles.logoIcon}>
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h1 className={styles.title}>Create Account</h1>
                    <p className={styles.subtitle}>Join thousands of creators using AI for growth</p>
                </div>

                {error && (
                    <div className={styles.error}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <div className={styles.actions}>
                    <button
                        onClick={handleGoogleSignup}
                        className={styles.googleBtn}
                        disabled={loading}
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className={styles.googleIcon} />
                        <span className="font-semibold">Sign up with Google</span>
                    </button>

                    <div className={styles.divider}>
                        <div className={styles.dividerLine}></div>
                        <span className={styles.dividerTextSpan}>Or register with email</span>
                    </div>

                    <form onSubmit={handleSignup} className={styles.form}>
                        <div className={styles.formControl}>
                            <label className={styles.label}>Full Name</label>
                            <div className={styles.inputWrapper}>
                                <User className={styles.inputIcon} />
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="John Creator"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Minimum 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className={styles.loadingSpinner}></div>
                                    Creating Account...
                                </div>
                            ) : 'Get Started Free'}
                        </button>
                    </form>
                </div>

                <p className={styles.footer}>
                    Already have an account? <Link href="/login" className={styles.link}>Log in</Link>
                </p>
            </div>
        </div>
    )
}
