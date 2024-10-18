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
      <section className="flex flex-row h-screen justify-end">
         <aside className="fixed z-10 left-0 top-0 h-full hidden bg-white lg:block lg:w-[30%] xl:w-[20%] overflow-y-auto">
            <UserSideBar />
         </aside>
         
         <main className="flex z-9 flex-col flex-grow lg:max-w-[70%] xl:max-w-[80%]">
            <UserTopBar />
            <div className="flex flex-grow flex-col">{children}</div>
         </main>
      </section>
   )
}
