'use client'

import React, { useEffect, useRef, useState } from 'react'
import { faChevronLeft, faChevronRight, faCommentAlt, faEye, faImage, faPencil, faPlus, faTimes, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@/components/modal'
import { formatDate } from '@/libs/common'

type Tab = 'app-web' | 'merchant'
type TabTwo = 'games' | 'products'

export default function AdminGameProdManagement() {

   const [activeTab, setActiveTab] = useState<Tab>('merchant')
   const [activeTabTwo, setActiveTabTwo] = useState<TabTwo>('games')
   const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
   const [modalTwoIsOpen, setModalTwoIsOpen] = useState<boolean>(false)
   const [modalThreeIsOpen, setModalThreeIsOpen] = useState<boolean>(false)
   const [toggled, setToggled] = useState(false)
   const [productDetails, setProductDetails] = useState([{ key: '', value: '' }])
   var merchant_app: any = 'merchant';
   var product_type:any = 'games';

   const [product_image, setProductImage] = useState<File | undefined>();
   const [prize_image, setPrizeImage] = useState<File | undefined>();

   const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
      product_type = activeTabTwo;
      merchant_app = tab;
      getProducts()
   }

   const handleTabTwoChange = (tab: TabTwo) => {
      setActiveTabTwo(tab)
      product_type = tab;
      merchant_app = activeTab;
      getProducts()
   }

   const handleToggle = () => {
      setToggled(!toggled)
   }

   const handleAddDetails = () => {
      setProductDetails([...productDetails, { key: '', value: '' }])
   }

   const handleDeleteRow = (ind: number) => {
      setProductDetails((prevRows) => prevRows.filter((_, index) => index !== ind))
   }

   var [id, setId] = useState("");

   var [form, setForm] = useState({
      game_name: "",
      game_type: "",
      game_description: "",

      product_name: "",
      product_price: "",
      product_status: "",
      product_date: "",
      product_description: "",

      prize_name: "",
      prize_price: "",
      //prize_specifications: "",

      game_name_error: "",
      game_type_error: "",
      game_description_error: "",
      product_description_error: "",
      product_name_error: "",
      product_price_error: "",
      product_status_error: "",
      product_date_error: "",
      prize_name_error: "",
      prize_price_error: "",
      product_image_error: "",
      prize_image_error: "",
      //prize_specifications_error: "",
      server_error: "",
      server_success: ""
   });

   function updateForm(value: any) {
      console.log(value)
      return setForm((prev) => {
         return { ...prev, ...value };
      });
   }

   function isValidateErrorForm() {
      var err = {
         game_name_error: "",
         game_type_error: "",
         game_description_error: "",
         product_description_error: "",
         product_name_error: "",
         product_price_error: "",
         product_status_error: "",
         product_date_error: "",
         prize_name_error: "",
         prize_price_error: "",
         product_image_error: "",
         prize_image_error: "",
         //prize_specifications_error: "",
      };
      var is_error = false;

      // Validation logic
      if(activeTabTwo === 'games') {
         if (form.game_name === '') {
            
            err['game_name_error'] = 'Game Name is Required';
            is_error = true;
         }
         if (form.game_type === '') {
            err['game_type_error'] = 'Game Type is Required';
            is_error = true;
         }
         if (form.game_description === '') {
            err['game_description_error'] = 'Game Description is Required';
            is_error = true;
         }
      }

      console.log(activeTabTwo)
      if(activeTabTwo === 'products') {
         console.log('here')
         if (form.prize_name === '') {
            err['prize_name_error'] = 'Prize Name is Required';
            is_error = true;
         }
         if (form.prize_price === '') {
            err['prize_price_error'] = 'Prize Price is Required';
            is_error = true;
         }

         if(form.product_description === '') {
            err['product_description_error'] = 'Product Description is Required';
            is_error = true;
         }
      }

      if (form.product_name === '') {
         err['product_name_error'] = 'Product Name is Required';
         is_error = true;
      }

      if (form.product_price === '') {
         err['product_price_error'] = 'Product Price is Required';
         is_error = true;
      }

      if (form.product_status === '') {
         err['product_status_error'] = 'Product Status is Required';
         is_error = true;
      }

      if (form.product_date === '') {
         err['product_date_error'] = 'Product Date is Required';
         is_error = true;
      }

      if (typeof product_image !== 'undefined') {
         var image_type = product_image.type;
         if (image_type.indexOf('image/') === -1) {
            err['product_image_error'] = 'Invalid image format';
            is_error = true;
         }
      }

      if (typeof prize_image !== 'undefined') {
         var image_type = prize_image.type;
         if (image_type.indexOf('image/') === -1) {
            err['prize_image_error'] = 'Invalid image format';
            is_error = true;
         }
      }

      setForm((prev) => {
         return { ...prev, ...err };
      });

      console.log('is_error: ', err)

      return is_error;
   }

   function openCreatePopup(game_prod: any) {
      setForm({
         game_name: "",
         game_type: "",
         game_description: "",

         product_name: "",
         product_price: "",
         product_status: "",
         product_date: "",
         product_description: "",

         prize_name: "",
         prize_price: "",
         //prize_specifications: "",

         game_name_error: "",
         game_type_error: "",
         game_description_error: "",
         product_description_error: "",
         product_name_error: "",
         product_price_error: "",
         product_status_error: "",
         product_date_error: "",
         prize_name_error: "",
         prize_price_error: "",
         product_image_error: "",
         prize_image_error: "",
         //prize_specifications_error: "",
         server_error: "",
         server_success: ""
      });
      setId('');
      if(game_prod === 'games') {
         setModalIsOpen(true);
      } else {
         setModalThreeIsOpen(true);
      }
      setProductDetails([{ key: '', value: '' }])
      setPrizeImage(undefined)
      setProductImage(undefined)
   }

   async function openEditPopup(prod_id: any) {
      setId(prod_id);
      var url = '/api/admin/game-product-management?id=' + prod_id;
      let response = await fetch(url, {
         method: 'PATCH',
      });
      const content = await response.json();
      var data: any = {
         product_name: content.product.name,
         product_price: content.product.price,
         product_status: content.product.status,
         product_date: content.product.date ? new Date(content.product.date).toISOString().slice(0, 10) : '',
         product_description: content.product.description,
         product_image: content.product.image,

         game_name_error: "",
         game_type_error: "",
         game_description_error: "",
         product_description_error: "",
         product_name_error: "",
         product_price_error: "",
         product_status_error: "",
         product_date_error: "",
         prize_name_error: "",
         prize_price_error: "",
         server_error: "",
         server_success: ""
      };

      if(activeTabTwo === 'games') {
         data['game_name'] = content.game.name;
         data['game_type'] = content.game.type;
         data['game_description'] = content.game.description;
      } else {
         data['prize_name'] = content.prize.name;
         data['prize_price'] = content.prize.price;
         data['prize_date'] = content.prize.date ? new Date(content.prize.date).toISOString().slice(0, 10) : '';
         data['prize_image'] = content.prize.image;
         if(content.prize.specifications !== null && content.prize.specifications !== '') {
            console.log(content.prize.specifications)
            setProductDetails(JSON.parse(content.prize.specifications))
         } else {
            setProductDetails(content.prize.specifications)
         }
         
      }

      if(!response.ok) {

      } else {
         setForm(data);
         if(activeTabTwo === 'games') {
            setModalIsOpen(true);
         } else {
            setModalThreeIsOpen(true);
         }
      }
      setPrizeImage(undefined)
      setProductImage(undefined)
   }

   const handleChangeProductFile = (e: any) => {
      const files = e.currentTarget.files;
      if (files)
         setProductImage(files[0]);
   }

   const handleChangePrizeFile = (e: any) => {
      const files = e.currentTarget.files;
      if (files)
         setPrizeImage(files[0]);
   }

   async function onSubmit(e: any) {
      e.preventDefault();
      if (!isValidateErrorForm()) {
         let formData = new FormData();

         if(activeTabTwo === 'games') {
            formData.append('game_name', form.game_name);
            formData.append('game_type', form.game_type);
            formData.append('game_description', form.game_description);
         }

         if(activeTabTwo === 'products') {
            formData.append('prize_name', form.prize_name);
            formData.append('prize_price', form.prize_price);
            formData.append('prize_specifications', JSON.stringify(productDetails));
            formData.append('product_description', form.product_description);
         }

         formData.append('product_name', form.product_name);
         formData.append('product_price', form.product_price);
         formData.append('product_status', form.product_status);
         formData.append('product_date', form.product_date);
         formData.append('type', activeTab);
         formData.append('product_type', activeTabTwo);

         var url = '/api/admin/game-product-management';
         var method = 'POST';
         var success_message = 'Notification created successfully.';
         if(id !== "") {
            url = '/api/admin/game-product-management?id=' + id;
            method = 'PUT';
            success_message = 'Notification updated successfully.';
         }

         if (typeof product_image !== 'undefined') {
            formData.append('product_image', product_image);
         }

         if (typeof prize_image !== 'undefined') {
            formData.append('prize_image', prize_image);
         }

         try {
            let response = await fetch(url, {
               method: method,
               body: formData
            });

            setId('');
            if(activeTabTwo === 'games') {
               setModalIsOpen(false)
            } else {
               setModalThreeIsOpen(false)
            }

            if (!response.ok) {
               setForm((prev) => {
                  return { ...prev, server_error: `HTTP error! status: ${response.status}` };
               });
            } else {
               setForm((prev) => {
                  return { ...prev, server_success: success_message };
               });
               product_type = activeTabTwo;
               merchant_app = activeTab;
               getTotalRecords();
            }
            setProductImage(undefined)
            setPrizeImage(undefined)
         } catch (error) {
            setForm((prev) => {
               return { ...prev, server_error: `A problem occurred with your fetch operation: ${error}` };
            });
         }
      }
   }


   var [products, setProducts] = useState<any>([]);

   useEffect(() => {
      getTotalRecords()
   }, [])

   var [merchant_game_products_count, setMerchantGameProductsCount] = useState(0);
   var [merchant_prize_products_count, setMerchantPrizeProductsCount] = useState(0);
   var [app_game_products_count, setAppGameProductsCount] = useState(0);
   var [app_prize_products_count, setAppPrizeProductsCount] = useState(0);
   var skip = 0;

   var getTotalRecords = async() => {
      try {
         let response = await fetch('/api/admin/game-product-management', {
            method: 'OPTIONS',
         });
         var content = await response.json();
         if(!response.ok) {

         } else {
            setMerchantGameProductsCount(content.merchant_game_products_count)
            setMerchantPrizeProductsCount(content.merchant_prize_products_count)
            setAppGameProductsCount(content.app_game_products_count)
            setAppPrizeProductsCount(content.app_prize_products_count)
            getProducts();
         }
      } catch (error) {
         
      }
   }

   var getProducts = async() => {
      try {
         let response = await fetch('/api/admin/game-product-management?type=' + merchant_app + '&product_type=' + product_type + '&skip=' + skip + '&limit=' + recordsPerPage, {
            method: 'GET',
         });
         var content = await response.json();

         if(!response.ok) {

         } else {
            setProducts(content.products)
         }

      } catch (error) {
      }
   }

   function setIdAndOpenDeletePopup(Id: any) {
      setId(Id);
      setModalTwoIsOpen(true);
   }

   var deleteProduct = async() => {
      let response = await fetch('/api/admin/game-product-management?id=' + id, {
         method: 'DELETE',
      });
      var content = await response.json();
      setId('');
      setModalTwoIsOpen(false)

      if(!response.ok) {

      } else {
         product_type = activeTabTwo;
         merchant_app = activeTab;
         getTotalRecords();
      }
   } 

   var totalPages = 0;
   var [currentPage, setCurrentPage] = useState(1);
   var [recordsPerPage, setRecordsPerPages] = useState(5);

   if(activeTab === 'merchant' && activeTabTwo === 'games') {
      totalPages = merchant_game_products_count;
   } else if(activeTab === 'merchant' && activeTabTwo === 'products') {
      totalPages = merchant_prize_products_count;
   } else if(activeTab === 'app-web' && activeTabTwo === 'games') {
      totalPages = app_game_products_count;
   } else if(activeTab === 'app-web' && activeTabTwo === 'products') {
      totalPages = app_prize_products_count;
   }
   
   var pages = [];
   var show_pages: any = [];
   for(var i = 1; i <= Math.ceil(totalPages / recordsPerPage); i++) {
      pages.push(i);
      if(i === currentPage || i === (currentPage + 1) || i === (currentPage - 1) || i === (currentPage + 2) || i === (currentPage - 2)) {
         show_pages.push(i);
      }
   }
   console.log('pages: ', pages)

   function setPagination(current_page: any) {
      if(current_page < 1) {
         current_page = 1;
      }

      if(current_page > pages.length) {
         current_page = pages.length
      }
      skip = recordsPerPage * (current_page - 1);
      product_type = activeTabTwo;
      merchant_app = activeTab;
      getProducts()
      setCurrentPage(current_page);
   }

   async function changeStatus(id:any) {
      try {
         let response = await fetch('/api/admin/game-product-management/extras?action=change_status&id=' + id, {
            method: 'PUT',
         });
         //var content = await response.json();
         //setId('');
   
         if(!response.ok) {
   
         } else {
            product_type = activeTabTwo;
            merchant_app = activeTab;
            getTotalRecords();
         }
      } catch (error) {
         
      }
   }

   return (
      <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow px-12 py-20 flex-grow h-full">
         <div className="flex flex-col w-full h-full">
            <div className="flex flex-col gap-4 lg:flex-row w-full">
               <div className="flex items-center w-full lg:w-1/2 max-w-xl border-[2px] border-white text-white font-bold text-size-4">
                  <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'merchant' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('merchant')}>Merchant</div>
                  <div className={`md:w-1/2 w-full flex items-center justify-center whitespace-nowrap py-4 font-medium text-size-2 h-full cursor-pointer ${activeTab === 'app-web' ? 'bg-white text-darkone' : 'text-white'}`} onClick={() => handleTabChange('app-web')}>App & Web</div>
               </div>
               {activeTabTwo == 'games' && (
                  <button type="button" onClick={() => openCreatePopup('games')} className="flex items-center border gap-3 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto">
                     <FontAwesomeIcon size="lg" icon={faPlus} />
                     <div className="capitalize font-medium text-size-2">Add New Game</div>
                  </button>
               )}
               {activeTabTwo == 'products' && (
                  <button type="button" onClick={() => openCreatePopup('products')} className="flex items-center border gap-3 lg:border-[3px] border-white lg:rounded-xl py-4 px-5 text-white w-full lg:w-fit ml-auto">
                     <FontAwesomeIcon size="lg" icon={faPlus} />
                     <div className="capitalize font-medium text-size-2">Add New Product</div>
                  </button>
               )}
            </div>
            <div className="flex items-center w-full gap-12 text-white font-bold text-size-4 mt-12">
               <div className={`cursor-pointer ${activeTabTwo === 'games' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('games')}>Raffle Games</div>
               <div className={`cursor-pointer ${activeTabTwo === 'products' ? 'underline' : ''}`} onClick={() => handleTabTwoChange('products')}>Raffle Products</div>
            </div>
            <div className="flex flex-col mt-6">

               {
                  //activeTabTwo == 'games' && (
                  <>
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                           {
                              activeTabTwo == 'games' ? (
                                 <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-bl rounded-tl">Game</th>
                              )
                              :
                              (
                                 <>
                                 <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-bl rounded-tl">Prize</th>
                                 </>
                              )
                           }
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product</th> 
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Image</th>
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Starting Price</th>
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Status</th>
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th>
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">

                        {
                           products.map((product: any) => (
                           <tr key={product._id}>
                              {
                              activeTabTwo == 'games' ? (
                                 <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{product.gameInProduct.length > 0 ? product.gameInProduct[0].name : ''}</td>
                              ) : (
                                 <>
                                 <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{product.prizeInProduct.length > 0 ? product.prizeInProduct[0].name : ''}<img className="max-w-[60px] mx-auto" src={product.prizeInProduct.length > 0 ? product.prizeInProduct[0].image : ''} alt="No Image Found" /></td>
                                 </>
                              )}

                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{product.name}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-left">
                                 <img className="max-w-[60px] mx-auto" src={product.image} alt="" />
                              </td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">AED {product.price}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{product.status}</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">{formatDate(product.date)}</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => openEditPopup(product._id)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faPencil} />
                                    </button>
                                    <div className="flex items-center gap-2 lg:gap-3 px-2 border-[2px] border-white rounded py-2">
                                       <div className="w-[25px] h-[16px] lg:w-[30px] lg:h-[17px] relative rounded-xl border border-white flex items-center justify-center cursor-pointer" onClick={() => changeStatus(product._id)}>
                                          <div className={`bg-white w-[5px] h-[5px] lg:w-[10px] lg:h-[10px] rounded-full transform transition-all duration-500 ease-in-out ${product.status === 'Active' ? 'translate-x-[-5px] lg:translate-x-[-6px]' : 'translate-x-[5px] lg:translate-x-[7px]'}`}></div>
                                       </div>
                                    </div>
                                    <button type="button" onClick={() => setIdAndOpenDeletePopup(product._id)} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faTrashAlt} />
                                    </button>
                                 </div>
                              </td>
                           </tr>

                           ))
                        }



                        </tbody>
                     </table>
                     <div className="font-poppins-medium mt-6 ml-auto text-size-2 bg-light-background-three backdrop-blur-64 flex flex-row w-fit border-[2px] border-white rounded text-white divide-x divide-white">


                     {
                        pages.length > 0 &&
                        <div className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(currentPage - 1)}>
                           <FontAwesomeIcon size="1x" icon={faChevronLeft} />
                        </div>
                     }

                     {
                        pages.map((page: any) => (
                           show_pages.includes(page) && (
                              page === currentPage ?
                              <div key={page} className="px-4 py-2 text-black bg-white flex items-center justify-center cursor-pointer" onClick={() => setPagination(page)}>{page}</div>
                              :
                              <div key={page} className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(page)}>{page}</div>
                           ) 
                     ))}

                     {
                        pages.length > 0 &&
                        <div className="px-4 py-2 flex items-center justify-center cursor-pointer" onClick={() => setPagination(currentPage + 1)}>
                           <FontAwesomeIcon size="1x" icon={faChevronRight} />
                        </div>
                     }


                     </div>
                  </>
               //)
               }
               
               {/*activeTabTwo == 'products' && (
                  <>
                     <table className="w-full">
                        <thead>
                           <tr className="bg-white">
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-bl rounded-tl">ID</th>
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product</th> 
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Product Image</th>
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Prize</th>
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Prize Image</th>
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Price</th>
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Status</th>
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone">Date</th>
                              <th scope="col" className="w-[14%] py-5 text-sm lg:text-size-1 whitespace-nowrap font-medium text-center text-darkone rounded-tr rounded-br">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-lightthree bg-light-background-three backdrop-blur-64">
                           <tr>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">123</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">pen</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-left">
                                 <img className="max-w-[60px] mx-auto" src="/assets/images/cap.svg" alt="" />
                              </td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">iPhone</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">
                                 <img className="max-w-[60px] mx-auto" src="/assets/images/cap.svg" alt="" />
                              </td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">AED 1234</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">Active</td>
                              <td className="whitespace-nowrap lg:py-5 text-sm lg:text-size-1 text-white text-center">12 Aug, 2024</td>
                              <td>
                                 <div className="flex items-center justify-center gap-2">
                                    <button type="button" onClick={() => handleProductActionClick()} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faPencil} />
                                    </button>
                                    <div className="flex items-center gap-2 lg:gap-3 px-2 border-[2px] border-white rounded py-2">
                                       <div className="w-[25px] h-[16px] lg:w-[30px] lg:h-[17px] relative rounded-xl border border-white flex items-center justify-center cursor-pointer" onClick={handleToggle}>
                                          <div className={`bg-white w-[5px] h-[5px] lg:w-[10px] lg:h-[10px] rounded-full transform transition-all duration-500 ease-in-out ${toggled ? 'translate-x-[-5px] lg:translate-x-[-6px]' : 'translate-x-[5px] lg:translate-x-[7px]'}`}></div>
                                       </div>
                                    </div>
                                    <button type="button" onClick={() => handleDelete()} className="text-white flex items-center justify-center px-3 border-[2px] border-white rounded py-2">
                                       <FontAwesomeIcon size="lg" icon={faTrashAlt} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                     <div className="font-poppins-medium mt-6 ml-auto text-size-2 bg-light-background-three backdrop-blur-64 flex flex-row w-fit border-[2px] border-white rounded text-white divide-x divide-white">
                        <div className="px-4 py-2 flex items-center justify-center cursor-pointer">
                           <FontAwesomeIcon size="1x" icon={faChevronLeft} />
                        </div>
                        <div className="px-4 py-2 flex items-center justify-center cursor-pointer">1</div>
                        <div className="px-4 py-2 text-black bg-white flex items-center justify-center cursor-pointer">2</div>
                        <div className="px-4 py-2 flex items-center justify-center cursor-pointer">3</div>
                        <div className="px-4 py-2 flex items-center justify-center cursor-pointer">
                           <FontAwesomeIcon size="1x" icon={faChevronRight} />
                        </div>
                     </div>
                  </>
               )*/}

            </div>
         </div>
         <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">Add New Game</div>
                  <div onClick={() => setModalIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                     <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Game Name </div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder="Enter Game name"
                           value={form.game_name}
                           onChange={(e) => updateForm({ game_name: e.target.value })} />
                        </div>

                        {
                           form.game_name_error !== '' && (
                              <span style={{color: "red"}}>{form.game_name_error}</span>
                           )
                        }

                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Game Type</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full"
                           value={form.game_type}
                           onChange={(e) => updateForm({ game_type: e.target.value })} >
                              <option value="">Select Game Type</option>
                              <option value="Straight">Straight</option>
                              <option value="Rumble">Rumble</option>
                              <option value="Chance">Chance</option>
                           </select>
                        </div>

                        {
                           form.game_type_error !== '' && (
                              <span style={{color: "red"}}>{form.game_type_error}</span>
                           )
                        }

                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Description</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text"
                        value={form.game_description}
                        onChange={(e) => updateForm({ game_description: e.target.value })} />
                     </div>

                     {
                        form.game_description_error !== '' && (
                           <span style={{color: "red"}}>{form.game_description_error}</span>
                        )
                     }

                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                     <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Product Name</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder="Enter product Name"
                           value={form.product_name}
                           onChange={(e) => updateForm({ product_name: e.target.value })} />
                        </div>

                        {
                           form.product_name_error !== '' && (
                              <span style={{color: "red"}}>{form.product_name_error}</span>
                           )
                        }
                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Product Image</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">

                           <div className="relative">
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
                                 <FontAwesomeIcon icon={faImage} size="1x" />
                              </div>
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="file"
                              onChange={handleChangeProductFile} />
                           </div>

                           {
                              form.product_image_error !== '' && (
                                 <span style={{color: "red"}}>{form.product_image_error}</span>
                              )
                           }

                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="text-darkone text-size-4">Starting Price</div>
                     <div className="text-darkone text-size-2 border border-lightone rounded">
                        <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" min="1" type="number"
                        value={form.product_price}
                        onChange={(e) => updateForm({ product_price: e.target.value })} />
                     </div>

                     {
                        form.product_price_error !== '' && (
                           <span style={{color: "red"}}>{form.product_price_error}</span>
                        )
                     }
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                     <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Status</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full"
                           value={form.product_status}
                           onChange={(e) => updateForm({ product_status: e.target.value })}>
                              <option value="">Select Product Status</option>
                              <option value="Active">Active</option>
                              <option value="Upcoming">Upcoming</option>
                           </select>
                        </div>

                        {
                           form.product_status_error !== '' && (
                              <span style={{color: "red"}}>{form.product_status_error}</span>
                           )
                        }
                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="text-darkone text-size-4">Date</div>
                        <div className="text-darkone text-size-2 border border-lightone rounded">
                           <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="date" placeholder=""
                           value={form.product_date}
                           onChange={(e) => updateForm({ product_date: e.target.value })} />
                        </div>

                        {
                           form.product_date_error !== '' && (
                              <span style={{color: "red"}}>{form.product_date_error}</span>
                           )
                        }
                     </div>
                  </div>
                  <div className="flex items-center ml-auto gap-6">
                     <button onClick={() => setModalIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                     <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={onSubmit}>Save</button>
                  </div>
               </div>
            </div>
         </Modal>
         
         <Modal open={modalThreeIsOpen} onClose={() => setModalThreeIsOpen(false)}>
            <div className="flex flex-col justify-center gap-12 px-12 py-6 w-full lg:min-w-[800px]">
               <div className="flex items-center justify-between w-full">
                  <div className="text-darkone text-head-2">Add New Product</div>
                  <div onClick={() => setModalThreeIsOpen(false)} className="cursor-pointer bg-lighttwo w-[35px] h-[35px] rounded-full flex items-center justify-center">
                     <FontAwesomeIcon size="lg" icon={faTimes} className="text-gray-500" />
                  </div>
               </div>
               <div className="flex flex-col gap-10">
                  <div className="flex flex-col gap-3">
                     <h2 className="text-head-1 text-darkone">Product Details</h2>
                     <div className="bg-lightsix border border-lightone rounded-lg px-6 py-6 flex flex-col gap-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                           <div className="flex flex-col gap-2">
                              <div className="text-darkone text-size-4">Name</div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder="Enter Product Name"
                                 value={form.product_name}
                                 onChange={(e) => updateForm({ product_name: e.target.value })} />
                              </div>

                              {
                                 form.product_name_error !== '' && (
                                    <span style={{color: "red"}}>{form.product_name_error}</span>
                                 )
                              }
                           </div>
                           <div className="flex flex-col gap-2">
                              <div className="text-darkone text-size-4">Product Image</div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <div className="relative">
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
                                       <FontAwesomeIcon icon={faImage} size="1x" />
                                    </div>
                                    <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="file"
                                    onChange={handleChangeProductFile} />
                                 </div>

                                 {
                                    form.prize_image_error !== '' && (
                                       <span style={{color: "red"}}>{form.prize_image_error}</span>
                                    )
                                 }

                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col gap-2">
                           <div className="text-darkone text-size-4">Description</div>
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text"
                              value={form.product_description}
                              onChange={(e) => updateForm({ product_description: e.target.value })} />
                           </div>

                           {
                              form.product_description_error !== '' && (
                                 <span style={{color: "red"}}>{form.product_description_error}</span>
                              )
                           }

                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                           <div className="flex flex-col gap-2">
                              <div className="text-darkone text-size-4">Status</div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <select className="h-[40px] bg-transparent border-0 focus:outline-none focus:ring-0 w-full"
                                 value={form.product_status}
                                 onChange={(e) => updateForm({ product_status: e.target.value })}>
                                    <option value="">Select Prosuct Status</option>
                                    <option value="Active">Active</option>
                                    <option value="In Progress">In Progress</option>
                                 </select>
                              </div>

                              {
                                 form.product_status_error !== '' && (
                                    <span style={{color: "red"}}>{form.product_status_error}</span>
                                 )
                              }

                           </div>
                           <div className="flex flex-col gap-2">
                              <div className="text-darkone text-size-4">Date</div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="date"
                                 value={form.product_date}
                                 onChange={(e) => updateForm({ product_date: e.target.value })} />
                              </div>

                              {
                                 form.product_date_error !== '' && (
                                    <span style={{color: "red"}}>{form.product_date_error}</span>
                                 )
                              }
                           </div>

                           <div className="flex flex-col gap-2">
                              <div className="text-darkone text-size-4">Price</div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="number"
                                 value={form.product_price}
                                 onChange={(e) => updateForm({ product_price: e.target.value })} />
                              </div>

                              {
                                 form.product_price_error !== '' && (
                                    <span style={{color: "red"}}>{form.product_price_error}</span>
                                 )
                              }
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col gap-3">
                     <h2 className="text-head-1 text-darkone">Prize Details</h2>
                     <div className="bg-lightsix border border-lightone rounded-lg px-6 py-6 flex flex-col gap-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                           <div className="flex flex-col gap-2">
                              <div className="text-darkone text-size-4">Name</div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="text" placeholder="Enter Prize Name"
                                 value={form.prize_name}
                                 onChange={(e) => updateForm({ prize_name: e.target.value })} />
                              </div>

                              {
                                 form.prize_name_error !== '' && (
                                    <span style={{color: "red"}}>{form.prize_name_error}</span>
                                 )
                              }

                           </div>
                           <div className="flex flex-col gap-2">
                              <div className="text-darkone text-size-4">Prize Image</div>
                              <div className="text-darkone text-size-2 border border-lightone rounded">
                                 <div className="relative">
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
                                       <FontAwesomeIcon icon={faImage} size="1x" />
                                    </div>
                                    <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="file"
                                    onChange={handleChangePrizeFile} />
                                 </div>
                              </div>
                           </div>

                           <div className="flex flex-col gap-2">
                           <div className="text-darkone text-size-4">Price</div>
                           <div className="text-darkone text-size-2 border border-lightone rounded">
                              <input className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]" type="number"
                              value={form.prize_price}
                              onChange={(e) => updateForm({ prize_price: e.target.value })} />
                           </div>

                           {
                              form.prize_price_error !== '' && (
                                 <span style={{color: "red"}}>{form.prize_price_error}</span>
                              )
                           }

                        </div>

                        </div>
                        <div className="flex flex-col gap-4">
                           <div className="text-darkone text-size-4">Details</div>
                           <div className="flex flex-col gap-4">
                           {productDetails.map((row, index) => (
                              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                 <div className="flex flex-col gap-2">
                                    <div className="text-darkone text-size-2 border border-lightone rounded">
                                    <input
                                       className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                                       type="text"
                                       placeholder={'Key'}
                                       value={row.key}
                                       onChange={(e) =>
                                          setProductDetails(
                                          productDetails.map((r, i) =>
                                             i === index ? { ...r, key: e.target.value } : r
                                          )
                                          )
                                       }
                                    />
                                    </div>
                                 </div>
                                 <div className="flex flex-col gap-2">
                                    <div className="text-darkone text-size-2 border border-lightone rounded">
                                    <div className="relative">
                                       {index != 0 && (
                                          <div onClick={() => handleDeleteRow(index)} className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
                                             <FontAwesomeIcon icon={faTimes} size="1x" />
                                          </div>
                                       )}
                                       <input
                                          className="bg-transparent text-darkone ml-1 border-0 focus:outline-none focus:ring-0 w-full h-[40px]"
                                          type="text"
                                          placeholder={'Value'}
                                          value={row.value}
                                          onChange={(e) =>
                                          setProductDetails(
                                             productDetails.map((r, i) =>
                                                i === index ? { ...r, value: e.target.value } : r
                                             )
                                          )
                                          }
                                       />
                                    </div>
                                    </div>
                                 </div>
                              </div>
                              ))}
                           </div>
                           <div onClick={handleAddDetails} className="ml-auto">
                              <button className="relative inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-themeone bg-white text-themeone hover:border-themetwo hover:text-themetwo focus:outline-none focus:ring-0">
                                 <FontAwesomeIcon icon={faPlus} size="lg" />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center ml-auto gap-6">
                     <button onClick={() => setModalThreeIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-6 py-3 bg-white border border-lightfive w-fit rounded">Cancel</button>
                     <button className="text-white text-head-1 font-medium text-center px-8 py-3 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={onSubmit}>Save</button>
                  </div>
               </div>
            </div>
         </Modal>
         
         <Modal open={modalTwoIsOpen} onClose={() => setModalTwoIsOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-4 px-12 py-6 w-full lg:min-w-[500px]">
               <div className="text-darkone font-medium text-head-3">Delete</div>
               <div className="text-darkone text-size-4">Are you sure you want to delete this record?</div>
               <div className="flex items-center gap-6 mt-3">
                  <button onClick={() => setModalTwoIsOpen(false)} className="text-lightfive text-head-1 font-medium text-center px-10 border-[2px] border-lightfive py-2 bg-white w-fit rounded">Cancel</button>
                  <button className="text-white text-head-1 font-medium text-center px-10 py-2 bg-gradient-to-r from-themeone to-themetwo w-fit rounded" onClick={deleteProduct}>Delete</button>
               </div>
            </div>
         </Modal>
      </section>
   )
}
