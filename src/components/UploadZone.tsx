
'use client'
import React, { useState, useCallback } from 'react'
import { Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import styles from './UploadZone.module.css'

interface UploadZoneProps {
    onUploadComplete: (url: string, path: string) => void
}

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
    const [dragActive, setDragActive] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }, [])

    const uploadFile = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file')
            return
        }

        setUploading(true)
        setError(null)

        try {
            // Create preview immediately
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('You must be logged in to upload')

            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`
            const filePath = fileName

            const { error: uploadError } = await supabase.storage
                .from('uploads')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(filePath)

            onUploadComplete(publicUrl, filePath)
        } catch (err: any) {
            setError(err.message || 'Error uploading file')
            setPreview(null)
        } finally {
            setUploading(false)
        }
    }, [onUploadComplete])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0])
        }
    }, [uploadFile])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            uploadFile(e.target.files[0])
        }
    }

    const clearImage = () => {
        setPreview(null)
    }

    return (
        <div className={styles.container}>
            {preview ? (
                <div className={styles.previewWrapper}>
                    {/* Using standard img for local blob preview as next/image requires configuration for external domains or blobs often */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Upload preview" className={styles.previewImage} />

                    <div className={styles.overlay} />

                    <button
                        onClick={clearImage}
                        className={styles.clearButton}
                    >
                        <X size={20} />
                    </button>

                    {uploading && (
                        <div className={styles.loadingOverlay}>
                            <div className={styles.loadingContent}>
                                <div className={styles.loadingSpinner}></div>
                                <p className={styles.loadingText}>Uploading to Secure Storage...</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div
                    className={`${styles.dropZone} ${dragActive ? styles.dropZoneActive : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        className={styles.uploadInput}
                        id="file-upload"
                        onChange={handleChange}
                        accept="image/*"
                    />
                    <label htmlFor="file-upload" className={styles.uploadLabel}>
                        <div className={styles.iconWrapper}>
                            <Upload size={32} />
                        </div>
                        <p className={styles.uploadText}>Click or drag image to upload</p>
                        <p className={styles.uploadSubtext}>High-res photos work best (JPG, PNG)</p>
                    </label>
                </div>
            )}
            {error && (
                <div className={styles.error}>
                    <span className={styles.errorDot}></span>
                    {error}
                </div>
            )}
        </div>
    )
}

