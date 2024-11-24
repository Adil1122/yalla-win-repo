import React from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from 'react-share'

const SocialShare = ({ url, title }: { url: string; title: string }) => {
   return (
      <div className="flex space-x-4 w-fit mx-auto">
         <FacebookShareButton url={url}>
            <FacebookIcon size={40} round />
         </FacebookShareButton>

         <TwitterShareButton url={url} title={title}>
            <TwitterIcon size={40} round />
         </TwitterShareButton>

         <LinkedinShareButton url={url} title={title}>
            <LinkedinIcon size={40} round />
         </LinkedinShareButton>
      </div>
   )
}

export default SocialShare