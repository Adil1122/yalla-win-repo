'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { faArrowLeft, faEye, faChevronLeft, faChevronRight, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatDate } from '@/libs/common'
import Modal from '@/components/modal'

function AdminGameWinnersToday() {
    const router = useRouter()
       const [winners, setWinners] = useState<any>()
    
    const getWinnersToday = async () => {
        try {
            let response = await fetch(`/api/admin/winners-management/game-winners-today`, {
                method: 'GET',
            })

            var content = await response.json()

            if(!response.ok) {

            } else {
                setWinners(content.items)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
    
        getWinnersToday()
    }, [])

    return (
        <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
            <div className="flex flex-col flex-grow">
                <div className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
                    <div onClick={() => {router.back()}} className="cursor-pointer">
                        <FontAwesomeIcon size="xl" icon={faArrowLeft} />
                    </div>
                    <div className="text-head-3 font-medium">Game Winners Today</div>
                </div>

                <div className="flex flex-col mt-12 px-12">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white">
                                <th scope="col" className="w-[14] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Game name</th>
                                <th scope="col" className="w-[14] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Ticket Number</th>
                                <th scope="col" className="w-[14] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Winning Date</th>
                                <th scope="col" className="w-[14] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                            {winners && winners.map((winner: any, index: number) => (
                            <tr key={index}>
                                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.GameDetails.name}</td>
                                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.winning_number}</td>
                                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{formatDate(winner.winning_date).split(" ")[0]}</td>
                                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                                    <div onClick={() => {router.push(`/admin/winners-management/game-winners-today/${winner.game_id}`)}} className="cursor-pointer">
                                        <FontAwesomeIcon size="xl" icon={faEye} />
                                    </div>
                                </td>
                            </tr>
                            ))}
                            {(!winners || winners.length == 0) && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-darkone font-medium">No winners today</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default function GameWinnersTodayPage () {
   return (
      <Suspense>
         <AdminGameWinnersToday />
      </Suspense>
   )
}