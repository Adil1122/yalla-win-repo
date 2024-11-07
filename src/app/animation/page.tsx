"use client" // Add this directive to mark this file as a Client Component

import dynamic from "next/dynamic"
import { useRef } from "react"

const Scene = dynamic(() => import("@/components/animation/Scene"), { ssr: false })

export default function Home() {
   const modelRef = useRef<any>(null)

   const handleStartAnimation = () => {
      if (modelRef.current) {
         modelRef.current.startAnimation()
      }
   }

   const textures = [
      "/assets/animations/textures/1.png"
   ]

   return (
      <main className="h-full flex-grow flex flex-col bg-black">
         <Scene modelRef={modelRef} textures={textures} />
         <button onClick={handleStartAnimation} className="my-4 bg-blue-500 text-white rounded w-fit px-6 py-2 mx-auto">
            Start Animation
         </button>
      </main>
   )
}