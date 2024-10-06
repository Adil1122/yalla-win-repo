import React from 'react'
import { faComment, faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function VideoCard() {
   return (
      <div className="flex items-center cursor-pointer justify-center rounded-standard shadow-custom-1 bg-lighttwo py-16 flex-1 w-full h-full flex-grow">
         <div className="relative">
            <FontAwesomeIcon className="text-blue-600" size="8x" icon={faComment} />
            <FontAwesomeIcon className="text-white absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" size="3x" icon={faPlay} />
         </div>
      </div>
   )
}
