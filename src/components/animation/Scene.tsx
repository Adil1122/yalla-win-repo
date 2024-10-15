"use client"

import { Canvas } from "@react-three/fiber"
import Model from "./Modal"
import { Suspense } from "react"
import { useProgress, Html, ScrollControls, OrbitControls, Environment } from "@react-three/drei"

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress.toFixed(1)} % loaded</Html>
}

export default function Scene() {
  return (
    <div className="flex items-center justify-center flex-grow w-full h-full">
      <Canvas camera={{ position: [-3, 2, 6] }} gl={{ antialias: true }} dpr={[1, 2]} className="relative h-svh">
         <Suspense fallback={<Loader />}>
            <Environment files="/assets/animations/env.hdr" background backgroundBlurriness={0.2} />
            <ScrollControls damping={0.5} pages={100}>
               <Model />
            </ScrollControls>
            <OrbitControls enablePan={false} enableZoom={true} />
         </Suspense>
      </Canvas>
    </div>
  )
}
