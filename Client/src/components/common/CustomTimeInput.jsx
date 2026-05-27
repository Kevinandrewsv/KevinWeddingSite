import { Clock } from "lucide-react";

const CustomTimeInput = ({
  label,
  value,
  onChange,
  placeholder = "10:20",
  disabled = false,
}) => {
  const parseTime = (timeValue) => {
    if (!timeValue) {
      return {
        time: "",
        period: "AM",
      };
    }

    const cleanValue = timeValue.trim().toUpperCase();
    const period = cleanValue.includes("PM") ? "PM" : "AM";
    const time = cleanValue.replace(/\s?(AM|PM)/i, "").trim();

    return {
      time,
      period,
    };
  };

  const { time, period } = parseTime(value);

  const formatTimeFromDigits = (inputValue) => {
    const digitsOnly = inputValue.replace(/\D/g, "").slice(0, 4);

    if (digitsOnly.length === 0) {
      return "";
    }

    if (digitsOnly.length <= 2) {
      return digitsOnly;
    }

    const hour = digitsOnly.slice(0, 2);
    const minute = digitsOnly.slice(2, 4);

    return `${hour}:${minute}`;
  };

  const buildValue = (timeValue, periodValue) => {
    if (!timeValue) {
      return "";
    }

    return `${timeValue} ${periodValue}`;
  };

  const handleTimeChange = (e) => {
    const formattedTime = formatTimeFromDigits(e.target.value);
    onChange(buildValue(formattedTime, period));
  };

  const handlePeriodChange = (periodValue) => {
    if (!time) {
      onChange("");
      return;
    }

    onChange(buildValue(time, periodValue));
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div
        className={`h-[74px] w-full rounded-3xl border border-rose-100 bg-white px-5 transition ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-gray-100"
            : "hover:border-rose-200 focus-within:ring-2 focus-within:ring-rose-300"
        }`}
      >
        <div className="h-full grid grid-cols-[24px_minmax(0,1fr)_96px] items-center gap-3">
          <Clock size={20} className="text-rose-700" />

          <input
            type="text"
            value={time}
            onChange={handleTimeChange}
            placeholder={placeholder}
            disabled={disabled}
            inputMode="numeric"
            maxLength="5"
            className="w-full min-w-0 bg-transparent outline-none text-gray-900 font-bold text-lg placeholder:text-gray-400"
          />

          <div className="flex items-center justify-end gap-1">
            {["AM", "PM"].map((item) => (
              <button
                key={item}
                type="button"
                disabled={disabled}
                onClick={() => handlePeriodChange(item)}
                className={`h-9 w-11 rounded-xl text-xs font-black transition ${
                  period === item
                    ? "bg-rose-700 text-white shadow-md shadow-rose-100"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTimeInput;