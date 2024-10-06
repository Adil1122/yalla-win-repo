import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
         'extra-small': { 'max': '360px' },
         'small': '375px',
         'lg-mid' : '1366px'
      },
      textStrokeWidth: {
         '2': '2px',
      },
       textStrokeColor: {
         white: 'white',
      },
      flex: {
         '2': '2 2 0%'
      },
      lineHeight: {
         'extra-loose': '30px'
      },
      colors: {
         'themetwo': '#BC266D',
         'themeone': '#7E3F98',
         'theme-error': '#FC064C',
         'theme-topo-1':'#3B3B3B',
         'pale-white':'#DCD8D5',
         'lightone':'#BCD1D6',
         'lighttwo':'#D9D9D9',
         'lightthree':'#707070',
         'lightfour': '#f5f5f5',
         'lightfive':'#bbbbbb',
         'lightsix':'#F8FAFC',
         'darkone':'#282828',
         'light-background': 'rgba(188, 209, 214, 0.5)',
         'light-background-two': 'rgba(188, 209, 214, 0.15)',
         'light-background-three': 'rgba(255, 255, 255, 0.10)',
         'custom-purple': 'rgba(126, 63, 152, 0.54)',
         'success': '#1D7D27'
      },
      backdropBlur: {
         '64': '64px',
      },
      textShadow: {
         'custom': '0px 4px #ccc',
      },
      borderRadius: {
         'standard': '2rem',
      },
      boxShadow: {
         'custom-1': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
         'custom-3': '0px 2px 2px 0px rgba(0, 0, 0, 0.25)',
         'custom-2': '0px 4px 4px 0px #00000040',
         'custom-1-left': '0px 0px 4px 0px rgba(0, 0, 0, 0.25)',
      },
      fontFamily: {
         'regular': ['Lexant-Deca-Regular'],
         'medium': ['Lexant-Deca-Medium'],
         'bold': ['Lexant-Deca-Bold'],
         'semi-bold': ['Lexant-Deca-Semi-Bold'],
         'extra-bold': ['Lexant-Deca-Extra-Bold'],
         'black': ['Lexant-Deca-Black'],
         'light': ['Lexant-Deca-Light'],
         'extra-light': ['Lexant-Deca-Extra-Light'],
         'thin': ['Lexant-Deca-Thin'],
         'inter-regular': ['Inter-Regular'],
         'noto-sans-regular': ['NotoSans-Regular'],
         'noto-sans-bold': ['NotoSans-Semi-Condensed-Bold'],
         'noto-sans-black': ['NotoSans-Black'],
         'luckiest-guy': ['Luckiest-Guy'],
         'poppins': ['Poppins-Regular'],
         'poppins-medium': ['Poppins-Medium'],
         'poppins-bold': ['Poppins-Bold'],
      },
      fontSize: {
         'small': '10px',
         'size-1': '14px',
         'size-2': '15px',
         'size-3': '16px',
         'size-4': '17px',
         'head-1': '18px',
         'head-2': '19px',
         'head-3': '20px',
         'head-4': '21px',
         'head-5': '22px',
         'head-6': '23px',
         'head-7': '24px',
         'head-8': '25px',
         'head-9': '26px',
         'big-one': '27px',
         'big-two': '28px',
         'big-three': '29px',
         'big-four': '30px',
         'big-five': '31px',
         'marquee': '36px',
         'large-head': '36px',
         'extra-large-head': '42px',
      }
    },
  },
  plugins: [
   require('tailwindcss-textshadow'),
   require('@tailwindcss/forms'),
   function ({ addUtilities }: any) {
      addUtilities({
        '.text-stroke': {
          '-webkit-text-stroke': '2px white',
        },
      });
   },
  ],
};
export default config;
