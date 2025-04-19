// src/app/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AirplaneScene from '@/components/AirplaneScene'

export default function LandingPage() {
    const [slideUp, setSlideUp] = useState(false)
    const router                = useRouter()

    // customise these if you like
    const targetRoute            = '/home'
    const SPLASH_DURATION_MS     = 13_000
    const TRANSITION_DURATION_MS = 600

    useEffect(() => {
        const splashTimer = setTimeout(() => {
            setSlideUp(true)

            const navTimer = setTimeout(
                () => router.push(targetRoute),
                TRANSITION_DURATION_MS
            )
            return () => clearTimeout(navTimer)
        }, SPLASH_DURATION_MS)

        return () => clearTimeout(splashTimer)
    }, [router])

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                transform: slideUp ? 'translateY(-100%)' : 'translateY(0)',
                transition: `transform ${TRANSITION_DURATION_MS}ms ease-in-out`,
            }}
        >
            <AirplaneScene />
        </div>
    )
}