
'use client'
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { ChevronLeft, Trash2, Globe, Save, AlertCircle } from 'lucide-react';
import styles from './settings.module.css';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [defaultLanguage, setDefaultLanguage] = useState('English');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const { data } = await supabase.from('profiles').select('default_language').eq('id', user.id).single();
                if (data?.default_language) setDefaultLanguage(data.default_language);
            }
        };
        fetchProfile();
    }, []);

    const saveSettings = async () => {
        setLoading(true);
        setMessage(null);
        if (user) {
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                default_language: defaultLanguage
            });
            if (error) setMessage({ text: 'Error saving settings', type: 'error' });
            else setMessage({ text: 'Settings saved successfully!', type: 'success' });
        }
        setLoading(false);
    };

    const clearHistory = async () => {
        if (!confirm('Are you sure you want to clear ALL history? This action cannot be undone.')) return;
        setLoading(true);
        if (user) {
            const { error } = await supabase.from('generations').delete().eq('user_id', user.id);
            if (error) setMessage({ text: 'Error clearing history', type: 'error' });
            else setMessage({ text: 'All history cleared!', type: 'success' });
        }
        setLoading(false);
    };

    return (
        <div className={styles.pageContainer}>
            {/* Background Decor */}
            <div className={styles.bgDecor} />

            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLeft}>
                        <Link href="/app" className={styles.backBtn}>
                            <ChevronLeft size={16} /> <span className={styles.backText}>Back</span>
                        </Link>
                        <h1 className={styles.title}>Settings</h1>
                    </div>

                    <div className={styles.userGreeting}>
                        Hi, <span className={styles.userName}>{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</span>
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.card}>

                    {/* Header */}
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Preferences</h2>
                        <p className={styles.sectionDesc}>Customize your default caption settings.</p>
                    </div>

                    {/* Default Language Section */}
                    <div className={styles.sectionContent}>
                        <label className={styles.label}>
                            <Globe size={14} /> Default Language
                        </label>
                        <div className={styles.selectWrapper}>
                            <div className={styles.selectContainer}>
                                <select
                                    className={styles.select}
                                    value={defaultLanguage}
                                    onChange={(e) => setDefaultLanguage(e.target.value)}
                                >
                                    {['English', 'Spanish', 'French', 'Portuguese', 'German', 'Italian', 'Chinese', 'Hindi', 'Arabic'].map(l => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className={styles.actionRow}>
                            <button onClick={saveSettings} className={styles.saveBtn} disabled={loading}>
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                        {message && (
                            <div className={`${styles.message} ${message.type === 'error' ? styles.messageError : styles.messageSuccess}`}>
                                <AlertCircle size={16} />
                                {message.text}
                            </div>
                        )}
                    </div>

                    <div className={styles.divider} />

                    {/* Danger Zone */}
                    <div className={styles.dangerZone}>
                        <label className={styles.dangerLabel}>
                            <Trash2 size={14} /> Danger Zone
                        </label>
                        <div className={styles.dangerBox}>
                            <h3 className={styles.dangerTitle}>Clear Generation History</h3>
                            <p className={styles.dangerDesc}>Permanently remove all your saved captions. This action cannot be undone.</p>
                            <button onClick={clearHistory} className={styles.dangerBtn} disabled={loading}>
                                Clear All History
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
