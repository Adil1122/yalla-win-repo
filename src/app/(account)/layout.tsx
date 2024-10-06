import type { Metadata } from "next"
import UserTopBar from '@/components/dashboard/topbar'
import UserSideBar from '@/components/dashboard/sidebar'

export const metadata: Metadata = {
  title: "Yalla Draw",
  description: ""
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   
   return (
      <section className="flex flex-row h-full">
         <section className="fixed left-0 top-0 h-full hidden lg:block lg:w-[30%] xl:w-[20%]">
            <UserSideBar />
         </section>
         <main className="flex flex-col flex-grow lg:pl-[30%] xl:pl-[20%]">
            <UserTopBar />
            <div className="flex flex-grow flex-col">{children}</div>
         </main>
      </section>
   )
}
