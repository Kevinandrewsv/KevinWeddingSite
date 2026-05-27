import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  Heart,
  Mail,
  MessageCircleHeart,
  Phone,
  Send,
  UserRound,
  Users,
} from "lucide-react";

import { useCreateGuestResponse } from "../../hooks/useGuestResponses";
import { CustomSelect, SectionHeading } from "../../components/common";
import coupleAttendanceImage from "../../assets/couple-attendance.webp";

const eventOptions = [
  { label: "Both Events", value: "Both" },
  { label: "Engagement", value: "Engagement" },
  { label: "Marriage", value: "Marriage" },
];

const attendanceOptions = [
  { label: "Yes, I will attend", value: "true" },
  { label: "Sorry, I cannot attend", value: "false" },
];

const inputClass =
  "w-full rounded-[1.35rem] border border-rose-100 bg-white/85 px-4 py-3.5 text-sm font-semibold text-gray-950 outline-none backdrop-blur-xl transition placeholder:text-gray-500 focus:border-rose-300 focus:bg-white focus:ring-4 focus:ring-rose-100/70 sm:rounded-[1.45rem] sm:px-5 sm:py-4 sm:text-[15px]";

const labelClass =
  "mb-2 block text-[11px] font-black uppercase tracking-[0.14em] text-gray-950 sm:text-[12px] sm:tracking-[0.16em]";

const inputIconClass =
  "absolute left-4 top-1/2 -translate-y-1/2 text-rose-600 sm:left-5";

const InitialFormData = {
  name: "",
  phone: "",
  email: "",
  attending: "true",
  guestCount: 1,
  event: "Both",
  message: "",
};

