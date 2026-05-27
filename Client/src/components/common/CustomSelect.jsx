import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const CustomSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
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
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full rounded-2xl border border-rose-100 bg-white px-4 py-4 outline-none transition flex items-center justify-between gap-3 text-left ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-gray-100"
            : "hover:border-rose-200 focus:ring-2 focus:ring-rose-300"
        }`}
      >
        <span
          className={`font-medium ${
            selectedOption ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`text-rose-700 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-[100] mt-2 w-full overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-2xl shadow-rose-100">
          <div className="max-h-64 overflow-y-auto p-2">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                    isSelected
                      ? "bg-rose-700 text-white"
                      : "text-gray-700 hover:bg-rose-50 hover:text-rose-700"
                  }`}
                >
                  <span>{option.label}</span>

                  {isSelected && <Check size={16} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;