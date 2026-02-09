
'use client'
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { ChevronLeft, Calendar, Layout, MessageSquare, Trash2, ArrowRight } from 'lucide-react';
import ResultsDisplay from '@/components/ResultsDisplay';
import styles from './history.module.css';

export default function HistoryPage() {
    const [generations, setGenerations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [selectedGeneration, setSelectedGeneration] = useState<any | null>(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                await fetchHistory(user);
            } else {
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchHistory = async (currentUser?: any) => {
        const activeUser = currentUser || user;
        if (!activeUser?.id) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('generations')
            .select('*')
            .eq('user_id', activeUser.id)
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) console.error(error);
        else setGenerations(data || []);
        setLoading(false);
    };

    const deleteGeneration = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this generation?')) return;
        if (!user) return;

        // Optimistic UI update
        const backup = [...generations];
        setGenerations(prev => prev.filter(g => g.id !== id));
        if (selectedGeneration?.id === id) setSelectedGeneration(null);

        try {
            // Use .select() to verify the row was actually deleted and matches the user
            const { data, error, status } = await supabase
                .from('generations')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id)
                .select(); // This allows us to see if a row was actually affected

            if (error) {
                console.error('Delete error:', error);
                setGenerations(backup); // Rollback
                alert('Could not delete item: ' + error.message);
            } else if (!data || data.length === 0) {
                // If data is empty, the query completed but no row matched (RLS issue or ID mismatch)
                console.warn('Delete completed but no rows were affected. Status:', status);
                setGenerations(backup); // Rollback
                alert('Delete failed: You may not have permission to delete this item or it was already removed.');
            } else {
                console.log('Successfully deleted:', id);
                // Success: wait longer before re-fetching to fill the gap
                // 1.5s is safer for database replication/consistency
                setTimeout(() => {
                    fetchHistory();
                }, 1500);
            }
        } catch (err) {
            console.error('Unexpected delete error:', err);
            setGenerations(backup);
        }
    };

    return (
        <div className={styles.pageContainer}>
            {/* Background Decor */}
            <div className={styles.bgDecorTop} />
            <div className={styles.bgDecorBottom} />

            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLeft}>
                        <Link href="/app" className={styles.backBtn}>
                            <ChevronLeft size={16} /> <span className={styles.backText}>Back</span>
                        </Link>
                        <h1 className={styles.title}>History</h1>
                    </div>

                    <div className={styles.userGreeting}>
                        Hi, <span className={styles.userName}>{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</span>
                    </div>
                </div>
            </header>

            <main className={styles.main}>
                {loading ? (
                    <div className={styles.loadingWrapper}>
                        <div className={styles.loadingSpinner}></div>
                    </div>
                ) : generations.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIconWrapper}>
                            <MessageSquare size={32} className={styles.emptyIcon} />
                        </div>
                        <h3 className={styles.emptyTitle}>No history found</h3>
                        <p className={styles.emptyDesc}>Use our AI to generate your first caption and it will automatically appear here.</p>
                        <Link href="/app" className={styles.createBtn}>
                            Create New <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {/* List */}
                        <div className={styles.listCol}>
                            {generations.map((gen) => (
                                <div
                                    key={gen.id}
                                    onClick={() => setSelectedGeneration(gen)}
                                    className={`${styles.listItem} ${selectedGeneration?.id === gen.id ? styles.listItemSelected : ''}`}
                                >
                                    <div className={styles.itemContent}>
                                        <div className={styles.thumbWrapper}>
                                            {gen.image_url ? (
                                                <img src={gen.image_url} alt="Thumbnail" className={styles.thumbnail} />
                                            ) : (
                                                <div className={styles.noImg}>No IMG</div>
                                            )}
                                        </div>
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemHeader}>
                                                <h4 className={styles.itemTitle}>
                                                    {gen.goal ? gen.goal.replace(/_/g, ' ') : 'Generated Caption'}
                                                </h4>
                                                <button
                                                    onClick={(e) => deleteGeneration(gen.id, e)}
                                                    className={styles.deleteBtn}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div className={styles.itemMeta}>
                                                <div className={styles.metaRow}>
                                                    <Layout size={12} />
                                                    <span style={{ textTransform: 'capitalize' }}>{gen.platform}</span>
                                                </div>
                                                <div className={styles.metaRow}>
                                                    <Calendar size={12} />
                                                    <span>{new Date(gen.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Detail View */}
                        <div className={styles.detailCol}>
                            {selectedGeneration ? (
                                <div className={styles.detailContainer}>
                                    <div className={styles.detailContent}>
                                        <ResultsDisplay results={selectedGeneration.result_json} />
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.placeholderState}>
                                    <div className={styles.placeholderIcon}>
                                        <MessageSquare size={48} className={styles.emptyIcon} />
                                    </div>
                                    <h3 className={styles.placeholderTitle}>Select a generation</h3>
                                    <p className={styles.placeholderText}>View details, copy captions, or analyze insights on the left.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
