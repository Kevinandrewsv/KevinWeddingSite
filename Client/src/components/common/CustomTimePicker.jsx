/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock, X } from "lucide-react";

const CustomTimePicker = ({
  label,
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
}) => {
  const timePickerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const parseTimeValue = (timeValue) => {
    if (!timeValue) {
      return {
        hour: "10",
        minute: "00",
        period: "AM",
      };
    }

    const cleanedValue = timeValue.trim().toUpperCase();
    const [timePart, periodPart] = cleanedValue.split(" ");
    const [hourPart, minutePart] = timePart.split(":");

    return {
      hour: hourPart?.padStart(2, "0") || "10",
      minute: minutePart?.padStart(2, "0") || "00",
      period: periodPart === "PM" ? "PM" : "AM",
    };
  };

  const initialTime = parseTimeValue(value);

  const [hour, setHour] = useState(initialTime.hour);
  const [minute, setMinute] = useState(initialTime.minute);
  const [period, setPeriod] = useState(initialTime.period);

  const hours = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) =>
        String(index + 1).padStart(2, "0")
      ),
    []
  );

  const minutes = useMemo(
    () => ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
    []
  );

  const quickTimes = [
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ];

  useEffect(() => {
    const parsedTime = parseTimeValue(value);
    setHour(parsedTime.hour);
    setMinute(parsedTime.minute);
    setPeriod(parsedTime.period);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const buildTimeValue = (selectedHour, selectedMinute, selectedPeriod) => {
    return `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
  };

  const handleApply = () => {
    onChange(buildTimeValue(hour, minute, period));
    setIsOpen(false);
  };

  const handleQuickTimeSelect = (timeValue) => {
    const parsedTime = parseTimeValue(timeValue);

    setHour(parsedTime.hour);
    setMinute(parsedTime.minute);
    setPeriod(parsedTime.period);
    onChange(timeValue);
    setIsOpen(false);
  };

  const clearTime = () => {
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={timePickerRef}>
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
          className={`font-medium ${value ? "text-gray-900" : "text-gray-400"}`}
        >
          {value || placeholder}
        </span>

        <Clock size={19} className="text-rose-700" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-[130] mt-2 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-rose-100 bg-white shadow-2xl shadow-rose-100 sm:w-full sm:min-w-[340px]">
          <div className="bg-gradient-to-br from-rose-700 to-red-500 px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-rose-100 font-bold">
                  Select Time
                </p>
                <h3 className="font-black text-2xl mt-1">
                  {buildTimeValue(hour, minute, period)}
                </h3>
              </div>

              {value && (
                <button
                  type="button"
                  onClick={clearTime}
                  className="h-10 w-10 rounded-2xl bg-white/15 hover:bg-white/25 transition flex items-center justify-center"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="p-4">
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-[0.18em]">
                Quick Times
              </p>

              <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {quickTimes.map((timeItem) => {
                  const isSelected = value === timeItem;

                  return (
                    <button
                      key={timeItem}
                      type="button"
                      onClick={() => handleQuickTimeSelect(timeItem)}
                      className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                        isSelected
                          ? "bg-rose-700 text-white shadow-lg shadow-rose-100"
                          : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      {timeItem}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_1fr_0.9fr] gap-3 mt-5">
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-[0.18em] mb-3">
                  Hour
                </p>

                <div className="h-52 overflow-y-auto rounded-2xl border border-rose-100 bg-rose-50/60 p-2">
                  {hours.map((hourItem) => (
                    <button
                      key={hourItem}
                      type="button"
                      onClick={() => setHour(hourItem)}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-black transition ${
                        hour === hourItem
                          ? "bg-rose-700 text-white"
                          : "text-gray-700 hover:bg-white hover:text-rose-700"
                      }`}
                    >
                      {hourItem}
                      {hour === hourItem && <Check size={15} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-[0.18em] mb-3">
                  Minute
                </p>

                <div className="h-52 overflow-y-auto rounded-2xl border border-rose-100 bg-rose-50/60 p-2">
                  {minutes.map((minuteItem) => (
                    <button
                      key={minuteItem}
                      type="button"
                      onClick={() => setMinute(minuteItem)}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-black transition ${
                        minute === minuteItem
                          ? "bg-rose-700 text-white"
                          : "text-gray-700 hover:bg-white hover:text-rose-700"
                      }`}
                    >
                      {minuteItem}
                      {minute === minuteItem && <Check size={15} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-[0.18em] mb-3">
                  AM/PM
                </p>

                <div className="grid gap-2 rounded-2xl border border-rose-100 bg-rose-50/60 p-2">
                  {["AM", "PM"].map((periodItem) => (
                    <button
                      key={periodItem}
                      type="button"
                      onClick={() => setPeriod(periodItem)}
                      className={`flex items-center justify-between rounded-xl px-4 py-4 text-sm font-black transition ${
                        period === periodItem
                          ? "bg-rose-700 text-white"
                          : "text-gray-700 hover:bg-white hover:text-rose-700"
                      }`}
                    >
                      {periodItem}
                      {period === periodItem && <Check size={15} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-rose-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setHour("10");
                  setMinute("00");
                  setPeriod("AM");
                }}
                className="rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-700 hover:bg-rose-100 transition"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-2 rounded-full bg-rose-700 px-5 py-2.5 text-sm font-black text-white hover:bg-rose-800 transition shadow-lg shadow-rose-100"
              >
                <Check size={15} />
                Apply Time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTimePicker;