/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const CustomDatePicker = ({
  label,
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
}) => {
  const datePickerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;

  const [currentMonth, setCurrentMonth] = useState(() => {
    return selectedDate || new Date();
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const monthName = currentMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const formattedDisplayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDateOfMonth = new Date(year, month, 1);
    const lastDateOfMonth = new Date(year, month + 1, 0);

    const startDay = firstDateOfMonth.getDay();
    const totalDays = lastDateOfMonth.getDate();

    const previousMonthLastDate = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = startDay - 1; i >= 0; i -= 1) {
      days.push({
        date: new Date(year, month - 1, previousMonthLastDate - i),
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;

    for (let day = 1; day <= remainingDays; day += 1) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth]);

  const formatDateValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const isSameDate = (dateA, dateB) => {
    if (!dateA || !dateB) return false;

    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  };

  const isToday = (date) => {
    return isSameDate(date, new Date());
  };

  const handleSelectDate = (date) => {
    onChange(formatDateValue(date));
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const clearDate = () => {
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={datePickerRef}>
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
            formattedDisplayValue ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {formattedDisplayValue || placeholder}
        </span>

        <CalendarDays size={19} className="text-rose-700" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-[120] mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-rose-100 bg-white shadow-2xl shadow-rose-100 sm:w-full sm:min-w-[320px]">
          <div className="bg-gradient-to-br from-rose-700 to-red-500 px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="h-10 w-10 rounded-2xl bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-rose-100 font-bold">
                  Select Date
                </p>
                <h3 className="font-black text-lg mt-1">{monthName}</h3>
              </div>

              <button
                type="button"
                onClick={goToNextMonth}
                className="h-10 w-10 rounded-2xl bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-black text-rose-700 py-2"
                >
                  {day}
                </div>
              ))}

              {calendarDays.map((item) => {
                const dateValue = formatDateValue(item.date);
                const selected = isSameDate(item.date, selectedDate);
                const today = isToday(item.date);

                return (
                  <button
                    key={dateValue}
                    type="button"
                    onClick={() => handleSelectDate(item.date)}
                    className={`relative h-10 rounded-2xl text-sm font-black transition ${
                      selected
                        ? "bg-rose-700 text-white shadow-lg shadow-rose-100"
                        : item.isCurrentMonth
                        ? "text-gray-800 hover:bg-rose-50 hover:text-rose-700"
                        : "text-gray-300 hover:bg-rose-50"
                    }`}
                  >
                    {item.date.getDate()}

                    {today && !selected && (
                      <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-rose-700" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-rose-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setCurrentMonth(today);
                  handleSelectDate(today);
                }}
                className="rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-700 hover:bg-rose-100 transition"
              >
                Today
              </button>

              {value && (
                <button
                  type="button"
                  onClick={clearDate}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-black text-gray-700 hover:bg-gray-200 transition"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;