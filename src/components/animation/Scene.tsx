"use client"

import { Canvas } from "@react-three/fiber"
import Model from "./Modal"
import { Suspense, useRef } from "react"
import { useProgress, Html, OrbitControls, Environment } from "@react-three/drei"

function Loader() {
  const { progress } = useProgress()
  return <Html center style={{ color: 'white' }}>{progress.toFixed(1)} % loaded</Html>
}

export default function Scene({ modelRef }: any) {
   return (
      <div className="flex items-center justify-center flex-grow w-full h-full">
         <Canvas camera={{ position: [-2, 0, 4] }} gl={{ antialias: true }} dpr={[1, 2]} className="relative h-svh">
            <Suspense fallback={<Loader />}>
               <Environment files="/assets/animations/env.hdr" background backgroundBlurriness={0.2} />
               <Model ref={modelRef} />
               <OrbitControls enablePan={false} enableZoom={true} />
            </Suspense>
         </Canvas>
      </div>
   )
}
