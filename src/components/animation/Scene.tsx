import { Canvas, useFrame } from "@react-three/fiber"
import Modal from "./Modal"
import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useProgress, Html, Environment } from "@react-three/drei"

function Loader() {
  const { progress } = useProgress()
  return <Html center style={{ color: "white" }}>{progress.toFixed(1)} % loaded</Html>
}

export default function Scene({ modelRef, textures, animationType, onAnimationEnd }: any) {
   const [isModelLoaded, setIsModelLoaded] = useState(false)
   const canvasRef = useRef<HTMLCanvasElement>(null)
   const videoRef = useRef<HTMLVideoElement>(null)
   const animationEndedRef = useRef(false)
   const streamRef = useRef<MediaStream | null>(null)
   const mediaRecorderRef = useRef<MediaRecorder | null>(null)

   useEffect(() => {
      return () => {
         stopStreamCapture()
         animationEndedRef.current = false
      }
   }, [])

   useEffect(() => {
      if (isModelLoaded) {
         setTimeout(() => handleStartAnimation(), 2000)
      }
   }, [isModelLoaded])

   const handleStartAnimation = () => {
      if (modelRef.current) {
         modelRef.current.startAnimation()
      }
   }

   const handleEnded = useCallback(() => {
      markAnimationEnd()
   }, [])

   useEffect(() => {
      const canvasElement = canvasRef.current

      if (canvasElement) {
         const stream = canvasElement.captureStream(15)
         streamRef.current = stream

         if (videoRef.current) {
            videoRef.current.srcObject = stream
         }

         const mediaRecorder = new MediaRecorder(stream)
         mediaRecorderRef.current = mediaRecorder

         let videoChunks: BlobPart[] = []

         mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
               videoChunks.push(event.data)
            }
         }

         mediaRecorder.onstop = () => {
            
            if (!animationEndedRef.current) {
               return
            }
         
            const videoBlob = new Blob(videoChunks, { type: "video/webm" })
            onAnimationEnd(videoBlob)
         }

         mediaRecorder.start()

         return () => {
            stopStreamCapture()
         }
      }
   }, [isModelLoaded])

   const stopStreamCapture = () => {
      if (streamRef.current) {
         streamRef.current.getTracks().forEach(track => track.stop())
         if (videoRef.current) {
            videoRef.current.srcObject = null
         }
      }
   }

   const markAnimationEnd = () => {
      
      animationEndedRef.current = true
      stopStreamCapture()

      if (mediaRecorderRef.current) {
         mediaRecorderRef.current.stop()
      }
   }

   return (
      <div className="flex items-center justify-center flex-grow w-full h-full">
         <Canvas ref={canvasRef} camera={{ position: [-2, 0, 4], fov: 75 }} gl={{ antialias: true }} dpr={[1, 2]} className="relative h-svh">
            <Suspense fallback={<Loader />}>
               <Environment files="/assets/animations/env.hdr" background backgroundBlurriness={0.2} />
               <Modal ref={modelRef} texturess={textures} animationType={animationType} onLoaded={() => setIsModelLoaded(true)} onEnded={handleEnded} />
            </Suspense>
         </Canvas>
      </div>
   )
}