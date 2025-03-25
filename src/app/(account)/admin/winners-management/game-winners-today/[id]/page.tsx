'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { faArrowLeft, faEye, faChevronLeft, faChevronRight, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { formatDate } from '@/libs/common'
import Modal from '@/components/modal'

function AdminGameWinnersList({ params } : any) {
    const router = useRouter()
    const [winners, setWinners] = useState<any>()
    
    const getWinnersList = async () => {
        try {
            let response = await fetch(`/api/admin/winners-management/game-winners-today/list?game=${params.id}`, {
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
    
        getWinnersList()
    }, [])

    return (
        <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
            <div className="flex flex-col flex-grow">
                <div className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
                    <div onClick={() => {router.back()}} className="cursor-pointer">
                        <FontAwesomeIcon size="xl" icon={faArrowLeft} />
                    </div>
                    <div className="text-head-3 font-medium">Game Winners List</div>
                </div>

                <div className="flex flex-col mt-12 px-12">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white">
                                <th scope="col" className="w-[12%] text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Winner Name</th>
                                <th scope="col" className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Game Name</th>
                                <th scope="col" className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Game Type</th>
                                <th scope="col" className="w-[5%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Ticket No</th>
                                <th scope="col" className="w-[12%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Winning Amount</th>
                                <th scope="col" className="w-[10%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Winning Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                            {winners && winners.map((winner: any, index: number) => (
                            <tr key={index}>
                                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.user_name}</td>
                                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.GameDetails ? winner.GameDetails[0].name : ''}</td>
                                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.TicketDetails ? winner.TicketDetails[0].ticket_type : ''}</td>
                                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.TicketDetails ? (winner.GameDetails[0].name == 'Yalla 6' ? winner.TicketDetails[0].ticket_splitted.join("") : winner.TicketDetails[0].ticket_number.replace(/,/g, "").trim()) : ''}</td>
                                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{winner.prize_amount}</td>
                                <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{formatDate(winner.winning_date).split(" ")[0]}</td>
                            </tr>
                            ))}
                            {(!winners || winners.length == 0) && (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-darkone font-medium">No winners list</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}

export default function GameWinnersListPage ({ params }: any) {
   return (
      <Suspense>
         <AdminGameWinnersList params={params} />
      </Suspense>
   )
}