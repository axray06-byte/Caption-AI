'use client'
import React from 'react';
import { Settings, Target, Users, Type, MessageSquare, Briefcase, ChevronDown } from 'lucide-react';
import styles from './SettingsPanel.module.css';

interface SettingsPanelProps {
    goal: string;
    setGoal: (goal: string) => void;
    platform: string;
    setPlatform: (platform: string) => void;
    audience: string;
    setAudience: (audience: string) => void;
    language: string;
    setLanguage: (lang: string) => void;
    captionLength: string;
    setCaptionLength: (len: string) => void;
    emojiLevel: string;
    setEmojiLevel: (level: string) => void;
    onGenerate: () => void;
    loading: boolean;
    canGenerate: boolean;
    remainingCount: number;
    limitReached: boolean;
}

const GOALS = [
    { value: 'get_more_comments', label: 'Get More Comments' },
    { value: 'go_viral', label: 'Go Viral' },
    { value: 'soft_sell', label: 'Soft Sell' },
    { value: 'premium_tone', label: 'Premium Tone' },
    { value: 'faith_motivation', label: 'Faith Motivation' },
    { value: 'storytelling', label: 'Storytelling' },
];

const PLATFORMS = [
    { value: 'Instagram', label: 'Instagram' },
    { value: 'TikTok', label: 'TikTok' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'WhatsApp Status', label: 'WhatsApp Status' },
];

const AUDIENCES = [
    { value: 'friends', label: 'Friends' },
    { value: 'customers', label: 'Customers' },
    { value: 'church', label: 'Church Community' },
    { value: 'professional', label: 'Professional Network' },
    { value: 'youth', label: 'Youth / Gen Z' },
];

const LANGUAGES = [
    'English', 'Spanish', 'French', 'Portuguese', 'German', 'Italian', 'Chinese', 'Hindi', 'Arabic'
];

const LENGTHS = [
    { value: 'short', label: 'Short' },
    { value: 'medium', label: 'Medium' },
    { value: 'long', label: 'Long' },
];

const EMOJIS = [
    { value: 'none', label: '🚫' },
    { value: 'low', label: '😐' },
    { value: 'normal', label: '🙂' },
    { value: 'high', label: '🤩' },
];

export default function SettingsPanel({
    goal, setGoal,
    platform, setPlatform,
    audience, setAudience,
    language, setLanguage,
    captionLength, setCaptionLength,
    emojiLevel, setEmojiLevel,
    onGenerate,
    loading,
    canGenerate,
    remainingCount,
    limitReached,
}: SettingsPanelProps) {

    const SelectWrapper = ({ children, icon: Icon, label }: any) => (
        <div className={styles.formControl}>
            <label className={styles.label}>
                <span className={styles.labelText}>
                    <Icon size={14} /> {label}
                </span>
            </label>
            <div className={styles.selectWrapper}>
                {children}
                <ChevronDown className={styles.chevronIcon} />
            </div>
        </div>
    );

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Settings size={20} />
                </div>
                <div>
                    <h2 className={styles.title}>Configuration</h2>
                    <p className={styles.subtitle}>Customize your output requirements</p>
                </div>
                <div className={`${styles.limitBadge} ${limitReached ? styles.limitBadgeReached : styles.limitBadgeActive}`}>
                    {remainingCount} Left Today
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.formControl}>
                    <SelectWrapper icon={Target} label="Goal">
                        <select className={styles.selectInput} value={goal} onChange={(e) => setGoal(e.target.value)}>
                            {GOALS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                        </select>
                    </SelectWrapper>
                </div>

                <div className={styles.formControl}>
                    <SelectWrapper icon={Briefcase} label="Platform">
                        <select className={styles.selectInput} value={platform} onChange={(e) => setPlatform(e.target.value)}>
                            {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                    </SelectWrapper>
                </div>

                <div className={styles.formControl}>
                    <SelectWrapper icon={Users} label="Audience">
                        <select className={styles.selectInput} value={audience} onChange={(e) => setAudience(e.target.value)}>
                            {AUDIENCES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                        </select>
                    </SelectWrapper>
                </div>

                <div className={styles.formControl}>
                    <SelectWrapper icon={MessageSquare} label="Language">
                        <select className={styles.selectInput} value={language} onChange={(e) => setLanguage(e.target.value)}>
                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </SelectWrapper>
                </div>

                <div className={styles.formControl}>
                    <label className={styles.label}>
                        <span className={styles.labelText}><Type size={14} /> Length</span>
                    </label>
                    <div className={styles.segmentControl}>
                        {LENGTHS.map(len => (
                            <button
                                key={len.value}
                                onClick={() => setCaptionLength(len.value)}
                                className={`${styles.segmentButton} ${captionLength === len.value ? styles.segmentButtonActive : ''}`}
                            >
                                {len.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.formControl}>
                    <label className={styles.label}>
                        <span className={styles.labelText}>Emoji Level</span>
                    </label>
                    <div className={styles.segmentControl}>
                        {EMOJIS.map(lvl => (
                            <button
                                key={lvl.value}
                                onClick={() => setEmojiLevel(lvl.value)}
                                className={`${styles.emojiButton} ${emojiLevel === lvl.value ? styles.emojiButtonActive : ''}`}
                                title={lvl.value}
                            >
                                {lvl.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button
                    onClick={onGenerate}
                    disabled={!canGenerate || loading}
                    className={`${styles.generateBtn} ${!canGenerate || loading ? styles.generateBtnDisabled : styles.generateBtnPrimary}`}
                >
                    {loading ? (
                        <>
                            <span className={styles.loadingSpinner}></span>
                            <span className="animate-pulse">Crafting...</span>
                        </>
                    ) : limitReached ? (
                        <span className="flex items-center gap-2">Daily Limit Reached 🛑</span>
                    ) : (
                        <span className="flex items-center gap-2">Generate Magic ✨</span>
                    )}
                </button>
                {!canGenerate && !loading && !limitReached && (
                    <p className={styles.waitingText}>
                        <span className={styles.pulseDot}></span>
                        Waiting for image upload...
                    </p>
                )}

                <div className={styles.limitInfo}>
                    <p>Free Tier: 3 generations per day</p>
                    <p className={styles.limitResetText}>Resets daily at midnight local time</p>
                </div>
            </div>
        </div>
    );
}
