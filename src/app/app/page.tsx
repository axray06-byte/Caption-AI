
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import UploadZone from '@/components/UploadZone';
import SettingsPanel from '@/components/SettingsPanel';
import ResultsDisplay from '@/components/ResultsDisplay';
import { ChevronLeft, Calendar, Layout, MessageSquare, Trash2, ArrowRight, Camera, LayoutDashboard, History, Settings, LogOut, Menu, X, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import styles from './app.module.css';

export default function App() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // Settings
    const [goal, setGoal] = useState('get_more_comments');
    const [platform, setPlatform] = useState('Instagram');
    const [audience, setAudience] = useState('friends');
    const [language, setLanguage] = useState('English');
    const [captionLength, setCaptionLength] = useState('short');
    const [emojiLevel, setEmojiLevel] = useState('normal');

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [selectedGeneration, setSelectedGeneration] = useState<any | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [generationsToday, setGenerationsToday] = useState(0);
    const DAILY_LIMIT = 3;

    const [error, setError] = useState<string | null>(null);
    const [isConfigExpanded, setIsConfigExpanded] = useState(true);
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState('Scanning pixels');

    const loadingMessages = [
        'Scanning pixels',
        'Analyzing context',
        'Engineering hooks',
        'Optimizing reach',
        'Polishing results'
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (loading) {
            let index = 0;
            interval = setInterval(() => {
                index = (index + 1) % loadingMessages.length;
                setCurrentLoadingMessage(loadingMessages[index]);
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [loading]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUser(user);
                fetchDailyUsage(user.id);
            }
        };
        checkUser();
    }, [router]);

    const fetchDailyUsage = async (userId: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count, error } = await supabase
            .from('generations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', today.toISOString());

        if (!error && count !== null) {
            setGenerationsToday(count);
        }
    };

    const handleUploadComplete = (url: string, path: string) => {
        setImageUrl(url);
        setResults(null);
    };

    const generateCaptions = async () => {
        if (!imageUrl) return;
        setLoading(true);
        setError(null);

        try {
            const resp = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageUrl,
                    goal,
                    platform,
                    audience,
                    language,
                    captionLength,
                    emojiLevel
                })
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.error || 'Failed to generate captions');
            }

            setResults(data);
            setIsConfigExpanded(false);

            if (user) {
                await supabase.from('generations').insert({
                    user_id: user.id,
                    image_url: imageUrl,
                    goal,
                    platform,
                    audience,
                    language,
                    caption_length: captionLength,
                    emoji_level: emojiLevel,
                    result_json: data
                });
                fetchDailyUsage(user.id);
            }

        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (!user) return <div className={styles.loadingScreen}><div className="loading-spinner"></div></div>;

    return (
        <div className={styles.pageContainer}>
            {/* Background Ambience */}
            <div className={styles.bgDecorTop} />
            <div className={styles.bgDecorBottom} />

            {/* Header Navigation */}
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    <div className={styles.logoIconWrapper}>
                        <Camera size={20} className={styles.logoIcon} />
                    </div>
                    <span className={styles.logoText}>Caption AI</span>
                </Link>

                <nav className={styles.nav}>
                    <div className={styles.navLinks}>
                        <Link href="/app" className={`${styles.navLink} ${styles.navLinkActive}`}>
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <Link href="/history" className={styles.navLink}>
                            <History size={18} />
                            History
                        </Link>
                    </div>

                    <div className={styles.userGreeting}>
                        Hi, <span className={styles.userName}>{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</span>
                    </div>

                    <div className={styles.navActions}>
                        <button onClick={() => setIsMenuOpen(true)} className={`${styles.iconBtn} ${styles.menuBtn}`} title="Menu">
                            <Menu size={20} />
                        </button>
                        <button onClick={handleLogout} className={styles.iconBtn} title="Log Out">
                            <LogOut size={20} />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileMenuHeader}>
                        <div className={styles.mobileUserGreeting}>
                            <span className={styles.mobileWelcome}>Welcome,</span>
                            <span className={styles.mobileUserName}>{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</span>
                        </div>
                        <button onClick={() => setIsMenuOpen(false)} className={styles.iconBtn}>
                            <X size={24} />
                        </button>
                    </div>
                    <div className={styles.mobileNavLinks}>
                        <Link href="/app" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                            <LayoutDashboard size={24} /> Dashboard
                        </Link>
                        <Link href="/history" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                            <History size={24} /> History
                        </Link>
                        <Link href="/settings" className={styles.mobileNavLink} onClick={() => setIsMenuOpen(false)}>
                            <Settings size={24} /> Settings
                        </Link>
                    </div>
                </div>
            )}

            <main className={styles.main}>
                <div className={`${styles.dashboardGrid} ${!isConfigExpanded ? styles.dashboardGridCollapsed : ''}`}>

                    {/* Left Panel: Config & Upload */}
                    <div className={`${styles.configPanel} ${!isConfigExpanded ? styles.configPanelCollapsed : ''}`}>
                        {isConfigExpanded ? (
                            <>
                                {/* 1. Upload Section */}
                                <div className={styles.uploadSection}>
                                    <div className={styles.sectionHeader}>
                                        <div className={styles.sectionNumber}>1</div>
                                        <h3 className={styles.sectionTitle}>Upload Image</h3>
                                    </div>
                                    <UploadZone onUploadComplete={handleUploadComplete} />
                                </div>

                                {/* 2. Settings Section */}
                                <div className={styles.settingsSection}>
                                    <div style={{ padding: '1.5rem', paddingBottom: 0 }}>
                                        <div className={styles.sectionHeader}>
                                            <div className={styles.sectionNumber}>2</div>
                                            <h3 className={styles.sectionTitle}>Configure</h3>
                                        </div>
                                    </div>
                                    <SettingsPanel
                                        goal={goal} setGoal={setGoal}
                                        platform={platform} setPlatform={setPlatform}
                                        audience={audience} setAudience={setAudience}
                                        language={language} setLanguage={setLanguage}
                                        captionLength={captionLength} setCaptionLength={setCaptionLength}
                                        emojiLevel={emojiLevel} setEmojiLevel={setEmojiLevel}
                                        onGenerate={generateCaptions}
                                        loading={loading}
                                        canGenerate={!!imageUrl && generationsToday < DAILY_LIMIT}
                                        remainingCount={DAILY_LIMIT - generationsToday}
                                        limitReached={generationsToday >= DAILY_LIMIT}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className={styles.collapsedBar} onClick={() => {
                                setIsConfigExpanded(true);
                                if (window.innerWidth < 1024) {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}>
                                <button className={styles.expandBtn} title="Expand Configuration">
                                    <Settings size={20} />
                                </button>
                                <div className={styles.verticalTextWrapper}>
                                    <span className={styles.verticalText}>Edit Configuration</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Results */}
                    <div className={styles.resultsPanel}>
                        {error ? (
                            <div className={styles.errorState}>
                                <AlertCircle size={24} />
                                <div>
                                    <h4 style={{ fontWeight: 600 }}>Generation Failed</h4>
                                    <p style={{ opacity: 0.8 }}>{error}</p>
                                    <button
                                        onClick={() => setError(null)}
                                        style={{ marginTop: '0.5rem', textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        ) : loading ? (
                            <div className={styles.progressContainer}>
                                <div className={styles.progressHeader}>
                                    <Sparkles className={styles.progressIcon} size={24} />
                                    <h3 className={styles.progressTitle}>Generating Magic...</h3>
                                    <p className={styles.progressSubtitle}>Analyzing mood, context, and psychology</p>
                                </div>
                                <div className={styles.progressBarWrapper}>
                                    <div className={styles.progressBarFill}>
                                        <div className={styles.progressBarGlow} />
                                    </div>
                                </div>
                                <div className={styles.loadingStatusWrapper}>
                                    <span className={styles.loadingStatusText}>{currentLoadingMessage}...</span>
                                </div>
                            </div>
                        ) : results ? (
                            <ResultsDisplay results={results} />
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIconBox}>
                                    <Sparkles size={48} color="#8b5cf6" />
                                </div>
                                <h3 className={styles.emptyTitle}>Ready to Create</h3>
                                <p className={styles.emptyDesc}>
                                    Upload a photo on the left, tweak your settings, and watch our AI generate perfect captions instantly.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}

