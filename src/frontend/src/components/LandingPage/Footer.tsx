// src/pages/landing/components/Footer.tsx
export default function Footer() {
  return (
    <footer
      className="w-full border-t border-gray-200 bg-white"
      style={{ fontFamily: 'Open Sans, sans-serif', fontWeight: 400 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between py-2 px-8 gap-8 text-base text-gray-700">
        {/* Logo & Slogan */}
        <div className="flex flex-col gap-2 items-center md:items-start flex-1 min-w-[220px]">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2">
              {/* Heroicon CheckCircle */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12l2 2 4-4" />
              </svg>
              <span className="font-bold text-blue-700 text-lg">HRM System</span>
            </div>
            <span className="text-sm text-gray-500 italic">Empowering your workforce</span>
            <span className="text-xs text-gray-400">© {new Date().getFullYear()} Group 07</span>
          </div>
        </div>

        {/* Contact & Company Info */}
        <div className="flex flex-col items-center md:items-center text-sm text-gray-700 min-w-[320px] w-full flex-1 justify-center break-words text-center md:text-left">
          <div className="font-bold text-blue-700 mb-1 tracking-wide">Liên hệ</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {/* Heroicon Envelope */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-18 8V8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <a href="mailto:contact@hrmcompany.vn" className="hover:underline hover:text-blue-800 transition font-medium">contact@hrmcompany.vn</a>
            </div>
            <div className="flex items-center gap-2">
              {/* Heroicon Phone */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <a href="tel:02812345678" className="hover:underline hover:text-blue-800 transition font-medium">028 1234 5678</a>
            </div>
            <div className="flex items-center gap-2">
              {/* Heroicon MapPin */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 8c-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8z" />
              </svg>
              <span className="font-medium">Tầng 10, Tòa nhà HRM, 456 Nguyễn Huệ, Quận 1, TP.HCM</span>
            </div>
          </div>
        </div>

        {/* Socials & More */}
        <div className="flex flex-col items-center md:items-end text-sm text-gray-700 min-w-[200px] flex-1 justify-center">
          <div className="font-bold text-blue-700 mb-1 tracking-wide">Kết nối với chúng tôi</div>
          <div className="flex gap-2">
            <a href="#" className="hover:text-blue-600" title="Facebook">
              {/* Facebook square frame icon, smaller */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 32 32">
                <rect width="32" height="32" rx="5" fill="#1877F3" />
                <path d="M22 17H18V26H14V17H12V14H14V12.5C14 10.5 15 9 18 9H22V12H19.5C19 12 18 12.2 18 13V14H22L22 17Z" fill="white" />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-600" title="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 32 32">
                <rect width="32" height="32" rx="5" fill="#0A66C2" />
                <path d="M10 13H14V26H10V13ZM12 11C10.9 11 10 10.1 10 9C10 7.9 10.9 7 12 7C13.1 7 14 7.9 14 9C14 10.1 13.1 11 12 11ZM18 13H22V14.5H22.04C22.6 13.7 23.8 12.5 25 12.5C27.5 12.5 28 14 28 16.5V26H24V17.5C24 16 23.8 15 22.5 15C21 15 20.5 16 20.5 17.5V26H16.5V13H18Z" fill="white" />
              </svg>
            </a>
            <a href="#" className="hover:text-blue-600" title="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="currentColor" viewBox="0 0 32 32">
                <rect width="32" height="32" rx="5" fill="#FF5A5A" />
                <path d="M23 16.5C23 15.295 22.205 14.5 21 14.5H11C9.795 14.5 9 15.295 9 16.5V21.5C9 22.705 9.795 23.5 11 23.5H21C22.205 23.5 23 22.705 23 21.5V16.5ZM14.5 20.5V17.5L18.5 19L14.5 20.5Z" fill="white" />
              </svg>
            </a>
          </div>
          <span className="text-xs text-gray-400 mt-1">All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
