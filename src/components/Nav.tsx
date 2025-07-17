import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function Nav() {
  return (
    
<Disclosure as="nav" className="bg-purple-700 text-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-bold text-white">
                  MyApp
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden sm:flex space-x-6">
                <Link to="/" className="hover:text-purple-200 transition">
                  Home
                </Link>
                <Link to="/login" className="hover:text-purple-200 transition">
                  Login
                </Link>
                <Link to="/dashboard" className="hover:text-purple-200 transition">
                  Dashboard
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 text-white hover:text-purple-300">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Content */}
          <Disclosure.Panel className="sm:hidden px-4 pb-4">
            <div className="flex flex-col space-y-2">
              <Link to="/" className="hover:text-purple-300">
                Home
              </Link>
              <Link to="/login" className="hover:text-purple-300">
                Login
              </Link>
              <Link to="/dashboard" className="hover:text-purple-300">
                Dashboard
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
