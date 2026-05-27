import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  CalendarDays,
  ChevronRight,
  Heart,
  HelpCircle,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
  UserRound,
  Vote,
  X,
} from "lucide-react";

import { useCreateChatbotMessage } from "../../hooks/useChatbot";

const quickReplies = [
  {
    id: "events",
    label: "Event details",
    icon: CalendarDays,
    type: "answer",
    answer:
      "Our celebration includes Engagement on 21 June 2025, Wedding on 25 June 2025, and Reception on 25 June 2025. Please open the Events page for full address and map details.",
  },
  {
    id: "location",
    label: "Location help",
    icon: MapPin,
    type: "answer",
    answer:
      "You can open the Events page and tap the location button for each venue. It will guide you directly through Google Maps.",
  },
  {
    id: "attendance",
    label: "Attendance help",
    icon: UserRound,
    type: "answer",
    answer:
      "To confirm attendance, open the Attendance page, enter your details, choose whether you are attending, and submit.",
  },
  {
    id: "circle",
    label: "Circle of Love",
    icon: Heart,
    type: "answer",
    answer:
      "Circle of Love is where guests can share how they are connected with Kevin or Jenith. After admin approval, it appears beautifully on the website.",
  },
  {
    id: "polls",
    label: "Couple Polls",
    icon: Vote,
    type: "answer",
    answer:
      "Couple Polls lets guests vote between Kevin and Jenith for fun questions. You can vote once for each question and see live percentages.",
  },
  {
    id: "suggestion",
    label: "Give suggestion",
    icon: Sparkles,
    type: "form",
    formType: "suggestion",
  },
  {
    id: "question",
    label: "Ask question",
    icon: HelpCircle,
    type: "form",
    formType: "question",
  },
];

const initialMessages = [
  {
    id: "welcome",
    from: "bot",
    text: "Hi! I’m your Wedding Assistant. I can help with events, location, attendance, polls, Circle of Love, and website suggestions.",
  },
];

const messageTypeLabels = {
  suggestion: "Website Suggestion",
  question: "Guest Question",
  issue: "Website Issue",
  appreciation: "Appreciation",
  general: "General Message",
};

const panelVariants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.95,
    transformOrigin: "bottom right",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 310,
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.95,
    transition: {
      duration: 0.18,
      ease: "easeOut",
    },
  },
};

const messageVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 470,
      damping: 32,
    },
  },
};

const WeddingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [activeFormType, setActiveFormType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
    type: "suggestion",
  });

  const createMessageMutation = useCreateChatbotMessage();
  const latestMessageRef = useRef(null);

  const panelTitle = useMemo(() => {
    if (!activeFormType) return "Wedding Assistant";
    return messageTypeLabels[activeFormType] || "Send Message";
  }, [activeFormType]);

  const panelSubTitle = useMemo(() => {
    if (activeFormType === "suggestion") return "Share your website suggestion";
    if (activeFormType === "question") return "Ask your wedding question";
    return "Kevin & Jenith wedding help desk";
  }, [activeFormType]);

  const scrollToLatestMessage = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        latestMessageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      });
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    scrollToLatestMessage();
  }, [messages, activeFormType, isOpen]);

  const addMessage = (message) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length}`,
        ...message,
      },
    ]);
  };

  const handleQuickReply = (reply) => {
    addMessage({
      from: "guest",
      text: reply.label,
    });

    if (reply.type === "form") {
      setActiveFormType(reply.formType);
      setFormData((prev) => ({
        ...prev,
        type: reply.formType,
        message: "",
      }));

      addMessage({
        from: "bot",
        text:
          reply.formType === "suggestion"
            ? "Sure, share your website suggestion. I will send it safely to the admin panel."
            : "Sure, type your question. The couple/admin can review it from the admin panel.",
      });

      return;
    }

    setActiveFormType(null);

    addMessage({
      from: "bot",
      text: reply.answer,
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();

    const cleanMessage = formData.message.trim();

    if (cleanMessage.length < 3) {
      toast.error("Please enter a proper message");
      return;
    }

    try {
      await createMessageMutation.mutateAsync({
        name: formData.name.trim() || "Guest",
        phone: formData.phone.trim(),
        message: cleanMessage,
        type: activeFormType || formData.type || "general",
      });

      addMessage({
        from: "guest",
        text: cleanMessage,
      });

      addMessage({
        from: "bot",
        text: "Thank you! Your message has been safely sent to the couple/admin.",
      });

      toast.success("Message sent successfully");

      setFormData((prev) => ({
        ...prev,
        message: "",
      }));

      setActiveFormType(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to send your message now"
      );
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close wedding assistant overlay"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="
                fixed left-0 right-0 bottom-0 z-[60]
                top-16 bg-slate-950/12 backdrop-blur-[2px]
                sm:top-[4.5rem]
                lg:hidden
              "
            />

            <motion.div
              key="wedding-assistant-panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="
                fixed z-[90] overflow-hidden
                rounded-[1.55rem] border border-white/65
                bg-white/72 shadow-[0_26px_90px_rgba(15,23,42,0.22)]
                backdrop-blur-2xl ring-1 ring-white/55

                left-3 right-3
                top-[calc(4rem+0.75rem)]
                bottom-[calc(5.45rem+env(safe-area-inset-bottom))]

                sm:left-auto sm:right-5
                sm:top-[calc(4.5rem+0.85rem)]
                sm:w-[min(24rem,calc(100vw-2.5rem))]

                md:bottom-[calc(5.8rem+env(safe-area-inset-bottom))]

                lg:left-auto lg:right-6 lg:top-auto
                lg:bottom-[calc(5.95rem+env(safe-area-inset-bottom))]
                lg:h-[min(520px,calc(100dvh-11.25rem))]
                lg:w-[23.75rem]

                xl:w-[24rem]
              "
            >
              <div className="flex h-full min-h-0 flex-col">
                <div className="relative overflow-hidden border-b border-white/55 bg-white/55 p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-200/45 via-white/25 to-cyan-200/45" />
                  <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-fuchsia-300/30 blur-3xl" />
                  <div className="absolute -bottom-24 -left-16 h-44 w-44 rounded-full bg-cyan-300/24 blur-3xl" />

                  <div className="relative z-10 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/75 bg-slate-950 text-white shadow-sm">
                          <MessageSquare size={20} strokeWidth={2.35} />
                        </div>

                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-semibold leading-tight text-slate-950">
                          {panelTitle}
                        </h3>

                        <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                          {panelSubTitle}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="
                        flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                        text-slate-600 transition hover:bg-white/70 hover:text-slate-950
                      "
                      aria-label="Close wedding assistant"
                    >
                      <X size={17} />
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-white/25 via-white/50 to-white/70 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="space-y-4 p-4">
                    {messages.map((message, index) => {
                      const isGuest = message.from === "guest";
                      const isLatestMessage = index === messages.length - 1;

                      return (
                        <motion.div
                          key={message.id}
                          ref={isLatestMessage ? latestMessageRef : null}
                          variants={messageVariants}
                          className={`flex gap-3 ${
                            isGuest ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-sm ${
                              isGuest
                                ? "border-slate-900/10 bg-slate-950 text-white"
                                : "border-white/70 bg-white/75 text-slate-700"
                            }`}
                          >
                            {isGuest ? (
                              <UserRound size={15} strokeWidth={2.2} />
                            ) : (
                              <MessageSquare size={15} strokeWidth={2.25} />
                            )}
                          </div>

                          <div
                            className={`flex max-w-[85%] flex-col gap-1 ${
                              isGuest ? "items-end" : "items-start"
                            }`}
                          >
                            {!isGuest && (
                              <span className="text-xs font-medium text-slate-400">
                                Wedding Assistant
                              </span>
                            )}

                            <div
                              className={`rounded-2xl px-4 py-2.5 text-sm font-medium leading-5 shadow-sm backdrop-blur-sm ${
                                isGuest
                                  ? "rounded-tr-none bg-slate-950 text-white"
                                  : "rounded-tl-none border border-white/70 bg-white/72 text-slate-700"
                              }`}
                            >
                              {message.text}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    <div className="rounded-2xl border border-white/70 bg-white/62 p-3 shadow-sm backdrop-blur-xl">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                            Quick Help
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-slate-800">
                            Tap what you need
                          </p>
                        </div>

                        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black text-white">
                          {quickReplies.length}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-2">
                        {quickReplies.map((reply) => {
                          const Icon = reply.icon;

                          return (
                            <button
                              key={reply.id}
                              type="button"
                              onClick={() => handleQuickReply(reply)}
                              className="
                                group flex min-h-11 items-center justify-between gap-2
                                rounded-2xl border border-white/70 bg-white/68 px-3 py-2
                                text-left text-xs font-black text-slate-700 shadow-sm
                                backdrop-blur-xl transition
                                hover:-translate-y-0.5 hover:bg-slate-950 hover:text-white
                              "
                            >
                              <span className="flex min-w-0 items-center gap-2">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-white/15 group-hover:text-white">
                                  <Icon size={14} />
                                </span>

                                <span className="truncate">{reply.label}</span>
                              </span>

                              <ChevronRight
                                size={14}
                                className="shrink-0 text-slate-400 transition group-hover:text-white"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {activeFormType && (
                      <form
                        onSubmit={handleSubmitMessage}
                        className="rounded-2xl border border-white/70 bg-white/68 p-3 shadow-sm backdrop-blur-xl"
                      >
                        <div className="mb-3">
                          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                            {activeFormType === "suggestion"
                              ? "Suggestion Form"
                              : "Question Form"}
                          </p>
                          <p className="mt-0.5 text-xs font-bold text-slate-800">
                            This will be sent to admin
                          </p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            placeholder="Your name"
                            className="
                              h-10 rounded-full border border-white/75 bg-white/70 px-3.5
                              text-xs font-bold text-slate-800 outline-none transition
                              placeholder:text-slate-400
                              focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100
                            "
                          />

                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            placeholder="Phone optional"
                            className="
                              h-10 rounded-full border border-white/75 bg-white/70 px-3.5
                              text-xs font-bold text-slate-800 outline-none transition
                              placeholder:text-slate-400
                              focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100
                            "
                          />
                        </div>

                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleFormChange}
                          rows={3}
                          placeholder={
                            activeFormType === "suggestion"
                              ? "Type your website suggestion..."
                              : "Type your question..."
                          }
                          className="
                            mt-2 w-full resize-none rounded-[1.15rem] border border-white/75
                            bg-white/70 px-3.5 py-3 text-xs font-bold leading-5 text-slate-800
                            outline-none transition placeholder:text-slate-400
                            focus:border-cyan-300 focus:bg-white focus:ring-2 focus:ring-cyan-100
                          "
                        />

                        <button
                          type="submit"
                          disabled={createMessageMutation.isPending}
                          className="
                            mt-2 inline-flex h-10 w-full items-center justify-center gap-2
                            rounded-full bg-slate-950 px-5 text-xs font-black text-white
                            shadow-lg shadow-slate-900/10 transition hover:bg-cyan-700
                            disabled:cursor-not-allowed disabled:opacity-60
                          "
                        >
                          {createMessageMutation.isPending ? (
                            "Sending..."
                          ) : (
                            <>
                              <Send size={15} />
                              Send to Admin
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            group relative flex h-14 w-14 cursor-pointer items-center justify-center
            rounded-full text-white shadow-2xl transition-all duration-300
            ${
              isOpen
                ? "rotate-90 bg-red-600"
                : "bg-slate-950 hover:shadow-slate-900/25"
            }
          `}
          aria-label={
            isOpen ? "Close wedding assistant" : "Open wedding assistant"
          }
        >
          <span className="absolute inset-0 -z-10 rounded-full bg-inherit opacity-20 blur-xl transition-opacity duration-300 group-hover:opacity-40" />

          {isOpen ? (
            <X size={24} className="text-white" strokeWidth={2.35} />
          ) : (
            <MessageSquare size={24} strokeWidth={2.35} />
          )}
        </motion.button>
      </div>
    </>
  );
};

export default WeddingAssistant;