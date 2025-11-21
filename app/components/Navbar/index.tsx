"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FiGithub, FiTwitter, FiYoutube } from "react-icons/fi";

const Navbar: React.FC = (): JSX.Element => {
  const mobileLinksRef = useRef<HTMLDivElement>(null);
  const [navToggled, setNavToggled] = useState<boolean>(false);

  useEffect(() => {
    if (navToggled) {
      mobileLinksRef.current!.style.maxHeight = `${
        mobileLinksRef.current!.scrollHeight
      }px`;
    } else {
      mobileLinksRef.current!.style.maxHeight = "0";
    }
  }, [navToggled]);

  const handleHamburgerClick = () => {
    setNavToggled(!navToggled);
  };

  const navItemsClassname= "neu-pressed p-2 rounded-lg text-base-content transition-all duration-200 hover:neu-raised hover:text-primary"
  const navItems = [
    {
      link: "https://github.com/yankee-svg/medliink",
      element: <FiGithub className="h-5 w-5" />,
    },
    {
      link: "https://youtube.com/yankee-svg/",
      element: <FiYoutube className="h-5 w-5" />,
    },
    {
      link: "https://github.com/Emmysoft_Tm/",
      element: <FiTwitter className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="w-screen flex items-center md:justify-center justify-between md:flex-row flex-col py-5 overflow-x-hidden z-10">
      <div className="neu-raised px-6 py-3 rounded-2xl mx-5">
        <h2 className="neu-text-primary font-extrabold text-2xl md:text-4xl cursor-pointer">
          <Link href="/" className="flex items-center">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Medliink
            </span>
          </Link>
        </h2>
      </div>

      <section className="hidden md:flex items-end justify-end w-4/6 overflow-x-hidden space-x-4">
        {navItems.map((navItem, index) => {
          return (
            <Link key={index} href={navItem.link}>
              <div className={navItemsClassname}>
                {navItem.element}
              </div>
            </Link>
          );
        })}
      </section>

      <section className="md:hidden flex w-full flex-col">
        <section className="header flex w-full items-center justify-between">
          <div className="neu-raised px-4 py-2 rounded-2xl mx-5">
            <h2 className="neu-text-primary font-extrabold text-xl">
              <Link href="/">Medliink</Link>
            </h2>
          </div>

          <button
            className={`neu-pressed transform transition-transform duration-300 ease-in-out rounded-xl p-2 mx-5 ${
              navToggled ? "rotate-90 neu-raised" : ""
            }`}
            onClick={handleHamburgerClick}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              className="font-bold"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 11h12v2H4zm0-5h16v2H4zm0 12h7.235v-2H4z"></path>
            </svg>
          </button>
        </section>

        <div
          ref={mobileLinksRef}
          className="mx-5 my-3 overflow-hidden transition-max-h duration-500 ease-in-out neu-card-small"
        >
          <div className="flex flex-col space-y-4 p-4">
            <Link href="/auth/login" className="neu-text-secondary font-medium transition-colors duration-200 hover:neu-text-primary">
              login
            </Link>
            <Link href="/auth/signup" className="neu-text-secondary font-medium transition-colors duration-200 hover:neu-text-primary">
              signup
            </Link>
            <Link href="https://github.com/yankee-svg/medliink" className="flex items-center gap-x-3 neu-text-secondary font-medium transition-colors duration-200 hover:neu-text-primary">
              <FiGithub className="text-primary" />
              star project
            </Link>
          </div>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
