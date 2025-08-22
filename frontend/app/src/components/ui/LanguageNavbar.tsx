import React, { useState, useEffect, useRef } from 'react';
import { FaLinkedin, FaWhatsapp, FaGithub, FaEnvelope } from 'react-icons/fa';

const LanguageNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: 'br',
    name: 'Português (BR)',
    flag: (
      <svg
        className="w-5 h-5 rounded-full me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        id="flag-icon-css-br"
        viewBox="0 0 512 512"
      >
        <defs>
          <path
            id="d"
            d="M256 171.4l-65.3 41.5h80.6z"
            fill="#fffef2"
            stroke="#f5f3e7"
            strokeWidth=".5"
            strokeLinejoin="round"
          />
          <path
            id="e"
            d="M256 171.4l-53.2 58.9h106.4z"
            fill="#fffef2"
            stroke="#f5f3e7"
            strokeWidth=".5"
            strokeLinejoin="round"
          />
        </defs>
        <path fill="#009639" d="M0 0h512v512H0z" />
        <path
          fill="#fedf00"
          d="M261.3 110.1l-5.3 3.2L101.8 256l154.2 142.7 5.3 3.2 5.3-3.2L410.2 256 266.6 113.3z"
        />
        <circle cx="256" cy="256" r="89" fill="#002776" />
        <path
          d="M256 167a89 89 0 0 0-62.7 26.2c-33.2 33.2-33.2 87.2 0 120.4s87.2 33.2 120.4 0 33.2-87.2 0-120.4A89 89 0 0 0 256 167z"
          fill="#002776"
        />
        <path
          d="M256 179a77 77 0 0 0-54.4 22.8c-28.8 28.8-28.8 75.9 0 104.7s75.9 28.8 104.7 0 28.8-75.9 0-104.7A77 77 0 0 0 256 179z"
          fill="#002776"
        />
        <path
          d="M322.4 280.9l-6.3-9.5-11 1.9-2.1-10.7-11.1 1.8.9-11.2-11.2.9 3.7-10.7-10.7 3.8-2.8-10.5-10.5-2.8 6.1-9.9-9.9 6.1-8.4-7.6-7.6-8.4 9.1-6.3-6.3-9.1 10.6-3.5-3.5-10.6 11.2-.7-.7-11.2 10.7 2.1 2.1-10.7 9.5 4.9 4.9-9.5 7.6 7.6 7.6-7.6-4.9-9.5-2.1 10.7.7-11.2-10.7.7-11.2-.7 3.5-10.6-10.6-3.5 6.3-9.1-9.1-6.3 7.6-8.4 8.4-7.6-6.1-9.9 9.9-6.1 2.8-10.5 10.5-2.8-3.8-10.7 10.7-3.7-.9-11.2 11.2-.9-1.8-11.1 11.1-1.8 1.9-11 11-1.9-6.3-9.5 9.5-6.3-8.4-7.6 7.6-8.4-9.9-6.1 6.1-9.9-10.5-2.8 2.8-10.5-10.7-3.7 3.8-10.7-11.2-.9.9-11.2-11.1-1.8 1.8-11.1-11-1.9 1.9-11-9.5-6.3 6.3-9.5-7.6-8.4 8.4-7.6-6.1-9.9 9.9-6.1-2.8-10.5 10.5-2.8-3.8-10.7 10.7-3.7-.9-11.2 11.2-.9-1.8-11.1 11.1-1.8 1.9-11 11-1.9z"
          fill="#009639"
        />
      </svg>
    ),
  });

  const languages = [
    {
      code: 'us',
      name: 'English (US)',
      flag: (
        <svg
          aria-hidden="true"
          className="h-3.5 w-3.5 rounded-full me-2"
          xmlns="http://www.w3.org/2000/svg"
          id="flag-icon-css-us"
          viewBox="0 0 512 512"
        >
          <g fillRule="evenodd">
            <g strokeWidth="1pt">
              <path
                fill="#bd3d44"
                d="M0 0h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                transform="scale(3.9385)"
              />
              <path
                fill="#fff"
                d="M0 10h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0zm0 20h247v10H0z"
                transform="scale(3.9385)"
              />
            </g>
            <path fill="#192f5d" d="M0 0h98.8v70H0z" transform="scale(3.9385)" />
            <path
              fill="#fff"
              d="M8.2 3l1 2.8H12L9.7 7.5l.9 2.7-2.4-1.7L6 10.2l.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7L74 8.5l-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 7.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 24.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 21.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 38.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 35.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 52.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 49.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm-74.1 7l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7H65zm16.4 0l1 2.8H86l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm-74 7l.8 2.8h3l-2.4 1.7.9 2.7-2.4-1.7L6 66.2l.9-2.7-2.4-1.7h3zm16.4 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8H45l-2.4 1.7 1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9zm16.4 0l1 2.8h2.8l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h3zm16.5 0l.9 2.8h2.9l-2.3 1.7.9 2.7-2.4-1.7-2.3 1.7.9-2.7-2.4-1.7h2.9zm16.5 0l.9 2.8h2.9L92 63.5l1 2.7-2.4-1.7-2.4 1.7 1-2.7-2.4-1.7h2.9z"
              transform="scale(3.9385)"
            />
          </g>
        </svg>
      ),
    },
    {
      code: 'br',
      name: 'Português (BR)',
      flag: (
        <svg
          className="h-3.5 w-3.5 rounded-full me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          id="flag-icon-css-br"
          viewBox="0 0 512 512"
        >
          <defs>
            <path
              id="d"
              d="M256 171.4l-65.3 41.5h80.6z"
              fill="#fffef2"
              stroke="#f5f3e7"
              strokeWidth=".5"
              strokeLinejoin="round"
            />
            <path
              id="e"
              d="M256 171.4l-53.2 58.9h106.4z"
              fill="#fffef2"
              stroke="#f5f3e7"
              strokeWidth=".5"
              strokeLinejoin="round"
            />
          </defs>
          <path fill="#009639" d="M0 0h512v512H0z" />
          <path
            fill="#fedf00"
            d="M261.3 110.1l-5.3 3.2L101.8 256l154.2 142.7 5.3 3.2 5.3-3.2L410.2 256 266.6 113.3z"
          />
          <circle cx="256" cy="256" r="89" fill="#002776" />
          <path
            d="M256 167a89 89 0 0 0-62.7 26.2c-33.2 33.2-33.2 87.2 0 120.4s87.2 33.2 120.4 0 33.2-87.2 0-120.4A89 89 0 0 0 256 167z"
            fill="#002776"
          />
          <path
            d="M256 179a77 77 0 0 0-54.4 22.8c-28.8 28.8-28.8 75.9 0 104.7s75.9 28.8 104.7 0 28.8-75.9 0-104.7A77 77 0 0 0 256 179z"
            fill="#002776"
          />
          <path
            d="M322.4 280.9l-6.3-9.5-11 1.9-2.1-10.7-11.1 1.8.9-11.2-11.2.9 3.7-10.7-10.7 3.8-2.8-10.5-10.5-2.8 6.1-9.9-9.9 6.1-8.4-7.6-7.6-8.4 9.1-6.3-6.3-9.1 10.6-3.5-3.5-10.6 11.2-.7-.7-11.2 10.7 2.1 2.1-10.7 9.5 4.9 4.9-9.5 7.6 7.6 7.6-7.6-4.9-9.5-2.1 10.7.7-11.2-10.7.7-11.2-.7 3.5-10.6-10.6-3.5 6.3-9.1-9.1-6.3 7.6-8.4 8.4-7.6-6.1-9.9 9.9-6.1 2.8-10.5 10.5-2.8-3.8-10.7 10.7-3.7-.9-11.2 11.2-.9-1.8-11.1 11.1-1.8 1.9-11 11-1.9-6.3-9.5 9.5-6.3-8.4-7.6 7.6-8.4-9.9-6.1 6.1-9.9-10.5-2.8 2.8-10.5-10.7-3.7 3.8-10.7-11.2-.9.9-11.2-11.1-1.8 1.8-11.1-11-1.9 1.9-11-9.5-6.3 6.3-9.5-7.6-8.4 8.4-7.6-6.1-9.9 9.9-6.1-2.8-10.5 10.5-2.8-3.8-10.7 10.7-3.7-.9-11.2 11.2-.9-1.8-11.1 11.1-1.8 1.9-11 11-1.9z"
            fill="#009639"
          />
        </svg>
      ),
    },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectLanguage = (language: (typeof languages)[0]) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="https://flowbite.com/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Meet Schedule
            </span>
          </a>
          <div className="flex items-center md:order-2 space-x-1 md:space-x-0 rtl:space-x-reverse">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleDropdown}
                className="inline-flex items-center font-medium justify-center px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                {selectedLanguage.flag}
                {selectedLanguage.name}
              </button>
              <div
                className={`z-50 ${isDropdownOpen ? 'block' : 'hidden'} my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 absolute top-full left-0 min-w-max`}
                id="language-dropdown-menu"
              >
                <ul className="py-2 font-medium" role="none">
                  {languages.map(language => (
                    <li key={language.code}>
                      <button
                        onClick={() => selectLanguage(language)}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                        role="menuitem"
                      >
                        <div className="inline-flex items-center">
                          {language.flag}
                          {language.name}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              data-collapse-toggle="navbar-language"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-language"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-between flex w-full md:w-auto md:order-1"
            id="navbar-language"
          >
            <ul className="flex flex-row justify-center items-center gap-4 font-medium p-2 md:p-0 mt-4 md:mt-0 border border-gray-100 rounded-lg bg-gray-50 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="https://www.linkedin.com/in/aurelioventurelli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 px-3 text-white bg-black rounded-sm md:bg-transparent md:text-black md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                  title="LinkedIn"
                >
                  <FaLinkedin size={24} className="inline align-middle" />
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5561993608080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-green-600 dark:text-white md:dark:hover:text-green-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  title="WhatsApp"
                >
                  <FaWhatsapp size={24} className="inline align-middle" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/venturelli-91"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-gray-900 dark:text-white md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  title="GitHub"
                >
                  <FaGithub size={24} className="inline align-middle" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:seu@email.com"
                  className="block py-2 px-3 md:p-0 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-600 dark:text-white md:dark:hover:text-red-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  title="E-mail"
                >
                  <FaEnvelope size={24} className="inline align-middle" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default LanguageNavbar;
