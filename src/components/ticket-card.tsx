import React, { useContext, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShuffle } from '@fortawesome/free-solid-svg-icons';

interface TicketCardProps {
   gameName: string;
   productPrice: Number,
   quantity: Number,
   s_no: Number
 }
 
 const TicketCard: React.FC<TicketCardProps> = ({ gameName, productPrice, quantity, s_no }) => {

   const gameTypes = [
      {id: "1", title: 'Straight', value: 'straight'},
      {id: "2", title: 'Rumble', value: 'runble'},
      {id: "3", title: 'Chance', value: 'chance'},
   ];

   var yalla_3_ref_0: any = useRef()
   var yalla_3_ref_1: any = useRef()
   var yalla_3_ref_2: any = useRef()

   var yalla_4_ref_0: any = useRef()
   var yalla_4_ref_1: any = useRef()
   var yalla_4_ref_2: any = useRef()
   var yalla_4_ref_3: any = useRef()

   var yalla_6_ref_0: any = useRef()
   var yalla_6_ref_1: any = useRef()
   var yalla_6_ref_2: any = useRef()
   var yalla_6_ref_3: any = useRef()
   var yalla_6_ref_4: any = useRef()
   var yalla_6_ref_5: any = useRef()

   var [localStorageJson, setLocalStorageJson] = useState({
      ticket_number: '',
         ticket_number_splitted: []
   });

   var [gameType, setGameType] = useState('');

   const generateRandom: any = (min: any, max: any, excluding: any, iteration: any) => {
      var num = Math.floor(Math.random() * (max - min + 1)) + min;

      
      if(iteration === 6) {
         console.log('num: ', num)
         
         return (excluding.includes(num) || hasDuplicates(excluding)) ? generateRandom(min, max, excluding) : num;
      }
      return num;
  }
  
  function hasDuplicates(array: any) {
      var valuesSoFar = [];
      for (var i = 0; i < array.length; ++i) {
         var value = array[i];
         if (valuesSoFar.indexOf(value) !== -1) {
            return true;
         }
         valuesSoFar.push(value);
      }
      return false;
   }

   const quickPick = () => {

      var min = 0;
      var max = 9;
      var iteration = 3;
      var ticket_number = '';
      if(gameName === 'Yalla 3') {
         iteration = 3;
      } else if(gameName === 'Yalla 4') {
         iteration = 4;
      } else if(gameName === 'Yalla 6') {
         iteration = 6;
         min = 1; 
         max = 25;
      }


      var splitted_numbers:any = [];
      var generated_numbers: any = [];
      for(var i = 0; i < iteration; i++) {
         var single_number = generateRandom(min, max, generated_numbers, iteration);
         generated_numbers.push(single_number);
         if(i === 5 && hasDuplicates(generated_numbers)) {
            single_number = generateRandom(min, max, generated_numbers, iteration);
         }
         ticket_number = ticket_number + single_number;
         splitted_numbers.push(single_number < 10 ? '0' + single_number : '' + single_number);
      }

      var localStorageJsonVal = ({
         ticket_number: ticket_number,
         ticket_number_splitted: splitted_numbers
      });
      localStorage.setItem('ticket_number_' + s_no, JSON.stringify(localStorageJsonVal));
      var localStorageJson = JSON.parse(localStorage.getItem('ticket_number_' + s_no) + '');

      if(gameName === 'Yalla 3') {
         yalla_3_ref_0.current.value = localStorageJson.ticket_number_splitted[0];
         yalla_3_ref_1.current.value = localStorageJson.ticket_number_splitted[1];
         yalla_3_ref_2.current.value = localStorageJson.ticket_number_splitted[2];
      }

      if(gameName === 'Yalla 4') {
         yalla_4_ref_0.current.value = localStorageJson.ticket_number_splitted[0];
         yalla_4_ref_1.current.value = localStorageJson.ticket_number_splitted[1];
         yalla_4_ref_2.current.value = localStorageJson.ticket_number_splitted[2];
         yalla_4_ref_3.current.value = localStorageJson.ticket_number_splitted[3];
      }

      if(gameName === 'Yalla 6') {
         yalla_6_ref_0.current.value = localStorageJson.ticket_number_splitted[0];
         yalla_6_ref_1.current.value = localStorageJson.ticket_number_splitted[1];
         yalla_6_ref_2.current.value = localStorageJson.ticket_number_splitted[2];
         yalla_6_ref_3.current.value = localStorageJson.ticket_number_splitted[3];
         yalla_6_ref_4.current.value = localStorageJson.ticket_number_splitted[4];
         yalla_6_ref_5.current.value = localStorageJson.ticket_number_splitted[5];
      }

      setLocalStorageJson(localStorageJson)

   }

   const changeGameType = (title: any) => {
      localStorage.setItem('game_type_' + s_no, title);
      setGameType(localStorage.getItem('game_type_' + s_no) + '');
   }

   localStorage.setItem(`save_fav_${s_no}`, "0");

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      localStorage.setItem(`save_fav_${s_no}`, checked ? "1" : "0");
   }

   const validateTicketNumber = (e: any, game_name: any, index: any) => {
      console.log(e.target.value)
      console.log(game_name)
      console.log(index)
      var input_value = parseInt(e.target.value);
      if((game_name === 'Yalla 3' || game_name === 'Yalla 4') && (isNaN(input_value) || (!isNaN(input_value) && input_value > 9))) {

         if(game_name === 'Yalla 3') {
            if(index === 0) {
               yalla_3_ref_0.current.value = '';
            } else if(index === 1) {
               yalla_3_ref_1.current.value = '';
            } else if(index === 2) {
               yalla_3_ref_2.current.value = '';
            }
         }

         if(game_name === 'Yalla 4') {
            if(index === 0) {
               yalla_4_ref_0.current.value = '';
            } else if(index === 1) {
               yalla_4_ref_1.current.value = '';
            } else if(index === 2) {
               yalla_4_ref_2.current.value = '';
            } else if(index === 3) {
               yalla_4_ref_3.current.value = '';
            }
         }
      
      }

      if(game_name === 'Yalla 6' && (isNaN(input_value) || (!isNaN(input_value) && (input_value > 25 || input_value < 1)))) {

         if(index === 0) {
            yalla_6_ref_0.current.value = '';
         } else if(index === 1) {
            yalla_6_ref_1.current.value = '';
         } else if(index === 2) {
            yalla_6_ref_2.current.value = '';
         } else if(index === 3) {
            yalla_6_ref_3.current.value = '';
         } else if(index === 4) {
            yalla_6_ref_4.current.value = '';
         } else if(index === 5) {
            yalla_6_ref_5.current.value = '';
         }

      }

      if(game_name === 'Yalla 3') {

         var yalla_3_int_0: any = isNaN(parseInt(yalla_3_ref_0.current.value)) ? '' : parseInt(yalla_3_ref_0.current.value) + '';
         var yalla_3_int_1: any = isNaN(parseInt(yalla_3_ref_1.current.value)) ? '' : parseInt(yalla_3_ref_1.current.value) + '';
         var yalla_3_int_2: any = isNaN(parseInt(yalla_3_ref_2.current.value)) ? '' : parseInt(yalla_3_ref_2.current.value) + '';

         var ticket_number = yalla_3_int_0 + yalla_3_int_1 + yalla_3_int_2;
         var ticket_number_splitted = [
            isNaN(parseInt(yalla_3_int_0)) ? '' : '0' + yalla_3_int_0, 
            isNaN(parseInt(yalla_3_int_1)) ? '' : '0' + yalla_3_int_1,
            isNaN(parseInt(yalla_3_int_2)) ? '' : '0' + yalla_3_int_2
         ];

         var localStorageJsonVal = ({
            ticket_number: ticket_number, 
            ticket_number_splitted: ticket_number_splitted
         });
         localStorage.setItem('ticket_number_' + s_no, JSON.stringify(localStorageJsonVal));
      }

      if(game_name === 'Yalla 4') {

         var yalla_4_int_0 = isNaN(parseInt(yalla_4_ref_0.current.value)) ? '' : parseInt(yalla_4_ref_0.current.value) + '';
         var yalla_4_int_1 = isNaN(parseInt(yalla_4_ref_1.current.value)) ? '' : parseInt(yalla_4_ref_1.current.value) + '';
         var yalla_4_int_2 = isNaN(parseInt(yalla_4_ref_2.current.value)) ? '' : parseInt(yalla_4_ref_2.current.value) + '';
         var yalla_4_int_3 = isNaN(parseInt(yalla_4_ref_3.current.value)) ? '' : parseInt(yalla_4_ref_3.current.value) + '';

         var ticket_number: any = yalla_4_int_0 + yalla_4_int_1 + yalla_4_int_2 + yalla_4_int_3;
         var ticket_number_splitted = [
            isNaN(parseInt(yalla_4_int_0)) ? '' : '0' + yalla_4_int_0, 
            isNaN(parseInt(yalla_4_int_1)) ? '' : '0' + yalla_4_int_1,
            isNaN(parseInt(yalla_4_int_2)) ? '' : '0' + yalla_4_int_2, 
            isNaN(parseInt(yalla_4_int_3)) ? '' : '0' + yalla_4_int_3
         ];

         var localStorageJsonVal = ({
            ticket_number: ticket_number, 
            ticket_number_splitted: ticket_number_splitted
         });
         localStorage.setItem('ticket_number_' + s_no, JSON.stringify(localStorageJsonVal));

      }

      if(game_name === 'Yalla 6') {

         var yalla_6_int_0 = isNaN(parseInt(yalla_6_ref_0.current.value)) ? '' : parseInt(yalla_6_ref_0.current.value) + '';
         var yalla_6_int_1 = isNaN(parseInt(yalla_6_ref_1.current.value)) ? '' : parseInt(yalla_6_ref_1.current.value) + '';
         var yalla_6_int_2 = isNaN(parseInt(yalla_6_ref_2.current.value)) ? '' : parseInt(yalla_6_ref_2.current.value) + '';
         var yalla_6_int_3 = isNaN(parseInt(yalla_6_ref_3.current.value)) ? '' : parseInt(yalla_6_ref_3.current.value) + '';
         var yalla_6_int_4 = isNaN(parseInt(yalla_6_ref_4.current.value)) ? '' : parseInt(yalla_6_ref_4.current.value) + '';
         var yalla_6_int_5 = isNaN(parseInt(yalla_6_ref_5.current.value)) ? '' : parseInt(yalla_6_ref_5.current.value) + '';

         var ticket_number: any = yalla_6_int_0 + yalla_6_int_1 + yalla_6_int_2 + yalla_6_int_3 + yalla_6_int_4 + yalla_6_int_5;
         var ticket_number_splitted = [
            isNaN(parseInt(yalla_6_int_0)) ? '' : (parseInt(yalla_6_int_0) > 9 ? yalla_6_int_0 : '0' + yalla_6_int_0), 
            isNaN(parseInt(yalla_6_int_1)) ? '' : (parseInt(yalla_6_int_1) > 9 ? yalla_6_int_1 : '0' + yalla_6_int_1), 
            isNaN(parseInt(yalla_6_int_2)) ? '' : (parseInt(yalla_6_int_2) > 9 ? yalla_6_int_2 : '0' + yalla_6_int_2), 
            isNaN(parseInt(yalla_6_int_3)) ? '' : (parseInt(yalla_6_int_3) > 9 ? yalla_6_int_3 : '0' + yalla_6_int_3), 
            isNaN(parseInt(yalla_6_int_4)) ? '' : (parseInt(yalla_6_int_4) > 9 ? yalla_6_int_4 : '0' + yalla_6_int_4), 
            isNaN(parseInt(yalla_6_int_5)) ? '' : (parseInt(yalla_6_int_5) > 9 ? yalla_6_int_5 : '0' + yalla_6_int_5)
         ];

         var localStorageJsonVal = ({
            ticket_number: ticket_number, 
            ticket_number_splitted: ticket_number_splitted
         });
         localStorage.setItem('ticket_number_' + s_no, JSON.stringify(localStorageJsonVal));

      }
   }

   return (
      <div className="flex items-center justify-center">
         <div className="flex flex-col w-full max-w-xs mt-8 lg:mt-0 gap-6 lg:gap-4">
            <div className="flex flex-col gap-2 lg:gap-4">
               <div className="flex flex-row justify-between">
                  <div className="text-size-2 lg:text-size-3 font-bold">Ticket {s_no + ''}</div>
                  <div className="flex flex-row items-center gap-2">
                     <div className="text-size-2 lg:text-size-3">Quick pick:</div>
                     <button onClick={() => quickPick()}>
                        <FontAwesomeIcon size="1x" icon={faShuffle} />
                     </button>
                  </div>
               </div>
               <div className="flex flex-row items-center mx-auto gap-1 lg:gap-3">
                  {/* add these boxes as per game type. e.g yalla 3 has 3 boxes */}
                  {
                     gameName === 'Yalla 3' ? (
                        <React.Fragment>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_3_ref_0} onChange={(e) => validateTicketNumber(e, 'Yalla 3', 0)} />
                           </div>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_3_ref_1} onChange={(e) => validateTicketNumber(e, 'Yalla 3', 1)} />
                           </div>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_3_ref_2} onChange={(e) => validateTicketNumber(e, 'Yalla 3', 2)} />
                           </div>
                        </React.Fragment>
                     )
                     :
                     gameName === 'Yalla 4' ? (
                        <React.Fragment>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_4_ref_0} onChange={(e) => validateTicketNumber(e, 'Yalla 4', 0)} />
                           </div>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_4_ref_1} onChange={(e) => validateTicketNumber(e, 'Yalla 4', 1)} />
                           </div>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_4_ref_2} onChange={(e) => validateTicketNumber(e, 'Yalla 4', 2)} />
                           </div>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_4_ref_3} onChange={(e) => validateTicketNumber(e, 'Yalla 4', 3)} />
                           </div>
                        </React.Fragment>
                     )
                     :
                     gameName === 'Yalla 6' && (
                        <React.Fragment>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_6_ref_0} onChange={(e) => validateTicketNumber(e, 'Yalla 6', 0)} />
                           </div>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_6_ref_1} onChange={(e) => validateTicketNumber(e, 'Yalla 6', 1)} />
                           </div>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_6_ref_2} onChange={(e) => validateTicketNumber(e, 'Yalla 6', 2)} />
                           </div>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_6_ref_3} onChange={(e) => validateTicketNumber(e, 'Yalla 6', 3)} />
                           </div>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_6_ref_4} onChange={(e) => validateTicketNumber(e, 'Yalla 6', 4)} />
                           </div>
                           <div className="border border-black rounded-full w-[35px] lg:w-[40px] h-[35px] lg:h-[40px] flex items-center justify-center">
                              <input className="bg-transparent focus:outline-none focus:ring-0 border-none max-w-[37px] mx-auto" type="text" ref={yalla_6_ref_5} onChange={(e) => validateTicketNumber(e, 'Yalla 6', 5)} />
                           </div>
                        </React.Fragment>
                     )
                  }
                  
               </div>            
            </div>
            {/* show game type only for yalla 3 and yalla 4 games */}
            {
               (gameName === 'Yalla 3' || gameName === 'Yalla 4') && (
                  <div className="flex flex-col gap-2 lg:gap-4">
                     <div className="flex flex-row justify-between">
                        <div className="text-size-2 lg:text-size-3 font-bold">Game Type</div>
                     </div>
                     <div className="flex flex-row lg:items-center lg:mx-auto ml-4 lg:ml-auto">
                        <div className="sm:flex sm:items-center sm:space-x-5 sm:space-y-0">
                           {gameTypes.map((item) => (
                              <div key={"game-type-"+s_no+"_"+item.id} className="flex items-center">
                                 <input id={"game-type-"+s_no+"_"+item.id} value={item.value} name={"game-type-" + s_no} type="radio" className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" onClick={() => changeGameType(item.title)} />
                                 <label htmlFor={"game-type-"+s_no+"_"+item.id} className="ml-3 block text-size-1 lg:text-size-3 font-light leading-6 text-black">
                                    {item.title}
                                 </label>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )
            }

            <label htmlFor={`save_fav_${s_no}`} className="flex items-center gap-2 mt-4">
               <input id={`save_fav_${s_no}`} type="checkbox" name={`save_fav_${s_no}`} value="1" className="h-5 w-5" onChange={handleChange} />
               <span className="text-size-1 lg:text-size-3 font-light leading-6 text-black">Save as Favourite</span>
            </label>
            
         </div>
      </div>
   )
}

export default TicketCard;
