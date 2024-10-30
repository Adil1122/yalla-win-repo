'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { faArrowLeft, faChevronLeft, faChevronRight, faEye, faPaperPlane, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'
import Link from 'next/link'
import Notification from "@/components/notificationWidget";
import 'suneditor/dist/css/suneditor.min.css'
import suneditor from 'suneditor'
import plugins from 'suneditor/src/plugins'

type Tab = 'details' | 'communication'

export default function AdminViewMerchantDetails({ params } : {params: { id: string; }}) {

   const fileInputRef = useRef<HTMLInputElement | null>(null)
   const participateEditorRef = useRef<any>(null)
   
   const [activeTab, setActiveTab] = useState<Tab>('details')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [messageReply, setMessageReply] = useState<boolean>(false)
   const [imgSrc, setImgSrc] = useState<string>('/assets/images/home.svg')
   const [image, setImage] = useState<File | undefined>()
   const [notif, setNotif] = useState<any>({
      show: false,
      message: '',
      desc: '',
      type: 'success'
   })
   //const [record, setRecord] = useState([]);
   //const [product, setProduct] = useState<any>([]);

   var [product, setProduct] = useState({
      name: "",
      price: "",
  
      name_error: "",
      price_error: "",
      server_error: "",
      server_success: "",
    });

   var [record, setRecord] = useState({

      introduction: "",
      how_to_participate: "",
      option_straight_text: "",
      option_chance_text: "",
      option_rumble_text: "",
      option_straight_win_price: "",
      option_rumble_win_price: "",
      option_chance_3_correct_win_price: "",
      option_chance_2_correct_win_price: "",
      option_chance_1_correct_win_price: "",
      six_numbers_win_price: 1,
      five_numbers_win_price: 1,
      four_numbers_win_price: 1,
      three_numbers_win_price: 1,
      game_name:"",

      introduction_error: "",
      how_to_participate_error: "",
      option_straight_text_error: "",
      option_chance_text_error: "",
      option_rumble_text_error: "",
      option_straight_win_price_error: "",
      option_rumble_win_price_error: "",
      option_chance_3_correct_win_price_error: "",
      option_chance_2_correct_win_price_error: "",
      option_chance_1_correct_win_price_error: "",
      
   }) 
   

   const handleMessageActionClick = (action: 'view' | 'send') => {

      {/* manipulate modal as per the action */}
      setModalIsOpen(true)
   }

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
   }

   const handleButtonClick = () => {
      fileInputRef.current?.click()
   }

   const handleFileChange = (event: any) => {
      const file = event.target.files?.[0]
      if (file) {
         setImage(file)
         const reader = new FileReader()
         reader.onloadend = () => {
            setImgSrc(reader.result as string)
         }
         reader.readAsDataURL(file)
      }
   }

   const setParticipateContent = (newContent: any) => {
      if (participateEditorRef && participateEditorRef.current) {
         
         participateEditorRef.current.setContents(newContent)
      }
   }

   const initiateParticipateEditor = () => {
      let participateEditor = suneditor.create('how_to_participate', {
         plugins: plugins,
         buttonList: [
            ['undo', 'redo'],
            ['fontSize'],
            ['paragraphStyle', 'blockquote'],
            ['bold', 'underline', 'italic', 'strike'],
            '/',
            ['align', 'horizontalRule', 'list', 'image', 'lineHeight'],
            ['fullScreen', 'showBlocks', 'codeView']
         ]
      })

      participateEditor.onChange = function (contents: any, core: any) {
         setRecord((prev) => ({...prev, how_to_participate: contents}))
      }

      return participateEditor
   }

   useEffect(() => {

      let participateEditor = initiateParticipateEditor()
      participateEditorRef.current = participateEditor

      getRecord()

      return () => {
         participateEditor.destroy()
      }
   }, [])

   async function getRecord() {
      try {

         let response = await fetch('/api/admin/updates/view?id=' + params.id, {
            method: 'GET',
          });

          var content = await response.json();

          if(!response.ok) {

          } else {
            console.log('record: ', record)
            if(content.record && content.record.length > 0) {
               setRecord({
                  introduction: content.record[0].introduction,
                  how_to_participate: content.record[0].how_to_participate,
                  option_straight_text: content.record[0].option_straight_text,
                  option_chance_text: content.record[0].option_chance_text,
                  option_rumble_text: content.record[0].option_rumble_text,
                  option_straight_win_price: content.record[0].option_straight_win_price,
                  option_rumble_win_price: content.record[0].option_rumble_win_price,
                  option_chance_3_correct_win_price: content.record[0].option_chance_3_correct_win_price,
                  option_chance_2_correct_win_price: content.record[0].option_chance_2_correct_win_price,
                  option_chance_1_correct_win_price: content.record[0].option_chance_1_correct_win_price,
                  game_name: content.record[0].GameDetails.name,
                  six_numbers_win_price: content.record[0].six_numbers_win_price,
                  five_numbers_win_price: content.record[0].five_numbers_win_price,
                  four_numbers_win_price: content.record[0].four_numbers_win_price,
                  three_numbers_win_price: content.record[0].three_numbers_win_price,
            
                  introduction_error: "",
                  how_to_participate_error: "",
                  option_straight_text_error: "",
                  option_chance_text_error: "",
                  option_rumble_text_error: "",
                  option_straight_win_price_error: "",
                  option_rumble_win_price_error: "",
                  option_chance_3_correct_win_price_error: "",
                  option_chance_2_correct_win_price_error: "",
                  option_chance_1_correct_win_price_error: "",
               })
               
               setParticipateContent(content.record[0].how_to_participate)
            }

            setProduct({
               name: content.product.name,
               price: content.product.price,
           
               name_error: "",
               price_error: "",
               server_error: "",
               server_success: "",
            })

            if(content.product.image !== '') {
               setImgSrc(content.product.image)
            }
            
          }

      } catch (error) {
         
      }
   }

   function updateProduct(value: any) {
      console.log(value);
      return setProduct((prev) => {
        return { ...prev, ...value };
      });
   }

   function updateRecord(value: any) {
      console.log('val: ', value);
      return setRecord((prev) => {
        return { ...prev, ...value };
      });
   }

   function isValidateErrorForm() {
      var err = {
         name_error: "",
         price_error: "",
         introduction_error: "",
         how_to_participate_error: "",
         option_straight_text_error: "",
         option_chance_text_error: "",
         option_rumble_text_error: "",
         option_straight_win_price_error: "",
         option_rumble_win_price_error: "",
         option_chance_3_correct_win_price_error: "",
         option_chance_2_correct_win_price_error: "",
         option_chance_1_correct_win_price_error: "",
       };
       var is_error = false;
       console.log('record: ', record)
   
       // Validation logic
       if (product.name === "") {
         err["name_error"] = "Name is Required";
         is_error = true;
       }

       if (product.price === "") {
         err["price_error"] = "Price is Required";
         is_error = true;
       }

       if (record.introduction === "") {
         err["introduction_error"] = "Introduction is Required";
         is_error = true;
       }

       if (record.how_to_participate === "") {
         err["how_to_participate_error"] = "How to Participate is Required";
         is_error = true;
       }

       if (record.game_name !== 'Yalla 6' && record.option_straight_text === "") {
         err["option_straight_text_error"] = "Option straight text is Required";
         is_error = true;
       }

       if (record.game_name !== 'Yalla 6' && record.option_rumble_text === "") {
         err["option_rumble_text_error"] = "Option rumble text is Required";
         is_error = true;
       }

       if (record.game_name !== 'Yalla 6' && record.option_chance_text === "") {
         err["option_chance_text_error"] = "Option chance text is Required";
         is_error = true;
       }

       if (record.game_name !== 'Yalla 6' && record.option_straight_win_price === "") {
         err["option_straight_win_price_error"] = "Win Price is Required";
         is_error = true;
       }

       if (record.game_name !== 'Yalla 6' && record.option_rumble_win_price === "") {
         err["option_rumble_win_price_error"] = "Win Price is Required";
         is_error = true;
       }

       if (record.game_name !== 'Yalla 6' && record.option_chance_3_correct_win_price === "") {
         err["option_chance_3_correct_win_price_error"] = "Win Price is Required";
         is_error = true;
       }

       if (record.game_name !== 'Yalla 6' && record.option_chance_2_correct_win_price === "") {
         err["option_chance_2_correct_win_price_error"] = "Win Price is Required";
         is_error = true;
       }

       if (record.game_name !== 'Yalla 6' && record.option_chance_3_correct_win_price === "") {
         err["option_chance_1_correct_win_price_error"] = "Win Price is Required";
         is_error = true;
       }

       setProduct((prev) => {
         return { ...prev, ...err };
       });

       setRecord((prev) => {
         return { ...prev, ...err };
       });
   
       console.log("is_error: ", is_error);
   
       return is_error;
   }

   async function onSubmit(e: any) {
      e.preventDefault();
      if (!isValidateErrorForm()) {
         let formData = new FormData();
         formData.append("product_id", params.id);
         formData.append("product_name", product.name);
         formData.append("product_price", product.price);

         formData.append("introduction", record.introduction);
         formData.append("how_to_participate", record.how_to_participate);
         if (record.game_name != 'Yalla 6') {
            formData.append("option_straight_text", record.option_straight_text);
            formData.append("option_chance_text", record.option_chance_text);
            formData.append("option_rumble_text", record.option_rumble_text);
            formData.append("option_straight_win_price", record.option_straight_win_price);
            formData.append("option_rumble_win_price", record.option_rumble_win_price);
            formData.append("option_chance_3_correct_win_price", record.option_chance_3_correct_win_price);
            formData.append("option_chance_2_correct_win_price", record.option_chance_2_correct_win_price);
            formData.append("option_chance_1_correct_win_price", record.option_chance_1_correct_win_price);
            formData.append("is_yalla_6", '0');
         } else {

            formData.append("six_numbers_win_price", record.six_numbers_win_price.toString());
            formData.append("five_numbers_win_price", record.five_numbers_win_price.toString());
            formData.append("four_numbers_win_price", record.four_numbers_win_price.toString());
            formData.append("three_numbers_win_price", record.three_numbers_win_price.toString());
            formData.append("is_yalla_6", '1');
         }
         if (typeof image !== "undefined") {
            formData.append("image", image);
         }

         try {
            let response = await fetch('/api/admin/updates/view', {
               method: 'POST',
               body: formData,
             });

             if(!response.ok) {

               setNotif({
                  show: true,
                  message: 'Server error',
                  desc: '',
                  type: 'error'
               })
             } else {
               setNotif({
                  show: true,
                  message: 'Information Saved',
                  desc: '',
                  type: 'success'
               })
             }
   
         } catch (error) {
            
         }
      }
   }


   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow pb-20 flex-grow h-full">
         <div className="flex flex-col flex-grow">
            <div className="flex items-center bg-light-background-three backdrop-blur-64 py-6 px-12 gap-6 text-white">
               <div className="cursor-pointer">
                  <FontAwesomeIcon size="xl" icon={faArrowLeft} />
               </div>
               <Link href="/admin/updates" className="cursor-pointer text-head-3 font-medium">View Details</Link>
            </div>
            
            <div className="flex flex-col px-12 mt-12 gap-12">
               <div className="flex flex-col w-fit gap-4">
                  <div className="text-white text-head-4">{product.name}</div>
                  <div className="flex flex-col">
                     <div className="flex flex-col relative border border-white">
                        <img className="max-w-[270px]" src={imgSrc} alt="" />
                     </div>
                     <div className="flex w-full bg-white items-center justify-between px-5 py-3">
                        <div className="text-darkone text-size-2">Img</div>
                        <button type="button" onClick={handleButtonClick} className="text-theme-gradient text-size-2 cursor-pointer">Edit</button>
                     </div>
                  </div>
               </div>
               
               <div className="flex flex-col w-fit gap-4 w-full">
                  <div className="text-white text-head-4">Product Description</div>
                  <div className="flex flex-col bg-white px-12 py-12 gap-8">
                     <div className="flex lg:w-1/2 gap-6">
                        <div className="flex flex-col gap-2 flex-1">
                           <div className="text-darkone font-semibold text-size-4">Product Name</div>

                           <div className="text-darkone border border-lighttwo text-size-3 rounded">
                              <input type="text" className="w-full h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" 
                              value={product.name}
                              onChange={(e) => updateProduct({ name: e.target.value })} /> 
                           </div>

                           {product.name_error !== "" && (
                              <span style={{ color: "red" }}>{product.name_error}</span>
                           )}
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                           <div className="text-darkone font-semibold text-size-4">Product Price</div>
                           <div className="text-darkone border border-lighttwo text-size-3 rounded">
                              <input type="text" className="w-full h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                              value={product.price}
                              onChange={(e) => updateProduct({ price: e.target.value })} />
                           </div>

                           {product.price_error !== "" && (
                              <span style={{ color: "red" }}>{product.price_error}</span>
                           )}

                        </div>
                     </div>
                     <input type="file" className="opacity-0 absolute top-0 left-0 w-0 h-0" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="text-darkone font-semibold text-size-4">Introduction</div>
                        <textarea value={record.introduction} className="text-darkone border border-lighttwo text-size-3 px-6 py-3 pb-16 rounded focus:outline-none focus:ring-0 resize-none" onChange={(e) => updateRecord({ introduction: e.target.value })}></textarea>

                        {record.introduction_error !== "" && (
                           <span style={{ color: "red" }}>{record.introduction_error}</span>
                        )}
                        
                     </div>
                     <div className="flex flex-col gap-2 flex-1">
                        <div className="text-darkone font-semibold text-size-4">How to participate</div>
                        <div className="text-darkone text-size-3 rounded z-0">
                           <textarea id="how_to_participate" onChange={() => {}} value={record.how_to_participate} className="w-full text-darkone border border-lighttwo text-size-3 px-6 py-3 pb-16 rounded focus:outline-none focus:ring-0 resize-none min-h-[300px]"></textarea>
                        </div>

                        {record.how_to_participate_error !== "" && (
                           <span style={{ color: "red" }}>{record.how_to_participate_error}</span>
                        )}

                     </div>
                     <div className="flex flex-col lg:flex-row w-full gap-4">
                        <div className="flex flex-col gap-6 w-full">
                           <div className="text-darkone font-semibold text-size-4">Options & Prizes</div>
                           {(record && (record.game_name == 'Yalla 3' || record.game_name == 'Yalla 4')) && (
                           <div className="flex flex-col gap-6">
                              <div className="flex gap-6 justify-between lg:w-[60%]">
                                 <div className="flex flex-col gap-2 lg:w-[50%]">
                                    <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">Option Straight</div>
                                    <div className="text-darkone border border-lighttwo text-size-3 rounded">
                                       <input type="text" className="w-full h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                       value={record.option_straight_text}
                                       onChange={(e) => updateRecord({ option_straight_text: e.target.value })} />
                                    </div>

                                    {record.option_straight_text_error !== "" && (
                                       <span style={{ color: "red" }}>{record.option_straight_text_error}</span>
                                    )}
                                 </div>
                                 <div className="flex items-start text-darkone">
                                    <div className="flex flex-col gap-2 justify-center items-center">
                                       <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                       <div className="border border-lighttwo text-size-3 rounded">
                                          <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                          value={product.price}
                                          onChange={(e) => updateProduct({ price: e.target.value })} />
                                       </div>

                                       {product.price_error !== "" && (
                                          <span style={{ color: "red" }}>{product.price_error}</span>
                                       )}
                                    </div>
                                    <div className="mx-4 text-head-7">*</div>
                                    <div className="flex flex-col gap-2 items-center">
                                       <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                       <div className="border border-lighttwo text-size-3 rounded">
                                          <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                          value={record.option_straight_win_price}
                                          onChange={(e) => updateRecord({ option_straight_win_price: e.target.value })} />
                                       </div>

                                       {record.option_straight_win_price_error !== "" && (
                                          <span style={{ color: "red" }}>{record.option_straight_win_price_error}</span>
                                       )}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex gap-6 justify-between lg:w-[60%]">
                                 <div className="flex flex-col gap-2 lg:w-[50%]">
                                    <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">Option Rumble</div>
                                    <div className="text-darkone border border-lighttwo text-size-3 rounded">
                                       <input type="text" className="w-full h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                       value={record.option_rumble_text}
                                       onChange={(e) => updateRecord({ option_rumble_text: e.target.value })} />
                                    </div>

                                    {record.option_rumble_text_error !== "" && (
                                       <span style={{ color: "red" }}>{record.option_rumble_text_error}</span>
                                    )}
                                 </div>
                                 <div className="flex items-start text-darkone">
                                    <div className="flex flex-col gap-2 justify-center items-center">
                                       <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                       <div className="border border-lighttwo text-size-3 rounded">
                                          <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                          value={product.price}
                                          onChange={(e) => updateProduct({ price: e.target.value })} />
                                       </div>

                                       {product.price_error !== "" && (
                                          <span style={{ color: "red" }}>{product.price_error}</span>
                                       )}

                                    </div>
                                    <div className="mx-4 text-head-7">*</div>
                                    <div className="flex flex-col gap-2 items-center">
                                       <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                       <div className="border border-lighttwo text-size-3 rounded">
                                          <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                          value={record.option_rumble_win_price}
                                          onChange={(e) => updateRecord({ option_rumble_win_price: e.target.value })} />
                                       </div>

                                       {record.option_rumble_win_price_error !== "" && (
                                          <span style={{ color: "red" }}>{record.option_rumble_win_price_error}</span>
                                       )}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col gap-6">
                                 <div className="flex flex-col gap-2">
                                    <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">Option Chance</div>
                                    <div className="text-darkone border border-lighttwo text-size-3 rounded">
                                       <input type="text" className="w-full h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                       value={record.option_chance_text}
                                       onChange={(e) => updateRecord({ option_chance_text: e.target.value })} />
                                    </div>

                                    {record.option_chance_text_error !== "" && (
                                       <span style={{ color: "red" }}>{record.option_chance_text_error}</span>
                                    )}
                                 </div>
                                 <div className="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                    <div className="flex flex-col gap-2 w-fit">
                                       <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">3 Correct Numbers</div>
                                       <div className="flex items-start text-darkone">
                                          <div className="flex flex-col gap-2 justify-center items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                                value={product.price}
                                                onChange={(e) => updateProduct({ price: e.target.value })} />
                                             </div>

                                             {product.price_error !== "" && (
                                                <span style={{ color: "red" }}>{product.price_error}</span>
                                             )}

                                          </div>
                                          <div className="mx-4 text-head-7">*</div>
                                          <div className="flex flex-col gap-2 items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                                value={record.option_chance_3_correct_win_price}
                                                onChange={(e) => updateRecord({ option_chance_3_correct_win_price: e.target.value })} />
                                             </div>

                                             {record.option_chance_3_correct_win_price_error !== "" && (
                                                <span style={{ color: "red" }}>{record.option_chance_3_correct_win_price_error}</span>
                                             )}
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-fit">
                                       <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">2 Correct Numbers</div>
                                       <div className="flex items-start text-darkone">
                                          <div className="flex flex-col gap-2 justify-center items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                                value={product.price}
                                                onChange={(e) => updateProduct({ price: e.target.value })} />
                                             </div>

                                             {product.price_error !== "" && (
                                                <span style={{ color: "red" }}>{product.price_error}</span>
                                             )}
                                          </div>
                                          <div className="mx-4 text-head-7">*</div>
                                          <div className="flex flex-col gap-2 items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                                value={record.option_chance_2_correct_win_price}
                                                onChange={(e) => updateRecord({ option_chance_2_correct_win_price: e.target.value })} />
                                             </div>

                                             {record.option_chance_2_correct_win_price_error !== "" && (
                                                <span style={{ color: "red" }}>{record.option_chance_2_correct_win_price_error}</span>
                                             )}
                                          </div>
                                       </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-fit">
                                       <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">1 Correct Number</div>
                                       <div className="flex items-start text-darkone">
                                          <div className="flex flex-col gap-2 justify-center items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                                value={product.price}
                                                onChange={(e) => updateProduct({ price: e.target.value })} />
                                             </div>

                                             {product.price_error !== "" && (
                                                <span style={{ color: "red" }}>{product.price_error}</span>
                                             )}

                                          </div>
                                          <div className="mx-4 text-head-7">*</div>
                                          <div className="flex flex-col gap-2 items-center">
                                             <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                             <div className="border border-lighttwo text-size-3 rounded">
                                                <input type="text" className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2"
                                                value={record.option_chance_1_correct_win_price}
                                                onChange={(e) => updateRecord({ option_chance_1_correct_win_price: e.target.value })} />
                                             </div>

                                             {record.option_chance_1_correct_win_price_error !== "" && (
                                                <span style={{ color: "red" }}>{record.option_chance_1_correct_win_price_error}</span>
                                             )}
                                          </div>
                                       </div>

                                       

                                       <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={onSubmit}>
                                       Save
                                       </button>
                                    </div>
                                    {/* for yall 4 and yalla 6 add another box below */}
                                 </div>
                              </div>
                           </div>
                           )}
                           {record && record.game_name == 'Yalla 6' && (
                              <div className="flex flex-col gap-6">
                                 <div className="flex gap-6 justify-between lg:w-[60%]">
                                    <div className="flex flex-col gap-2 lg:w-[50%]">
                                       <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">6 Correct Numbers</div>
                                    </div>
                                    <div className="flex items-start text-darkone">
                                       <div className="flex flex-col gap-2 justify-center items-center">
                                          <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                          <div className="border border-lighttwo text-size-3 rounded">
                                             <input type="text" value={product.price} onChange={(e) => updateProduct({ price: e.target.value })} className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" />
                                          </div>

                                          {product.price_error !== "" && (
                                             <span style={{ color: "red" }}>{product.price_error}</span>
                                          )}
                                       </div>
                                       <div className="mx-4 text-head-7">*</div>
                                       <div className="flex flex-col gap-2 items-center">
                                          <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                          <div className="border border-lighttwo text-size-3 rounded">
                                             <input type="number" min="1" value={record.six_numbers_win_price} onChange={(e) => updateRecord({ six_numbers_win_price: e.target.value })} className="w-[150px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" />
                                          </div>

                                          {record.option_straight_win_price_error !== "" && (
                                             <span style={{ color: "red" }}>{record.option_straight_win_price_error}</span>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex gap-6 justify-between lg:w-[60%]">
                                    <div className="flex flex-col gap-2 lg:w-[50%]">
                                       <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">5 Correct Numbers</div>
                                    </div>
                                    <div className="flex items-start text-darkone">
                                       <div className="flex flex-col gap-2 justify-center items-center">
                                          <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                          <div className="border border-lighttwo text-size-3 rounded">
                                             <input type="text" value={product.price} onChange={(e) => updateProduct({ price: e.target.value })} className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" />
                                          </div>

                                          {product.price_error !== "" && (
                                             <span style={{ color: "red" }}>{product.price_error}</span>
                                          )}
                                       </div>
                                       <div className="mx-4 text-head-7">*</div>
                                       <div className="flex flex-col gap-2 items-center">
                                          <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                          <div className="border border-lighttwo text-size-3 rounded">
                                             <input type="number" min="1" value={record.five_numbers_win_price} onChange={(e) => updateRecord({ five_numbers_win_price: e.target.value })} className="w-[150px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" />
                                          </div>

                                          {record.option_straight_win_price_error !== "" && (
                                             <span style={{ color: "red" }}>{record.option_straight_win_price_error}</span>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex gap-6 justify-between lg:w-[60%]">
                                    <div className="flex flex-col gap-2 lg:w-[50%]">
                                       <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">4 Correct Numbers</div>
                                    </div>
                                    <div className="flex items-start text-darkone">
                                       <div className="flex flex-col gap-2 justify-center items-center">
                                          <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                          <div className="border border-lighttwo text-size-3 rounded">
                                             <input type="text" value={product.price} onChange={(e) => updateProduct({ price: e.target.value })} className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" />
                                          </div>

                                          {product.price_error !== "" && (
                                             <span style={{ color: "red" }}>{product.price_error}</span>
                                          )}
                                       </div>
                                       <div className="mx-4 text-head-7">*</div>
                                       <div className="flex flex-col gap-2 items-center">
                                          <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                          <div className="border border-lighttwo text-size-3 rounded">
                                             <input type="number" min="1" value={record.four_numbers_win_price} onChange={(e) => updateRecord({ four_numbers_win_price: e.target.value })} className="w-[150px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" />
                                          </div>

                                          {record.option_straight_win_price_error !== "" && (
                                             <span style={{ color: "red" }}>{record.option_straight_win_price_error}</span>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex gap-6 justify-between lg:w-[60%]">
                                    <div className="flex flex-col gap-2 lg:w-[50%]">
                                       <div className="text-theme-gradient text-size-4 font-medium whitespace-nowrap">3 Correct Numbers</div>
                                    </div>
                                    <div className="flex items-start text-darkone">
                                       <div className="flex flex-col gap-2 justify-center items-center">
                                          <div className="text-size-4 font-medium whitespace-nowrap">Product Price</div>
                                          <div className="border border-lighttwo text-size-3 rounded">
                                             <input type="text" value={product.price} onChange={(e) => updateProduct({ price: e.target.value })} className="w-[60px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" />
                                          </div>

                                          {product.price_error !== "" && (
                                             <span style={{ color: "red" }}>{product.price_error}</span>
                                          )}
                                       </div>
                                       <div className="mx-4 text-head-7">*</div>
                                       <div className="flex flex-col gap-2 items-center">
                                          <div className="text-size-4 font-medium whitespace-nowrap">Win Price</div>
                                          <div className="border border-lighttwo text-size-3 rounded">
                                             <input type="number" min="1" value={record.three_numbers_win_price} onChange={(e) => updateRecord({ three_numbers_win_price: e.target.value })} className="w-[150px] h-[45px] border-none bg-transparent focus:outline-none focus:ring-0 ml-2" />
                                          </div>

                                          {record.option_straight_win_price_error !== "" && (
                                             <span style={{ color: "red" }}>{record.option_straight_win_price_error}</span>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                                 <button className="text-white ml-auto text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={onSubmit}>
                                 Save
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">View Message</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                     <div className="flex flex-col lg:flex-row lg:justify-between">
                        <div className="text-darkone text-size-4">Message</div>
                        <div className="text-lightone text-size-4">10 sep 2024, 12:30 am</div>
                     </div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                     <textarea className="w-full h-[150px] focus:ring-0 focus:outline-none border-none bg-transparent resize-none" placeholder="Message title"></textarea>
                     </div>
                  </div>
                  {messageReply && (
                     <>
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder="Type your reply" />
                           </div>
                        </div>
                        <div className="flex items-center ml-auto gap-6">
                           <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                           <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Save</button>
                        </div>
                     </>
                  )}
                  {!messageReply && (
                     <button onClick={() => setMessageReply(true)} className="text-white text-head-1 ml-auto font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded">Reply</button>
                  )}
               </div>
            </div>
         </Modal>

         { notif.show && 
            <Notification message={notif.message} description={notif.desc} type={notif.type} close={() => {setNotif((prev: any) => ({ ...prev, show: false }))}}  />
         }
      </section>
   )
}
