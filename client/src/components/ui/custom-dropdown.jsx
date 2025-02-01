import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const CustomDropdown = ({ label, items, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        const handleClickOutside = (event) => {
          if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
          ) {
            setIsOpen(false);
          }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="flex flex-col lg:block items-center justify-center font-medium cursor-pointer relative pb-1"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center lg:hover:text-blue-600 transition-colors justify-center lg:text-sm font-medium cursor-pointer h-full relative ${
          isOpen ? "text-blue-600 lg:text-foreground" : "text-foreground"
        }`}
      >
        {label}
        {isOpen ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </button>

      <div
        className={`hidden lg:block absolute left-0 w-56 bg-white shadow-md rounded-md transition-all duration-300 ease-out transform ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <ul className="p-2 space-y-1">
          {items.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                onItemClick(item);
                setIsOpen(false);
              }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {isOpen && (
        <div className="block lg:hidden mt-2">
          <ul className="p-2 space-y-1 bg-white">
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  onItemClick(item);
                  setIsOpen(false);
                }}
                className="cursor-pointer px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md"
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
