'use client';

import { useState } from 'react';
import Image from 'next/image';
import Notification from '@/components/notificationWidget';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import signUpImg from '@/../public/assets/images/signup.png';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage({ params } : {params: { token: string; }}) {

  const router = useRouter(); // Add this line to use the router
  const [form, setForm] = useState({
    new_password: '',
    confirm_password: '',
    user_id: params.token,
    password_error: '',
    confirm_password_error: '',
    server_error: '',
    server_success: '',
  });

  function updateForm(value: any) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  const validateForm = () => {
    let valid = true;
    let password_error = '';
    let confirm_password_error = '';

    if (!form.new_password) {
      password_error = 'New Password is required.';
      valid = false;
    }

    if (form.new_password !== form.confirm_password) {
      confirm_password_error = 'Passwords do not match.';
      valid = false;
    }

    updateForm({
      password_error,
      confirm_password_error,
    });

    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch('/api/website/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: form.new_password,
          user_id: form.user_id
        }),
      });

      const data = await res.json();

      if (res.ok) {
        updateForm({
          server_success: 'Password reset successful!',
          server_error: '',
        });
        // Redirect to login page
        setTimeout(() => {
          router.push('/login');
        }, 2000); // Wait for 2 seconds to show the success message before redirecting
      } else {
        updateForm({
          server_error: data.message || 'Failed to reset password.',
          server_success: '',
        });
      }
    } catch (error) {
      updateForm({
        server_error: 'Something went wrong. Please try again.',
        server_success: '',
      });
    }
  };

  return (
    <div className="flex flex-row flex-grow h-full w-full bg-gradient-to-r shadow-custom-1 from-themeone to-themetwo px-8 md:px-12 py-12 md:py-36 gap-6 font-inter-regular">
      <div className="relative flex flex-col w-full md:w-[55%] md:gap-6 gap-3 md:text-size-4 text-size-2">
        {/* New Password Field */}
        <div className="flex flex-col gap-3">
          <label htmlFor="new-password" className="text-theme-topo-1 flex items-end gap-2 ml-2">
            <span className="font-medium text-white">New Password</span>
          </label>
          <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
            <input
              id="new-password"
              name="new_password"
              className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
              type="password"
              placeholder="New Password"
              value={form.new_password}
              onChange={(e) => updateForm({ new_password: e.target.value })}
            />
            {form.password_error && (
              <>
                <span
                  title="This field is required"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                >
                  <ExclamationCircleIcon className="size-6 lg:size-10" />
                </span>
                <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                  {form.password_error}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-3">
          <label htmlFor="confirm-password" className="text-theme-topo-1 flex items-end gap-2 ml-2">
            <span className="font-medium text-white">Confirm Password</span>
          </label>
          <div className="bg-white rounded-lg px-5 py-4 shadow-custom-1 relative flex">
            <input
              id="confirm-password"
              name="confirm_password"
              className="w-full border-none placeholder:font-normal bg-transparent text-theme-topo-1 font-semibold outline-none focus:outline-none focus:ring-0"
              type="password"
              placeholder="Confirm Password"
              value={form.confirm_password}
              onChange={(e) => updateForm({ confirm_password: e.target.value })}
            />
            {form.confirm_password_error && (
              <>
                <span
                  title="This field is required"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-600 ml-auto"
                >
                  <ExclamationCircleIcon className="size-6 lg:size-10" />
                </span>
                <span className="absolute right-4 bottom-1 text-small lg:text-size-2 text-red-600 ml-auto">
                  {form.confirm_password_error}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div
          className="text-center cursor-pointer text-themeone text-size-3 rounded-full shadow-custom-1 py-4 bg-white mt-12 font-semibold"
          onClick={handleSubmit}
        >
          Reset Password
        </div>
      </div>

      <div className="hidden md:block md:w-[45%]">
        <Image width={700} height={500} className="ml-auto" alt="user signup" src={signUpImg} />
      </div>

      {/* Notification */}
      {form.server_error !== '' && 
        <Notification message="Server Error" description={form.server_error} type="error"
        close={() => {setForm((prev: any) => ({ ...prev, server_error: '' }))}} />
      }
      {form.server_success !== '' && 
        <Notification message="Success" description={form.server_success} type="success"
        close={() => {setForm((prev: any) => ({ ...prev, server_success: '' }))}} />
      }
    </div>
  );
}