const MobileAttendanceIntro = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55 }}
      className="lg:hidden"
    >
      <div className="relative mx-auto mt-6 max-w-[430px] overflow-hidden rounded-[2rem] border border-rose-100 bg-white px-4 pb-5 pt-4 shadow-[0_18px_40px_rgba(244,63,94,0.08)] sm:mt-8 sm:max-w-[560px] sm:rounded-[2.4rem] sm:px-6 sm:pb-7 sm:pt-6 md:max-w-[650px]">
        <div className="pointer-events-none absolute left-1/2 top-6 h-64 w-64 -translate-x-1/2 rounded-full border border-rose-100/80 sm:h-80 sm:w-80" />
        <div className="pointer-events-none absolute left-1/2 top-12 h-48 w-48 -translate-x-1/2 rounded-full border border-dashed border-rose-200/80 sm:h-64 sm:w-64" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-rose-50 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-700 text-white shadow-xl shadow-rose-100 sm:h-16 sm:w-16">
            <Heart size={24} fill="currentColor" />
          </div>

          <img
            src={coupleAttendanceImage}
            alt="Kevin Andrews and Jenith Silviya"
            className="mt-2 h-auto w-full max-w-[245px] object-contain min-[390px]:max-w-[275px] sm:max-w-[340px] md:max-w-[380px]"
          />

          <div className="mt-2 flex w-full max-w-sm items-center gap-3 sm:max-w-md">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-200 to-rose-300" />
            <p className="text-center text-[10px] font-black uppercase tracking-[0.18em] text-gray-950 sm:text-[11px] sm:tracking-[0.22em]">
              Kevin & Jenith
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-rose-300 via-rose-200 to-transparent" />
          </div>

          <div className="mt-5 grid w-full gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4">
            <div className="rounded-[1.35rem] border border-rose-100 bg-gradient-to-br from-white via-white to-rose-50/60 px-4 py-4 text-left shadow-sm shadow-rose-100/60 sm:rounded-[1.6rem] sm:px-5 sm:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-rose-700 shadow-md shadow-rose-100">
                  <Heart size={18} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-600">
                    Engagement
                  </p>
                  <h4 className="mt-1 text-lg font-black text-gray-950 sm:text-xl">
                    21 June 2025
                  </h4>
                  <p className="mt-0.5 text-xs font-semibold text-gray-500 sm:text-sm">
                    The promise begins
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-rose-100 bg-gradient-to-br from-white via-white to-rose-50/60 px-4 py-4 text-left shadow-sm shadow-rose-100/60 sm:rounded-[1.6rem] sm:px-5 sm:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-rose-700 shadow-md shadow-rose-100">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-600">
                    Marriage
                  </p>
                  <h4 className="mt-1 text-lg font-black text-gray-950 sm:text-xl">
                    25 June 2025
                  </h4>
                  <p className="mt-0.5 text-xs font-semibold text-gray-500 sm:text-sm">
                    The journey continues
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DesktopAttendanceVisual = () => {
  return (
    <aside className="relative hidden min-h-[520px] lg:block lg:sticky lg:top-24">
      <motion.div
        initial={{ opacity: 0, x: -28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="relative h-full min-h-[520px] overflow-hidden px-2 py-2 md:px-4"
      >
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-rose-100/70" />
        <div className="absolute left-1/2 top-12 h-[430px] w-[430px] -translate-x-1/2 rounded-full border border-dashed border-rose-200/70" />
        <div className="absolute left-1/2 top-24 h-[330px] w-[330px] -translate-x-1/2 rounded-full border border-rose-100/70" />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-16 h-[380px] w-[380px] -translate-x-1/2 rounded-full border border-transparent border-r-rose-200/60 border-t-rose-300/70"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-3 h-[500px] w-[500px] -translate-x-1/2 rounded-full border border-transparent border-b-pink-200/60 border-l-rose-200/60"
        />

        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mt-1 flex h-20 w-20 items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-rose-300"
            />

            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-700 text-white"
            >
              <Heart size={23} fill="currentColor" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="relative mt-2 w-full max-w-[420px]"
          >
            <img
              src={coupleAttendanceImage}
              alt="Kevin Andrews and Jenith Silviya"
              className="mx-auto h-auto w-full max-w-[390px] object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.24 }}
            className="mt-4 flex w-full max-w-md items-center gap-3"
          >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-200 to-rose-300" />
            <p className="text-center text-[11px] font-black uppercase tracking-[0.22em] text-gray-950">
              Kevin Andrews & Jenith Silviya
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-rose-300 via-rose-200 to-transparent" />
          </motion.div>

          <div className="relative mt-8 w-full max-w-md">
            <div className="absolute left-1/2 top-7 h-32 w-px -translate-x-1/2 bg-gradient-to-b from-rose-200 via-rose-400 to-rose-200" />

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="relative flex items-center justify-start"
            >
              <div className="w-[46%] text-right">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-rose-600">
                  Engagement
                </p>
                <h4 className="mt-1 text-2xl font-black text-gray-950">
                  21 June 2025
                </h4>
                <p className="mt-0.5 text-sm font-semibold text-gray-500">
                  The promise begins
                </p>
              </div>

              <div className="mx-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-700">
                <Heart size={19} fill="currentColor" />
              </div>

              <div className="w-[46%]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="relative mt-8 flex items-center justify-end"
            >
              <div className="w-[46%]" />

              <div className="mx-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-700">
                <CalendarDays size={19} />
              </div>

              <div className="w-[46%] text-left">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-rose-600">
                  Marriage
                </p>
                <h4 className="mt-1 text-2xl font-black text-gray-950">
                  25 June 2025
                </h4>
                <p className="mt-0.5 text-sm font-semibold text-gray-500">
                  The journey continues
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </aside>
  );
};

const GuestAttendanceForm = ({
  formData,
  handleChange,
  handleCustomSelectChange,
  handleSubmit,
  successMessage,
  errorMessage,
  isPending,
}) => {
  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-[2rem] border border-rose-100 bg-gradient-to-br from-rose-50/80 via-white to-rose-50/60 p-3 backdrop-blur-xl sm:rounded-[2.4rem] sm:p-5 md:p-6 lg:rounded-[2.75rem] lg:p-7"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/70 via-transparent to-white/50 sm:rounded-[2.4rem] lg:rounded-[2.75rem]" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="relative">
        <div className="relative overflow-hidden rounded-[1.65rem] border border-white/15 bg-gradient-to-br from-gray-950 via-gray-900 to-rose-950 px-4 py-5 text-white sm:rounded-[2rem] sm:px-6 sm:py-7 md:px-8 lg:rounded-[2.15rem]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.075)_1px,transparent_1px)] bg-[size:30px_30px]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/12 px-3.5 py-2 text-xs font-bold text-rose-100 backdrop-blur-xl sm:px-4 sm:text-sm">
                <MessageCircleHeart size={15} />
                Attendance Details
              </p>

              <h3 className="mt-4 max-w-xl text-2xl font-black leading-tight tracking-tight text-white sm:mt-5 sm:text-3xl md:text-4xl">
                Share your attendance response
              </h3>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-white/70 sm:text-base sm:leading-7">
                Enter your details below and help us plan the celebration beautifully.
              </p>
            </div>

            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-[1.45rem] bg-white text-rose-700 sm:flex"
            >
              <Check size={28} />
            </motion.div>
          </div>
        </div>

        <div className="mt-4 rounded-[1.65rem] border border-white/80 bg-white/55 p-3 backdrop-blur-xl sm:mt-6 sm:rounded-[2rem] sm:p-4 md:p-5 lg:mt-7 lg:rounded-[2.15rem]">
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <div>
              <label className={labelClass}>Your Name *</label>
              <div className="relative">
                <UserRound size={19} strokeWidth={2.4} className={inputIconClass} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`${inputClass} pl-11 sm:pl-12`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Phone Number *</label>
              <div className="relative">
                <Phone size={19} strokeWidth={2.4} className={inputIconClass} />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={`${inputClass} pl-11 sm:pl-12`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email Optional</label>
              <div className="relative">
                <Mail size={19} strokeWidth={2.4} className={inputIconClass} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className={`${inputClass} pl-11 sm:pl-12`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Guest Count *</label>
              <div className="relative">
                <Users size={19} strokeWidth={2.4} className={inputIconClass} />
                <input
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  min="1"
                  className={`${inputClass} pl-11 sm:pl-12`}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-5 lg:mt-6">
            <CustomSelect
              label="Event *"
              value={formData.event}
              onChange={(value) => handleCustomSelectChange("event", value)}
              options={eventOptions}
            />

            <CustomSelect
              label="Will You Attend? *"
              value={formData.attending}
              onChange={(value) => handleCustomSelectChange("attending", value)}
              options={attendanceOptions}
            />
          </div>

          <div className="mt-5 lg:mt-6">
            <label className={labelClass}>Message Optional</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your blessing or message"
              rows="4"
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-start gap-3 rounded-[1.25rem] border border-green-200 bg-green-50 px-4 py-3.5 text-sm text-green-800 sm:mt-5 sm:rounded-[1.35rem] sm:px-5 sm:py-4 sm:text-base"
          >
            <Check size={19} className="mt-0.5 shrink-0" />
            <p className="font-bold">{successMessage}</p>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-700 sm:mt-5 sm:rounded-[1.35rem] sm:px-5 sm:py-4 sm:text-base"
          >
            {errorMessage}
          </motion.div>
        )}

        <div className="mt-5 flex flex-col gap-4 sm:mt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm text-sm font-semibold leading-6 text-gray-500">
            Your response helps us prepare the celebration with care.
          </p>

          <button
            type="submit"
            disabled={isPending}
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-rose-700 px-6 py-3.5 font-black text-white transition hover:-translate-y-0.5 hover:bg-gray-950 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-14 sm:w-auto sm:min-w-[230px] sm:px-7 sm:py-4"
          >
            {isPending ? "Submitting..." : "Submit Attendance"}
            <Send size={18} className="transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.form>
  );
};

const GuestResponse = () => {
  const [formData, setFormData] = useState(InitialFormData);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createGuestResponseMutation = useCreateGuestResponse();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleCustomSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      const message = "Please enter your name.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (!formData.phone.trim()) {
      const message = "Please enter your phone number.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (Number(formData.guestCount) < 1) {
      const message = "Guest count should be at least 1.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      attending: formData.attending === "true",
      guestCount: Number(formData.guestCount),
      event: formData.event,
      message: formData.message,
    };

    createGuestResponseMutation.mutate(payload, {
      onSuccess: () => {
        const message = "Your attendance response has been submitted successfully.";

        toast.success(message);
        setSuccessMessage(message);
        setErrorMessage("");
        setFormData(InitialFormData);
      },

      onError: (error) => {
        const message =
          error?.response?.data?.message ||
          "Failed to submit your attendance response.";

        setErrorMessage(message);
        setSuccessMessage("");
        toast.error(message);
      },
    });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-white px-4 pb-12 pt-5 sm:px-5 sm:pb-14 sm:pt-6 md:px-6 md:pb-16 md:pt-7 lg:pb-20 lg:pt-8">
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-rose-50/70 blur-3xl lg:hidden" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          label="Guest Attendance"
          title="Confirm Your Attendance"
          description="Kindly let us know whether you will be joining us for our celebration."
        />

        <MobileAttendanceIntro />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="mt-6 grid items-start gap-6 sm:mt-8 md:gap-8 lg:mt-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10"
        >
          <DesktopAttendanceVisual />

          <GuestAttendanceForm
            formData={formData}
            handleChange={handleChange}
            handleCustomSelectChange={handleCustomSelectChange}
            handleSubmit={handleSubmit}
            successMessage={successMessage}
            errorMessage={errorMessage}
            isPending={createGuestResponseMutation.isPending}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default GuestResponse;