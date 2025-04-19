// src/components/MainContent.tsx
'use client'

export default function MainContent() {
    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#001F3F',
            color: 'white'
        }}>
            <h1>Welcome to SkyHigh Airlines</h1>
            <p>Book your next adventure now!</p>
            <button style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                background: '#FF6600',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}>
                Get Started
            </button>
        </div>
    )
}