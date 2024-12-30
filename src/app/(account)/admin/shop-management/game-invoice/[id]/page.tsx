'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
type InvoiceTab = 'invoice' | 'ticket'
import QRCode from "react-qr-code";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link';
import { formatDate } from '@/libs/common'

const GameProduct = ({ params } : {params: { id: string; }}) => {

    const [activeInvoiceTab, setInvoiceActiveTab] = useState<InvoiceTab>('invoice')
    var [invoice, setInvoice] = useState<any>([])
    var [tickets, setTickets] = useState<any>([])
    const componentRef:any = useRef();

    useEffect(() => {
       getPageContents();
    }, []);
 
    const handleInvoiceTabChange = (tab: InvoiceTab) => {
       setInvoiceActiveTab(tab)
    }
    
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

   var [invoice, setInvoice] = useState<any>([])
   var [tickets, setTickets] = useState<any>([])

   async function getPageContents() {
      try {
        let response = await fetch("/api/user/current-game-purchasing?id=" + params.id, {
            method: "PATCH",
         });
         const content = await response.json();
         console.log(content)

         if(!response.ok) {

         } else {
            setInvoice(content.invoice)
            setTickets(content.tickets)
            console.log('content.invoice: ', content.invoice)
         }
      } catch (error) {
         
      }
   }


   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">

        <div className="flex flex-col flex-grow gap-12">

            <div className="flex flex-col flex-grow">
                <div className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
                    {
                        invoice.length > 0 &&
                        <Link href={"/admin/shop-management/view/" + invoice[0].user_id}>
                            <FontAwesomeIcon size="xl" icon={faArrowLeft} />
                        </Link>
                    }
                    
                    <div className="cursor-pointer text-head-3 font-medium">View Details</div>
                </div>
            </div>
            
            <div className="flex flex-col gap-2 lg:gap-4 w-full">
                <div className="flex flex-row gap-4 text-white text-size-3 lg:text-size-4 mx-auto text-center">
                    <div className={`cursor-pointer ${activeInvoiceTab === 'invoice' ? 'font-bold underline' : ''}`} onClick={() => handleInvoiceTabChange('invoice')}>Invoice</div>
                    <div className={`cursor-pointer ${activeInvoiceTab === 'ticket' ? 'font-bold underline' : ''}`} onClick={() => handleInvoiceTabChange('ticket')}>Ticket</div>
                </div>
                <div className="bg-white w-full lg:w-1/2 mx-auto mt-4 py-4 lg:py-8" ref={componentRef}>
                    {activeInvoiceTab == 'invoice' && (
                    <>
                        <div className="mx-auto w-fit">
                            <img src="/assets/images/logo.svg" alt="" />
                        </div>
                        <div className="bg-custom-purple text-darkone font-noto-sans-black text-head-3 lg:text-big-four uppercase text-center py-2 lg:py-4 mt-4">Invoice</div>
                        <div className="flex flex-col px-8 lg:px-12 font-light text-sm lg:text-size-2 text-black my-4 lg:my-8 gap-2 lg:gap-4">
                            <div className="flex justify-between">
                                <div>Game Name</div>
                                <div>
                                {
                                invoice.length > 0 && 
                                invoice[0].gameInInvoice[0].name
                                }
                                </div>
                            </div>
                            
                            <div className="flex justify-between">
                                <div>Order Number</div>
                                <div>
                                {
                                invoice.length > 0 &&
                                invoice[0].invoice_number
                                }
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>VAT %</div>
                                <div>
                                {
                                invoice.length > 0 &&
                                invoice[0].vat
                                }
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>Total Amount</div>
                                <div>
                                {
                                invoice.length > 0 &&
                                invoice[0].total_amount + ' AED'
                                }
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>Order Date</div>
                                <div>
                                {
                                invoice.length > 0 &&
                                invoice[0].createdAt
                                }
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>Order Status</div>
                                <div className="text-success">
                                {
                                invoice.length > 0 &&
                                invoice[0].invoice_status
                                }
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 mt-4">
                            <QRCode 
                            value={
                                    invoice.length > 0 ?
                                    invoice[0].invoice_number
                                    : 
                                    ''
                                }
                            style={{ height: "auto", width: "100px" }}
                                />
                            <div className="font-light text-sm lg:text-size-2">
                                {
                                    invoice.length > 0 ?
                                    invoice[0].invoice_number
                                    : 
                                    ''
                                }
                            </div>
                        </div>
                    </>
                    )}
                    
                    {activeInvoiceTab == 'ticket' && (
                    <>
                        <div className="mx-auto w-fit">
                            <img src="/assets/images/logo.svg" alt="" />
                        </div>
                        <div className="bg-custom-purple text-darkone font-noto-sans-black text-head-3 lg:text-big-four uppercase text-center py-2 lg:py-4 mt-4">
                            {
                                invoice.length > 0 &&
                                invoice[0].gameInInvoice[0].name
                            }
                        </div>
                        <div className="flex flex-col px-8 lg:px-12 font-light text-sm lg:text-size-2 text-black my-4 lg:my-8 gap-6">
                            <div className="w-fit mx-auto">
                                <img className="max-h-[100px] lg:max-h-[200px]" src="/assets/images/keychain.svg" alt="" />
                            </div>
                            <div className="flex flex-col gap-2 lg:gap-4">
                                <div className="flex justify-between">
                                <div>Order Number</div>
                                <div>
                                {
                                    invoice.length > 0 &&
                                    invoice[0].invoice_number
                                }
                                </div>
                                </div>
                                <div className="flex justify-between">
                                <div>Game Name</div>
                                <div>
                                {
                                    invoice.length > 0 &&
                                    invoice[0].gameInInvoice[0].name
                                }
                                </div>
                                </div>
                                <div className="flex justify-between">
                                <div>VAT %</div>
                                <div>
                                {
                                    invoice.length > 0 &&
                                    invoice[0].vat
                                }
                                </div>
                                </div>
                                <div className="flex justify-between">
                                <div>Total Amount</div>
                                <div>
                                {
                                    invoice.length > 0 &&
                                    invoice[0].total_amount + ' AED'
                                }
                                </div>
                                </div>
                                <div className="flex justify-between">
                                <div>Order Date</div>
                                <div>
                                    {
                                        invoice.length > 0 &&
                                        formatDate(invoice[0].invoice_date)
                                    }
                                </div>
                                </div>
                                <div className="flex justify-between">
                                <div>Order Status</div>
                                <div className="text-success">
                                {
                                    invoice.length > 0 &&
                                    invoice[0].invoice_status
                                }
                                </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-4 lg:grid-cols-4 mt-4 lg:text-size-1 text-xs">
                                <div className="flex flex-col gap-2 items-center">
                                <div className="font-medium lg:font-bold uppercase">Numbers</div>
                                { tickets.map((ticket: any) => (
                                    <div key={ticket.ticket_number} className="font-light">{ticket.ticket_number}</div>
                                ))}
                                </div>
                                <div className="flex flex-col gap-2 items-center">
                                <div className="font-medium lg:font-bold uppercase">Straight</div>
                                { tickets.map((ticket: any) => (
                                    <div key={ticket.ticket_number} className="font-light">{ticket.ticket_type === 'Straight' ? "1" : "0"}</div>
                                ))}
                                </div>
                                <div className="flex flex-col gap-2 items-center">
                                <div className="font-medium lg:font-bold uppercase">Rumble</div>
                                { tickets.map((ticket: any) => (
                                    <div key={ticket.ticket_number} className="font-light">{ticket.ticket_type === 'Rumble' ? "1" : "0"}</div>
                                ))}
                                </div>
                                <div className="flex flex-col gap-2 items-center">
                                <div className="font-medium lg:font-bold uppercase">Chance</div>
                                { tickets.map((ticket: any) => (
                                    <div key={ticket.ticket_number} className="font-light">{ticket.ticket_type === 'Chance' ? "1" : "0"}</div>
                                ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 mt-4">
                          <QRCode 
                           value={
                                invoice.length > 0 ?
                                invoice[0].invoice_number
                                : 
                                ''
                            }
                           style={{ height: "auto", width: "100px" }}
                            />
                           <div className="font-light text-sm lg:text-size-2">
                            {
                                invoice.length > 0 ?
                                invoice[0].invoice_number
                                : 
                                ''
                            }
                           </div>
                        </div>
                    </>
                    )}
                </div>
                <button className="text-center text-themeone bg-white mx-auto mt-8 font-semibold shadow-custom-1 rounded-full py-3 px-16 w-fit" onClick={handlePrint}>Print</button>
            </div>
        </div>
        

      </section>
   )
}

export default GameProduct;
