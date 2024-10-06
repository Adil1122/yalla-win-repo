"use client";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Notification from '@/components/notificationWidget';

// Define TypeScript interface for user data
interface User {
  first_name: string;
  last_name: string;
  email: string;
  dateOfBirth: string;
  shippingAddress: string;
  residentialAddress: string;
  city: string;
  state: string;
  country: string;
  mobile: string;
  area:string;
  image: string;
}




// Define TypeScript interface for errors
interface Errors {
  [key: string]: string;
}

export default function UserProfile() {
  // Initialize user state with default empty values and specify type as User
  const [image, setImage] = useState<File | undefined>();
  const [chosenFileName, setChosenFileName] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const inputFileRef: any = useRef();

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    dateOfBirth: "",
    shippingAddress: "",
    residentialAddress: "",
    city: "",
    state: "",
    country: "",
    mobile: "",
    image: "",
    area: "",

    first_name_error: "",
    last_name_error: "",
    email_error: "",
    password_error: "",
    password_confirm_error: "",
    country_code_error: "",
    mobile_error: "",
    image_error: "",
    dateOfBirth_error: "",
    shippingAddress_error: "",
    residentialAddress_error: "",
    state_error: "",
    country_error: "",
    city_error: "",
    area_error: "",
    server_error: "",
    server_success: ""
  
  });

  // Specify the type of errors as Errors
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("yalla_logged_in_user") + '');

      if (!storedUser) {
        router.push("/login");
        return;
      }

      const userData: any = {
        first_name: storedUser.first_name || "",
        last_name: storedUser.last_name || "",
        email: storedUser.email || "",
        dateOfBirth: storedUser.dateOfBirth || "",
        shippingAddress: storedUser.shippingAddress || "",
        residentialAddress: storedUser.residentialAddress || "",
        city: storedUser.city || "",
        state: storedUser.state || "",
        area: storedUser.area || "",
        country: storedUser.country || "",
        mobile: storedUser.mobile || "",
        image: storedUser.image || "",
      };

      setUser(userData);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      router.push("/login");
    }
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  }

  const onBtnClick = () => {
    /*Collecting node-element and performing click*/
    inputFileRef.current.click();
  };

  function validateForm() {
    var err = {
      first_name_error: "",
      last_name_error: "",
      email_error: "",
      password_error: "",
      password_confirm_error: "",
      country_code_error: "",
      mobile_error: "",
      image_error: "",
      dateOfBirth_error: "",
      shippingAddress_error: "",
      residentialAddress_error: "",
      country_error: "",
      city_error: "",
      state_error: "",
      area_error: "",
   };
   var is_error = false;

   // Validation logic
   if (user.first_name === '') {
      err['first_name_error'] = 'First Name is Required';
      is_error = true;
   }

   if (user.last_name === '') {
      err['last_name_error'] = 'Last Name is Required';
      is_error = true;
   }

   var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
   if (user.email === '') {
      err['email_error'] = 'Email is Required';
      is_error = true;
   } else if (!user.email.match(validRegex)) {
      err['email_error'] = 'Email is invalid';
      is_error = true;
   }

   if (user.dateOfBirth === '') {
      err['dateOfBirth_error'] = 'Date Of Birth is Required';
      is_error = true;
   }

   if (user.shippingAddress === '') {
      err['shippingAddress_error'] = 'Shipping Address is Required';
      is_error = true;
   }

   if (user.residentialAddress === '') {
      err['residentialAddress_error'] = 'Residential Address is Required';
      is_error = true;
   }

   if (user.state === '') {
      err['state_error'] = 'State is Required';
      is_error = true;
   }

   if (user.mobile === '') {
      err['mobile_error'] = 'Mobile Number is Required';
      is_error = true;
   }

   if (user.country === '') {
      err['country_error'] = 'Country is Required';
      is_error = true;
   }
   if (user.city === '') {
      err['city_error'] = 'Country is Required';
      is_error = true;
   }
   if (user.area === '') {
      err['area_error'] = 'Area is Required';
      is_error = true;
   }

   if (typeof image !== 'undefined') {
      var image_type = image.type;
      if (image_type.indexOf('image/') === -1) {
         err['image_error'] = 'Invalid image format';
         is_error = true;
      }
   }

   setUser((prev) => {
      return { ...prev, ...err };
   });

   return is_error;

  }
  const handleChangeFile = (e: any) => {
    const files = e.currentTarget.files;
    if (files) {
      setImage(files[0]);
      var preview_url = URL.createObjectURL(files[0]);
      setPreviewImage(preview_url)
      //console.log(preview_url)
      setChosenFileName(files[0].name + '');
      console.log('selected image: ', files[0])
    }
 }
 async function handleSaveChanges() {
  if (!validateForm()) {
    var storedUser = JSON.parse(localStorage.getItem("yalla_logged_in_user") + "");

    let formData = new FormData();
    formData.append("first_name", user.first_name);
    formData.append("last_name", user.last_name);
    formData.append("email", user.email);
    formData.append("dateOfBirth", user.dateOfBirth);
    formData.append("shippingAddress", user.shippingAddress);
    formData.append("residentialAddress", user.residentialAddress);
    formData.append("state", user.state);
    formData.append("country", user.country);
    formData.append("city", user.city);
    formData.append("area", user.area);
    formData.append("mobile", user.mobile);
    formData.append("id", storedUser._id);
    if (typeof image !== "undefined") {
      formData.append("image", image);
    }

    let response = await fetch("/api/dashboard/profile", {
      method: "POST",
      body: formData,
    });

    const content = await response.json();

    if (response.ok && response.status === 200) {
      // Update the user data in localStorage and other logic here
      storedUser.first_name = content.result.first_name;
      storedUser.last_name = content.result.last_name;
      storedUser.email = content.result.email;
      storedUser.dateOfBirth = content.result.dateOfBirth;
      storedUser.shippingAddress = content.result.shippingAddress;
      storedUser.state = content.result.state;
      storedUser.country = content.result.country;
      storedUser.city = content.result.city;
      storedUser.area = content.result.area;
      storedUser.mobile = content.result.mobile;
      storedUser.image = content.result.image;

      localStorage.setItem("yalla_logged_in_user", JSON.stringify(storedUser));

      // Trigger success message
      setUser((prev) => {
        return { ...prev, server_success: `Profile updated successfully!` };
      });

    } else {
      setUser((prev) => {
        return { ...prev, server_error: `HTTP error! status: ${response.status}` };
      });
    }
  }
}


  return (
    <section className="bg-gradient-to-r from-themeone to-themetwo flex-grow py-20 flex flex-col">
      <button
        type="button"
        className="flex flex-row items-center gap-3 text-white px-6 lg:px-12 w-fit"
        onClick={() => router.back()}
      >
        <FontAwesomeIcon size="xl" icon={faArrowLeft} />
        <div className="font-bold text-head-2 lg:text-head-4">My Profile</div>
      </button>
      <div className="flex flex-col flex-grow w-full lg:w-auto overflow-x-auto gap-12 mt-8 lg:mt-12">
        <div className="flex items-center gap-8 px-6 lg:px-12">
          <img src={previewImage !== '' ? previewImage : user.image}  alt="Profile"  className="w-20 h-20 rounded-full object-cover"/>
          <div className="flex flex-col items-start gap-2">
            <button className="text-themetwo font-medium py-3 px-8 rounded bg-white" onClick={onBtnClick}
            > Upload</button>

            <input
              type="file"
              id="profileImageUpload"
              className="hidden"
              accept="image/*"
              ref={inputFileRef}
              onChange={handleChangeFile} 
            />
            <div className="font-light text-white text-size-3">{chosenFileName !== '' ? chosenFileName : 'No File Chosen'}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-light-background-two backdrop-blur-64 lg:bg-transparent lg:py-0 py-6 px-6 lg:px-12">
          {/* Individual input fields for each user attribute */}
          <div className="flex flex-col text-white gap-2">
            <label htmlFor="first_name" className="font-medium">First Name</label>
            <input
              name="first_name"
              id="first_name"
              className={`placeholder-lighttwo text-white bg-transparent border lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full`}
              type="text"
              value={user.first_name}
              onChange={handleChange}
              placeholder=""
            />
            {user.first_name_error && <span className="text-red-500">{user.first_name_error}</span>}
          </div>

          <div className="flex flex-col text-white gap-2">
            <label htmlFor="last_name" className="font-medium">Last Name</label>
            <input
              name="last_name"
              id="last_name"
              className={`placeholder-lighttwo text-white bg-transparent border lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full`}
              type="text"
              value={user.last_name}
              onChange={handleChange}
              placeholder=""
            />
            {user.last_name_error && <span className="text-red-500">{user.last_name_error}</span>}
          </div>

          <div className="flex flex-col text-white gap-2">
            <label htmlFor="email" className="font-medium">Email Address</label>
            <input
              name="email"
              id="email"
              className={`placeholder-lighttwo text-white bg-transparent border lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full`}
              type="email"
              value={user.email}
              onChange={handleChange}
              placeholder={errors.email ? errors.email : ""}
              readOnly
            />
        {user.email_error && <span className="text-red-500">{user.email_error}</span>}
          </div>

          <div className="flex flex-col text-white gap-2">
            <label htmlFor="dateOfBirth" className="font-medium">Date of Birth</label>
            <input
              name="dateOfBirth"
              id="dateOfBirth"
              className={`placeholder-lighttwo text-white bg-transparent border lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full`}
              type="date"
              value={user.dateOfBirth}
              onChange={handleChange}
              placeholder={errors.dateOfBirth ? errors.dateOfBirth : ""}
            />
            {user.dateOfBirth_error && <span className="text-red-500">{user.dateOfBirth_error}</span>}
          </div>



          <div className="flex flex-col text-white gap-2">
            <label htmlFor="shippingAddress" className="font-medium">Shipping Address</label>
            <input
              name="shippingAddress"
              id="shippingAddress"
              className={`placeholder-lighttwo text-white bg-transparent border lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full}`}
              type="text"
              value={user.shippingAddress}
              onChange={handleChange}
              placeholder={errors.shippingAddress ? errors.shippingAddress : ""}
            />
            {user.shippingAddress_error && <span className="text-red-500">{user.shippingAddress_error}</span>}
          </div>



          <div className="flex flex-col text-white gap-2">
            <label htmlFor="residentialAddress" className="font-medium">Residential Address</label>
            <input
              name="residentialAddress"
              id="residentialAddress"
              className={`placeholder-lighttwo text-white bg-transparent border lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full}`}
              type="text"
              value={user.residentialAddress}
              onChange={handleChange}
              placeholder={errors.residentialAddress ? errors.residentialAddress : ""}
            />
            {user.residentialAddress_error && <span className="text-red-500">{user.residentialAddress_error}</span>}
          </div>

          <div className="flex flex-col text-white gap-2">
            <label htmlFor="city" className="font-medium">City</label>
            <input
              name="city"
              id="city"
              className={`placeholder-lighttwo text-white bg-transparent border lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full`}
              type="text"
              value={user.city}
              onChange={handleChange}
              placeholder={errors.city ? errors.city : ""}
            />
            {user.city_error && <span className="text-red-500">{user.city_error}</span>}
          </div>

          <div className="flex flex-col text-white gap-2">
            <label htmlFor="state" className="font-medium">State</label>
            <input
              name="state"
              id="state"
              className={`placeholder-lighttwo text-white bg-transparent border lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full`}
              type="text"
              value={user.state}
              onChange={handleChange}
              placeholder={errors.state ? errors.state : ""}
            />
            {user.state_error && <span className="text-red-500">{user.state_error}</span>}
          </div>

          <div className="flex flex-col text-white gap-2">
            <label htmlFor="country" className="font-medium">Country</label>
            <input
              name="country"
              id="country"
              className={`placeholder-lighttwo text-white bg-transparent border lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full`}
              type="text"
              value={user.country}
              onChange={handleChange}
              placeholder={errors.country ? errors.country : ""}
            />
            {user.country_error && <span className="text-red-500">{user.country_error}</span>}
          </div>

          <div className="flex flex-col text-white gap-2">
            <label htmlFor="phone" className="font-medium">Mobile</label>
            <input
              name="mobile"
              id="mobile"
              className={`placeholder-lighttwo text-white bg-transparent border lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full`}
              type="text"
              value={user.mobile}
              onChange={handleChange}
              placeholder={errors.mobile ? errors.mobile : ""}
            />
           {user.mobile_error && <span className="text-red-500">{user.mobile_error}</span>}
          </div>
          <div className="flex flex-col text-white gap-2">
            <label htmlFor="phone" className="font-medium">Area</label>
            <input
              name="area"
              id="area"
              className={`placeholder-lighttwo text-white bg-transparent border lg:border-[3px] rounded-lg border-lighttwo h-[45px] lg:h-[55px] focus:outline-none pl-3 w-full`}
              type="text"
              value={user.area}
              onChange={handleChange}
              placeholder={errors.area ? errors.area : ""}
            />
            {user.area_error && <span className="text-red-500">{user.area_error}</span>}
          </div>
        </div>
        

        <div
          className="text-themetwo mx-6 lg:mx-12 bg-white rounded-lg text-center font-medium text-head-2 max-w-md cursor-pointer py-3"
          onClick={handleSaveChanges} 
        >
          Save Changes
          
        </div>
        {user.server_success && <Notification message="Success" description={user.server_success} type="success" />}
        {user.server_error && <Notification message="Error" description={user.server_error} type="error" />}

      </div>
    </section>
  );
  
}
