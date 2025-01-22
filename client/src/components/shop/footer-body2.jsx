import { Facebook, Instagram } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const footerMenuItems = [
  {
    id: "sunglasses",
    label: "Sunglasses",
    path: "/shop/listing",
  },
  {
    id: "wristwatch",
    label: "Wristwatch",
    path: "/shop/listing",
  },
  {
    id: "perfume",
    label: "Perfume",
    path: "/shop/listing",
  },
  {
    id: "belts",
    label: "Belts",
    path: "/shop/listing",
  },
  {
    id: "armpitPurse",
    label: "Armpit Purse",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
];

export default function FooterBodyDown() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  function handleNavigate(menuItem) {
    sessionStorage.removeItem("filters");

    const currentFilter =
      menuItem.id !== "home" &&
      menuItem.id !== "products" &&
      menuItem.id !== "search"
        ? {
            product: [menuItem.id],
          }
        : null;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?product=${menuItem.id}`));
    } else {
      navigate(menuItem.path);
    }
  }

  function isActive(menuItemId) {
    const filters = JSON.parse(sessionStorage.getItem("filters"));
    return filters?.product?.[0] === menuItemId;
  }

  return (
    <div className="bg-foreground text-white">
      <div className="flex flex-wrap justify-around items-center mt-16">
        <div className="flex flex-col justify-center gap-1 mx-4">
          <h1 className="text-2xl font-medium tracking-wide">
            Sign Up To Our Newsletter.
          </h1>
          <p className="text-sm">
            Be the first to hear about our latest offers.
          </p>
        </div>
        <form>
          <div className="flex items-center justify-center gap-3 mt-6 md:mt-0">
            <input
              type="email"
              placeholder="Your Email"
              required
              className="border-none text-white bg-transparent px-4 outline outline-2 outline-white focus:outline-[#4da6ff] rounded-md w-[221px] h-10 text-sm placeholder-white"
            />
            <button
              type="submit"
              className="bg-[#0156FF] rounded-full px-6 py-2.5 text-base font-medium cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 active:scale-100"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap gap-6 justify-between mt-10 sm:max-w-[90vw] sm:mx-auto">
        <ul className="flex flex-col gap-1 ml-[8.5%]">
          <h2 className="text-xl font-medium tracking-wider">Products</h2>
          {footerMenuItems.map((menuItem) => (
            <li
              onClick={() => handleNavigate(menuItem)}
              className="cursor-pointer hover:underline"
              key={menuItem.id}
            >
              {menuItem.label}
            </li>
          ))}
        </ul>

        <ul className="flex flex-col gap-1 max-w-[310px] ml-[8.5%] sm:mr-[80px]">
          <h2 className="text-xl font-medium tracking-wider">Contact</h2>
          <li className="py-1">
            <span className="font-semibold pr-1 underline">Address:</span> 7,
            Reggie Close, Off Agbe Road, Abule Egba, Lagos
          </li>
          <li className="py-1">
            <span className="font-semibold pr-1 underline">Phones:</span> (234)
            700 0000
          </li>
          <li className="py-1">
            <span className="font-semibold pr-1 underline">We are open:</span>
            Monday-Friday: 9:00 AM - 6:00PM
          </li>
          <li className="py-1">
            <span className="font-semibold pr-1 underline">Saturday:</span>
            10:00 AM - 5:00 PM
          </li>
          <li className="py-1">
            <span className="font-semibold pr-1 underline">E-mail:</span>
            support@email.com
          </li>
        </ul>
      </div>

      <div className="flex mt-8 justify-center mx-[8.5%]">
        <div className="flex gap-4">
          <Facebook alt="facebook icon" className="cursor-pointer" />
          <Instagram alt="instagram icon" className="cursor-pointer" />
          <span className="h-6 w-6 flex items-center cursor-pointer justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="h-full w-full"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
              />
            </svg>
          </span>
        </div>
      </div>

      <hr className="border-[1.3px] border-gray-700 opacity-30 mx-[8.5%] mt-5 mb-10" />

      <div className="flex justify-center mx-[8.5%] mb-3">
        <p className="text-sm">&copy; 2024 Tianna Store. Ltd.</p>
      </div>
    </div>
  );
}
