// src/components/AirplaneScene.tsx
'use client'

import React, { Suspense, useRef, useState, useEffect, memo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky, Cloud, Environment } from '@react-three/drei'
import * as THREE from 'three'
import AirplaneModel from './AirplaneModel'

function CameraRig({ targetRef }: { targetRef: React.RefObject<THREE.Object3D> }) {
    const { camera } = useThree()
    const elapsed = useRef(0)
    const radius = 5
    const height = 1
    const orbitDuration = 10

    useFrame((_, delta) => {
        if (!targetRef.current) return
        elapsed.current += delta
        const angle = (elapsed.current / orbitDuration) * Math.PI * 2
        const x = radius * Math.cos(angle)
        const z = radius * Math.sin(angle)
        const tgt = targetRef.current.position
        camera.position.set(x + tgt.x, height + tgt.y, z + tgt.z)
        camera.lookAt(tgt)
    })

    return null
}

// Memoized Canvas subtree so parent re‑renders (typewriter) don’t shake it
const CanvasScene = memo(function CanvasScene({ airplaneRef }: { airplaneRef: React.RefObject<THREE.Object3D> }) {
    return (
        <Canvas className="w-full h-full" camera={{ position: [10, 2, 0], fov: 60 }}>
            <Sky distance={450000} sunPosition={[0, -1, 0]} turbidity={20} rayleigh={0.1} mieCoefficient={0.1} mieDirectionalG={0.9} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} intensity={1} />
            <Environment preset="sunset" background blur={0.5} />
            <Cloud position={[0, 5, -10]} speed={0.2} opacity={0.5} />
            <Cloud position={[-10, 7, 0]} speed={0.3} opacity={0.6} />
            <Cloud position={[10, 6, 10]} speed={0.25} opacity={0.4} />
            <Cloud position={[10, -6, 10]} speed={0.25} opacity={0.4} />
            <Cloud position={[-15, 10, -15]} speed={0.2} opacity={0.5} />
            <Cloud position={[15, 8, 15]} speed={0.3} opacity={0.6} />
            <Cloud position={[0, 12, 0]} speed={0.2} opacity={0.5} />
            <Cloud position={[-20, 5, 20]} speed={0.25} opacity={0.4} />
            <Cloud position={[20, 5, -20]} speed={0.25} opacity={0.4} />
            <Cloud position={[5, 15, 5]} speed={0.2} opacity={0.5} />
            <CameraRig targetRef={airplaneRef} />
            <Suspense fallback={null}>
                <group ref={airplaneRef} position={[0, 1.5, 0]}>
                    <AirplaneModel />
                </group>
            </Suspense>
        </Canvas>
    )
})

const AirplaneScene: React.FC = () => {
    const airplaneRef = useRef<THREE.Object3D>(null)
    const [loading, setLoading] = useState(true)
    // Typewriter animation state
    const fullText =
        "Hello Captain, planning an international rotation? You’ve landed on the right page to surf airport data—take a look, we’ll catch up later in the terminal!"
    const [displayedText, setDisplayedText] = useState('')

    useEffect(() => {
        let idx = 0
        const interval = setInterval(() => {
            setDisplayedText(fullText.slice(0, idx + 1))
            idx += 1
            if (idx >= fullText.length) clearInterval(interval)
        }, 50) // 50ms per character
        return () => clearInterval(interval)
    }, [fullText])

    return (
        <div className="relative w-full h-full">
            {/* Main title */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 bg-black bg-opacity-50 rounded-lg animate-grow text-white font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center">
                Welcome to Aero‑Hub
            </div>

            {/* 3D Canvas (memoized) */}
            <CanvasScene airplaneRef={airplaneRef} />

            {/* Typewriter banner */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 bg-black bg-opacity-50 rounded-lg text-white font-medium text-base sm:text-lg md:text-xl lg:text-2xl max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center">
                {displayedText}
                <span className="inline-block w-1 bg-white animate-blink ml-1">&nbsp;</span>
            </div>

            {/* Blinking caret CSS */}
            <style jsx>{` .animate-blink {animation: blink 1s steps(2, start) infinite;}
                @keyframes blink { to {visibility: hidden;} }
      `}</style>
        </div>
    )
}

export default AirplaneScene