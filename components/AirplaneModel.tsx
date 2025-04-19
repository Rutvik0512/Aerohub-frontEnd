// src/components/AirplaneModel.tsx
'use client'

import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function AirplaneModel() {
    const ref = useRef<THREE.Object3D>(null)
    const { scene } = useGLTF('airplane.glb')

    useEffect(() => {
        const box   = new THREE.Box3().setFromObject(scene)
        const pivot = box.getCenter(new THREE.Vector3())
        scene.position.sub(pivot)

        scene.rotation.set(0, -Math.PI / 2, 0)
    }, [scene])


    return <primitive ref={ref} object={scene} scale={0.12} />
}