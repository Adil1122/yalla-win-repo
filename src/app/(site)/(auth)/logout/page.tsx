'use client'

import { useRouter } from 'next/navigation';
import { useLayoutEffect } from "react";
export default function LogoutPage() {
    const router = useRouter();
    useLayoutEffect(() => {
        if(localStorage.getItem('yalla_logged_in_user') !== null) {
            localStorage.removeItem('yalla_logged_in_user');
            router.push('/');
        } else {
            router.push('/');
        }
    }, []);
    return (<h1>Logout Page</h1>)
}