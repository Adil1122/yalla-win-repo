'use client'

import React, { useState } from 'react'

type Tab = 'general' | 'definitions_interpretations' | 'information' | 'registration' | 'refund'

export default function TermsAndConditions() {

   const [activeTab, setActiveTab] = useState<Tab>('general')

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
   }

   const tabs = [
      {id: 'general', title: 'general terms and conditions'},
      {id: 'definitions_interpretations', title: 'Definitions and interpretations'},
      {id: 'information', title: 'Information about us'},
      {id: 'registration', title: 'Account registration'},
      {id: 'refund', title: 'Refund policy'},
   ]
   
   return (
      <section className="flex flex-col flex-grow py-8 px-8 lg:px-24 lg:py-16 gap-4 text-white lg:gap-8 h-full w-full bg-gradient-to-r from-themeone to-themetwo">
         <h1 className="text-center text-big-one lg:text-large-head font-bold uppercase mb-6">Terms and conditions</h1>
         <div className="flex flex-col w-full gap-10">
            <div className="flex flex-col lg:flex-row gap-12">
               <div className="flex h-fit flex-col border border-white bg-light-background lg:w-1/4">
                  {tabs.map((tab: any, index: any) => (
                     <div key={index} className={`px-12 py-4 font-medium text-size-3 capitalize border-white ${activeTab === tab.id ? 'border-[3px]' : 'border-[1px] cursor-pointer'}`} onClick={() => handleTabChange(tab.id)}>{tab.title}</div>
                  ))}   
               </div>
               <div className="flex flex-col gap-8 lg:w-3/4">
                  <h3 className="text-head-4 lg:text-big-one font-bold capitalize">{tabs.find((tab) => tab.id === activeTab)?.title}</h3>
                  {activeTab == 'general' && (
                     <>
                        <div className="flex flex-col gap-8">
                           <div className="flex flex-col gap-5">
                              <p>
                                 These General Terms and Conditions (“Terms”) set out the various rules and procedures that apply when You access and use the Platform, create and maintain an Account with Us, purchase Our Products on the Platform, and/or Enter Games.
                              </p>
                              <p>
                                 By accessing and using the Platform, creating and maintaining an Account with Us, purchasing Products on Our Platform, and/or Entering Games, You expressly agree to be bound by these Terms. We also have separate Rules and a Privacy Policy and We recommend that You read and understand these before accessing the Platform, creating an Account, purchasing Products on the Platform and/or Entering Games. Copies of the Rules and Privacy Policy can be found on the Dream Draw Website and Mobile App.
                              </p>
                              <p>
                                 These Terms, Rules and Privacy Policy constitute the entire agreement between You and Dream Draw in relation to You accessing the Platform, creating an Account, purchasing Products and/or Entering Games. The Rules and Privacy Policy are hereby incorporated into, and form part of these Terms. By accepting these Terms, You agree to be legally bound by the Dream Draw Terms, Rules and Privacy Policy.
                              </p>
                           </div>
                        </div>
                        <div className="flex flex-col gap-3">
                           <h3 className="text-head-4 lg:text-head-5 font-bold capitalize">Date of Issue: 17th October 2021</h3>
                        </div>
                     </>
                  )}
                  {activeTab == 'definitions_interpretations' && (
                     <>
                        <div className="flex flex-col gap-8">
                           <div className="flex flex-col gap-5">
                              <p>
                                 1.1 In these Terms:
                              </p>
                              <ul className="ml-8 list-disc">
                                 <li>Capitalised words and expressions used but not defined shall have the meanings given to them in the Rules; and</li>
                                 <li>
                                    Unless the context otherwise requires, words in the singular shall include the plural and, in the plural, shall 
                                    include the singular
                                 </li>
                              </ul>
                              <p>
                                 1.2 In the event of any conflict or inconsistency between the various documents set out above, the order of precedence is: (1) these Terms; (2) the Rules; and (3) Privacy Policy.
                              </p>
                              <p>
                                 1.3 In the event of any conflict or inconsistency between the English and Arabic translations of these Terms, the English version of these Terms shall prevail to the extent of the
                              </p>
                           </div>
                        </div>
                     </>
                  )}
                  {activeTab == 'information' && (
                     <>
                        <div className="flex flex-col gap-8">
                           <div className="flex flex-col gap-5">
                              <p>
                                 2.1 The Platform is owned and operated by Dream Draw L.L.C.-FZ, a Limited Liability Company incorporated in the UAE.
                              </p>
                              <p>
                                 2.2 Dream Draw’s Customer Service Centre can be contacted on +971 4 397 4070 or by sending an email to customer-support@dreamdraw.ae
                              </p>
                           </div>
                        </div>
                     </>
                  )}
                  {activeTab == 'registration' && (
                     <>
                        <div className="flex flex-col gap-8">
                           <div className="flex flex-col gap-5">
                              <p>3.1 Eligibility</p>
                              <ul className="ml-8 list-disc flex flex-col gap-3"> 
                                 <li>Certain parts of the Platform (including the ability to purchase Products and/or Enter Games) require Customers to create an Account in order to access them.</li>
                                 <li>To be eligible to create and maintain an Account, You must:</li>
                                 <li>
                                    <ul className="ml-12 list-disc flex flex-col gap-3">
                                       <li>be at least 18 years of age at the time of purchase;</li>
                                       <li>not be prohibited or restricted from creating or accessing Your Account and/or Entering Games, under the laws of Your jurisdiction of residence in which You are physically located when transacting with Us;</li>
                                       <li>not already have an Account;</li>
                                       <li>at all times abide by these Terms and the Rules;</li>
                                       <li>not be a resident of a sanctioned country (Please see Appendix for the list of sanctioned countries) ; or</li>
                                       <li>named on a Sanctions List.</li>
                                    </ul>
                                 </li>
                                 <li>Prior to creating Your Account, You will be required to tick boxes confirming the above. If You do not meet all of these eligibility requirements, You should not create an Account or Enter Games.</li>
                                 <li>We reserve the right to refuse an application to open an Account for any reason, and have the right to verify Your age, identity and eligibility at any time. We will terminate the Account of any Participant found not to be eligible. In addition, We reserve the right to refuse to pay a Participant a Prize, if the Participant does not meet the abovementioned criteria. If a Prize is paid to anyone who does not meet the criteria set out in this Clause 1, that person will be required to repay the Prize immediately upon Our request.</li>
                                 <li>We make no representations or warranties, implicit or explicit, as to Your legal right to register and create an Account, purchase Products or access and Enter Games. No person affiliated, or claiming affiliation with the Manager, shall have authority to make any such representations or warranties. We do not intend for Games to be Entered by persons present in jurisdictions in which participation may be prohibited or restricted.</li>
                                 <li>The ability to register and create an Account and purchase Products does not constitute an offer, solicitation or invitation by Us for persons to create an Account or purchase Products in any jurisdiction in which such activities are prohibited or restricted.</li>
                              </ul>
                              <p>3.2 How to Register</p>
                              <ul className="ml-8 list-disc flex flex-col gap-3">
                                 <li>In order to register and open an Account, You will be required to provide Us with certain information about You. You agree to ensure that such information is true, accurate, up to date and is kept complete on an ongoing basis. Updates to Your information may only be made through Your Account unless We decide otherwise at Our discretion (and in exceptional circumstances).</li>
                                 <li>We may ask You for further information to verify any aspect of the information You have provided to Us. You agree that We may take reasonable measures to verify the information You have provided.</li>
                                 <li>We process all information provided by You in accordance with Our Privacy Policy. By providing Us with information, You agree to Us holding and processing it in line with the Privacy Policy.</li>
                              </ul>
                              <p>3.3 Using Your Account</p>
                              <ul className="ml-8 list-disc flex flex-col gap-3">
                                 <li>Upon successfully opening an Account, You can purchase Products and/or Services. Should You choose each Product and/or Service, Your purchase entitles You to receive one complimentary Entry. You must only Enter Games when You are physically located in a jurisdiction within which it is lawful to do to so.</li>
                                 <li>As You are solely responsible for any and all activities conducted through the use of Your Account, You must keep Your Password secure and secret at all times and take steps to prevent it being used without Your permission. In the event that You discover that there has been unauthorised access to Your Account, You should inform Us immediately by contacting Dream Draw’s Customer Services Centre.</li>
                                 <li>You may not permit another individual to use Your Password and/or Account. You are liable for any harm resulting from disclosing or allowing disclosure of Your Password, or from the use by any person of Your Password to gain access to Your Account.</li>
                                 <li>You acknowledge that We may investigate any unauthorised access to Your Account.</li>
                                 <li>We are not liable to You for any loss or damage You incur arising out of or in connection with any unauthorised access, including where the unauthorised access has resulted from Your disclosure of Your Password to third parties, whether by negligence or otherwise.</li>
                                 <li>If You forget Your Password, You can reset it by following the instructions on the Platform.</li>
                                 <li>Only the individual registered as the holder of the Account is considered the “Participant” and, subject to the Rules, all Prizes will be paid in full only to the registered holder of the Account. We are not responsible or liable for any disputes arising from Syndicates.</li>
                              </ul>
                              <p>3.4 Responsible Play</p>
                              <ul className="ml-8 list-disc flex flex-col gap-3">
                                 <li>We may, at Our discretion, impose limits on the number of Products You can buy during a defined time period and will notify you if We decide to enforce limits under this Clause 3.4</li>
                              </ul>
                           </div>
                        </div>
                     </>
                  )}
                  {activeTab == 'refund' && (
                     <>
                        <div className="flex flex-col gap-8">
                           <div className="flex flex-col gap-5">
                              <p>
                                 At Dream Draw, we are committed to providing you with high-quality products and exceptional customer service. Please review our refund policy below to understand how we handle refunds and returns:
                              </p>
                              <h4 className="text-head-4 lg:text-head-7 font-bold">Refunds:</h4>
                              <p>Refunds: Refunds will be issued in the following circumstances:</p>
                              <ul className="list-disc ml-12">
                                 <li>If the product received is damaged or not up to the expected quality standards.</li>
                                 <li>If the product is not delivered to you, after 3 consecutive written follow-ups with our customer support team.</li>
                              </ul>
                              <h4 className="text-head-4 lg:text-head-7 font-bold capitalize">Refund process</h4>
                              <ul className="list-disc ml-12">
                                 <li>Refunds may take up to 21 days from the date the refund is approved.</li>
                                 <li>Refunds will be issued back to the original mode of payment used for the purchase.</li>
                              </ul>
                              <h4 className="text-head-4 lg:text-head-7 font-bold capitalize">Exceptions</h4>
                              <ul className="list-disc ml-12">
                                 <li>Refunds will not be processed solely due to a change of mind on the customers part.</li>
                              </ul>
                              <h4 className="text-head-4 lg:text-head-7 font-bold capitalize">How to Request a Refund:</h4>
                              <p>If you believe you are eligible for a refund based on the criteria mentioned above, please follow these steps:</p>
                              <ul className="list-disc ml-12">
                                 <li>Contact our customer support team within 2 days of receiving the product.</li>
                                 <li>Provide details of the issue, including order number, product details, and reason for the refund request.</li>
                                 <li>Our customer support team will review your request and provide further instructions on how to proceed.</li>
                              </ul>
                              <p>If you have any questions or concerns regarding our refund policy, please feel free to contact our customer support team. We are here to assist you and ensure your satisfaction with every aspect of your shopping experience at Dream Draw.</p>
                              <p>Thank you for choosing Dream Draw for your shopping needs.</p>
                           </div>
                        </div>
                     </>
                  )}
               </div>
            </div>
         </div>
      </section>
   )
}
