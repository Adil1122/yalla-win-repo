import dynamic from "next/dynamic"

const Scene = dynamic(() => import("@/components/animation/Scene"), { ssr: false })

export default function Home() {
  return (
    <main className="h-full flex-grow flex bg-black">
      <Scene />
    </main>
  )
}