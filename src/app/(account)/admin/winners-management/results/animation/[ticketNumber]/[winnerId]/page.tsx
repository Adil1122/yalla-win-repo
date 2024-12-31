'use client'

import React, { useEffect, useRef, useState } from 'react'
import Scene from '@/components/animation/Scene'
import { useParams, useRouter } from 'next/navigation'

interface WinnerProps {
   ticketNumber: string;
   winnerId: string;
}

export default function AdminWinnerVideo() {

   const [winner, setWinner] = useState<any>(null)
   const modelRef = useRef<(HTMLDivElement | null)[]>([])
   const { ticketNumber, winnerId } = useParams()
   const [textures, setTextures] = useState<any>(null)
   const [isUploading, setIsUploading] = useState<boolean>(false)
   const [animationType, setAnimationType] = useState<string>()
   const router = useRouter()

   const getWinnerDetails = async() => {
      try {
         let response = await fetch(`/api/admin/winners-management/results/winner/${ticketNumber}/${winnerId}`, {
            method: 'GET',
         })

         var result = await response.json()

         if(!response.ok) {

         } else {
            setWinner(result.winner[0])
            const formatedTextures = transformTicketToTextures(ticketNumber as string)
            setTextures(formatedTextures)
            console.log(formatedTextures)
         }
      } catch (error) {
         console.log(error)
      }
   }

   const transformTicketToTextures = (input: string): string[] => {
      if (typeof input !== 'string') {
         throw new Error('Input must be a string');
      }

      const length = input.length;

      let items: string[];

      if (length === 12) {
         items = []
         for (let i = 0; i < length; i += 2) {
            items.push(input.slice(i, i + 2))
         }
      } else if (length === 4 || length === 3) {
         items = input.split('')
      } else {
         throw new Error('Input must be a string of length 12, 4, or 3')
      }

      return items.map(item => `/assets/animations/textures/${parseInt(item, 10)}.png`)
   }

   const handleAnimationEnd = async (blob: any) => {

      //setIsUploading(true)

      try {
         const formData = new FormData()
         formData.append("file", blob, `${winnerId}.webm`)
         formData.append('winner', winnerId as string)

         const response = await fetch("/api/uploadVideo", {
            method: "POST",
            body: formData,
         })

         if (!response.ok) {
            throw new Error("Failed to upload video")
         }

         //router.push(`/admin/winners-management/results`)
      } catch (error) {
         alert(`Error uploading video:` + error)
      }
   }

   useEffect(() => {

      getWinnerDetails()
   }, [])

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         {winner && !isUploading && (
            <div className="flex flex-col gap-6 max-h-[600px] max-w-[800px] h-full flex-grow bg-black">
               <Scene modelRef={modelRef} textures={textures} animationType="yalla_4" onAnimationEnd={handleAnimationEnd} />
            </div>
         )}

         {isUploading && (
            <div className="text-white text-3xl flex-grow flex items-center justify-center h-full my-auto">Uploading video. Please wait...</div>
         )}
      </section>
   )
}
