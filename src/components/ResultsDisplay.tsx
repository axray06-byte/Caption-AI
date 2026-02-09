
'use client'
import React, { useState } from 'react';
import { Copy, Check, MessageSquare, Hash, BookOpen, Quote, Share2 } from 'lucide-react';
import styles from './ResultsDisplay.module.css';

interface Caption {
    text: string;
    style: string;
    cta: string;
    reason: string;
}

interface ResultsDisplayProps {
    results: {
        photo_summary: string;
        detected_mood: string;
        captions: Caption[];
        hashtags: string[];
        why_it_works: string[];
    };
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
    const [activeTab, setActiveTab] = useState<'captions' | 'hashtags' | 'why'>('captions');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const copyAllHashtags = () => {
        const text = results.hashtags.join(' ');
        navigator.clipboard.writeText(text);
        setCopiedIndex(-1);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const TabButton = ({ value, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(value)}
            className={`${styles.tabButton} ${activeTab === value ? styles.activeTab : ''}`}
        >
            <Icon className={styles.tabIcon} /> {label}
            {activeTab === value && (
                <span className={styles.activeIndicator} />
            )}
        </button>
    );

    return (
        <div className={styles.card}>

            {/* Dynamic Header based on Mood */}
            <div className={styles.header}>
                <div className={styles.quoteDecor}>&quot;</div>
                <div className={styles.headerTop}>
                    <h3 className={styles.statusText}>Analysis Complete</h3>
                    <span className={styles.moodBadge}>
                        {results.detected_mood}
                    </span>
                </div>
                <p className={styles.summary}>{results.photo_summary}</p>
            </div>

            <div className={styles.tabsContainer}>
                <TabButton value="captions" label="Captions" icon={Quote} />
                <TabButton value="hashtags" label="Hashtags" icon={Hash} />
                <TabButton value="why" label="Insights" icon={BookOpen} />
            </div>

            <div className={styles.contentArea}>
                {activeTab === 'captions' && (
                    <div className={styles.captionsList}>
                        {results.captions.map((caption, idx) => (
                            <div key={idx} className={`${styles.captionCard} ${styles['card' + (idx % 3)]}`}>
                                <div className={styles.captionHeader}>
                                    <span className={styles.styleBadge}>
                                        Option {idx + 1}: {caption.style}
                                    </span>
                                    <div className={styles.actions}>
                                        <button
                                            onClick={() => copyToClipboard(caption.text, idx)}
                                            className={`${styles.actionBtn} ${copiedIndex === idx ? styles.btnCopied : ''}`}
                                            title="Copy caption"
                                        >
                                            {copiedIndex === idx ? <Check size={18} /> : <Copy size={18} />}
                                        </button>
                                        {/* Placeholder for future share feature */}
                                        <button className={styles.shareBtn} title="Share (Coming Soon)">
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.captionTextWrapper}>
                                    <p className={styles.captionText}>{caption.text}</p>
                                </div>

                                <div className={styles.reasonWrapper}>
                                    <div className={styles.reasonIcon}>
                                        <BookOpen size={14} />
                                    </div>
                                    <span className={styles.reasonText}><strong className={styles.reasonLabel}>Why this works:</strong> {caption.reason}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'hashtags' && (
                    <div className={styles.hashtagsContainer}>
                        <h4 className={styles.hashtagsTitle}>Curated Hashtags</h4>

                        <div className={styles.tagsBox}>
                            <div className={styles.tagsBoxGlow}></div>

                            <div className={styles.tagsWrapper}>
                                {results.hashtags.map(tag => (
                                    <span key={tag} className={styles.tag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={copyAllHashtags}
                            className={`${styles.copyAllBtn} ${copiedIndex === -1 ? styles.success : ''}`}
                        >
                            {copiedIndex === -1 ? <Check size={20} /> : <Copy size={20} />}
                            {copiedIndex === -1 ? 'Copied to Clipboard!' : 'Copy All Hashtags'}
                        </button>
                    </div>
                )}

                {activeTab === 'why' && (
                    <div className={styles.insightsContainer}>
                        <div className={styles.insightsHeader}>
                            <div className={styles.headerGlow}></div>
                            <h4 className={styles.insightsTitle}>Strategic Breakdown</h4>
                            <p className={styles.insightsSubtitle}>Here&apos;s how the AI tailored these captions to your goal of <span className={styles.moodHighlight}>{results.detected_mood}</span>.</p>
                        </div>

                        <ul className={styles.pointsList}>
                            {results.why_it_works.map((point, i) => (
                                <li key={i} className={styles.pointItem}>
                                    <div className={styles.checkIcon}>✓</div>
                                    <span className={styles.pointText}>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

