import TeamMember from "@/components/about-team-member"

export default function AboutPage() {
   return (
      <section className="flex flex-col flex-grow h-full w-full bg-gradient-to-r from-themeone to-themetwo gap-8 lg:gap-12 py-8 lg:py-12 overflow-x-hidden px-8 lg:px-16">
         <div className="flex flex-col lg:flex-row gap-12">
            <div className="hidden lg:block lg:w-[40%]"></div>
            <h1 className="font-noto-sans lg:w-[60%] text-white text-big-three lg:text-big-five uppercase font-semibold text-center lg:text-left">About Us</h1>
         </div>
         <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-[40%]">
               <img className="lg:rounded-standard rounded-3xl" src="/assets/images/about-img.svg" alt="" />
            </div>
            <div className="flex flex-col text-white text-size-2 gap-8 leading-8 lg:w-[60%]">
               <p>
                  There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected 
                  humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be 
                  sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat 
                  predefined chunks as necessary
               </p>
               <div className="flex flex-col gap-4">
                  <h2 className="text-white text-big-two font-medium">Mission</h2>
                  <p>
                     There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected 
                     humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be 
                     sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat 
                     predefined chunks as necessary
                  </p>
               </div>
               <div className="flex flex-col gap-4">
                  <h2 className="text-white text-big-two font-medium">Vision</h2>
                  <p>
                     There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected 
                     humour, or randomised words which dont look even slightly believable
                  </p>
               </div>
               <div className="flex flex-col gap-4">
                  <h2 className="text-white text-big-two font-medium">Contact Us</h2>
                  <div className="flex flex-col">
                     <p>We are happy to hear from you. Reach out to us with any questions and concerns</p>
                     <p>Tel No: +971 4 397 4070</p>
                     <p>Toll-Free: 800 - DREAMDRAW (373263729)</p>
                     <p>customer-support@dreamdraw.ae</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}