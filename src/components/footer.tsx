import Link from "next/link"
import Image from "next/image"
import logoImg from '../../public/assets/images/logo-2.svg'
import fbIcon from '../../public/assets/images/fb-color.svg'
import xIcon from '../../public/assets/images/x-color.svg'
import instaIcon from '../../public/assets/images/insta-color.svg'
import tiktokIcon from '../../public/assets/images/tiktok-color.svg'
import linkedInIcon from '../../public/assets/images/linkedin-color.svg'
import whatsappIcon from '../../public/assets/images/whatsapp-color.svg'
import androidAppIcon from '../../public/assets/images/google-play-icon.svg'
import iosAppIcon from '../../public/assets/images/ios-app-icon.svg'
import visaIcon from '../../public/assets/images/visa-icon.svg'
import mastecardIcon from '../../public/assets/images/mastercard-icon.svg'

export default function Footer() {
   return (
      <section className="flex flex-col lg:flex-row items-center justify-between text-size-2 lg:text-size-3 font-inter gap-8 lg:gap-0">
         <div className="flex flex-col lg:flex-row items-center lg:w-[45%] w-full gap-2 lg:gap-0">
            <Link href="/" className="flex flex-col items-center">
               <Image alt="Dream draw logo" src={logoImg}></Image>
            </Link>
            <div className="flex flex-row items-center justify-between lg:justify-around lg:ml-20 flex-1 w-full">
               <div className="flex flex-col items-start gap-2">
                  <Link href="/about-us" className="">About</Link>
                  <Link href="/shop" className="">Shop</Link>
                  <Link href="/winners" className="">Winners</Link>
                  <Link href="/contact-us" className="">Contact Us</Link>
               </div>
               <div className="flex flex-col items-end lg:items-start gap-2">
                  <Link href="/faqs" className="">FAQs</Link>
                  <Link href="/legal-policy" className="">Legal</Link>
                  <Link href="/privacy-policy" className="">Privacy Policy</Link>
                  <Link href="/terms-and-conditions" className="">Terms and Conditions</Link>
               </div>
            </div>
         </div>
         <div className="flex flex-col lg:flex-row items-center justify-between w-full lg:w-[40%] gap-4 lg:gap-0">
            <div className="flex flex-col items-start gap-4">
               <div className="flex flex-row items-center gap-3">
                  <Link href="">
                     <Image alt="Dream draw icon" src={fbIcon}></Image>
                  </Link>
                  <Link href="">
                     <Image alt="Dream draw icon" src={xIcon}></Image>
                  </Link>
                  <Link href="">
                     <Image alt="Dream draw icon" src={tiktokIcon}></Image>
                  </Link>
                  <Link href="">
                     <Image alt="Dream draw icon" src={linkedInIcon}></Image>
                  </Link>
                  <Link href="">
                     <Image alt="Dream draw icon" src={instaIcon}></Image>
                  </Link>
                  <Link href="">
                     <Image alt="Dream draw icon" src={whatsappIcon}></Image>
                  </Link>
               </div>
               <div className="text-size-1">Download App for better experience</div>
               <div className="flex flex-row items-center gap-6">
                  <Link href="" className="flex items-center gap-2">
                     <Image alt="Dream draw logo" width={20} src={androidAppIcon}></Image>
                     <div>Google Play</div>
                  </Link>
                  <Link href="" className="flex items-center gap-2">
                     <Image alt="Dream draw logo" width={20} src={iosAppIcon}></Image>
                     <div>App Store</div>
                  </Link>
               </div>
            </div>
            <div className="flex flex-row lg:flex-col items-center gap-2">
               <Image alt="Dream draw icon" className="hidden lg:flex" width={90} src={visaIcon}></Image>
               <Image alt="Dream draw icon" className="hidden lg:flex" src={mastecardIcon}></Image>
               <Image alt="Dream draw icon" className="lg:hidden" width={80} src={visaIcon}></Image>
               <Image alt="Dream draw icon" className="lg:hidden" width={50} src={mastecardIcon}></Image>
            </div>
         </div>
      </section>
   )
}