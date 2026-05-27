import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bug, Code2, Heart } from "lucide-react";

import developerBoy from "../../assets/developer-boy.webp";
import testerGirl from "../../assets/tester-girl.webp";
import cupid from "../../assets/cupid.webp";

const DeveloperTesterSection = () => {
  return (
    <section className="relative overflow-hidden bg-white px-4 py-7 sm:py-9 md:py-10 lg:py-8 xl:py-12">
      <div className="absolute inset-0 bg-white" />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[1.75rem] border border-rose-100 bg-white shadow-[0_20px_60px_rgba(244,63,94,0.08)] sm:rounded-[2.1rem] md:rounded-[2.3rem] lg:rounded-[2.6rem]"
        >
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,244,246,0.92)_100%)]" />
          <div className="pointer-events-none absolute inset-[1px] rounded-[calc(1.75rem-1px)] bg-[radial-gradient(circle_at_18%_48%,rgba(244,63,94,0.10),transparent_25%),radial-gradient(circle_at_82%_48%,rgba(236,72,153,0.10),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,244,246,0.72)_55%,rgba(255,255,255,0.96)_100%)] sm:rounded-[calc(2.1rem-1px)] md:rounded-[calc(2.3rem-1px)] lg:rounded-[calc(2.6rem-1px)]" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white/90" />
          <div className="pointer-events-none absolute left-8 right-8 top-3 h-16 rounded-full bg-white/60 blur-2xl" />
          <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-rose-100/35 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-8 h-56 w-56 rounded-full bg-pink-100/30 blur-3xl" />
          <div className="pointer-events-none absolute left-0 top-0 h-full w-14 bg-gradient-to-r from-rose-50/45 to-transparent sm:w-20" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-14 bg-gradient-to-l from-rose-50/45 to-transparent sm:w-20" />

          <div className="relative z-20 grid grid-cols-2 items-start gap-x-3 gap-y-6 px-4 py-6 sm:gap-x-5 sm:gap-y-7 sm:px-6 sm:py-7 md:gap-x-7 md:px-8 md:py-8 lg:grid-cols-[0.8fr_1fr_0.8fr] lg:items-center lg:gap-4 lg:px-8 lg:py-8 xl:grid-cols-[0.84fr_1fr_0.84fr] xl:gap-6 xl:px-12 xl:py-10">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="order-2 col-span-1 flex min-w-0 flex-col items-center lg:order-1"
            >
              <div className="relative w-full max-w-[145px] min-[390px]:max-w-[160px] sm:max-w-[190px] md:max-w-[235px] lg:max-w-[210px] xl:max-w-[255px]">
                <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-100/55 blur-3xl sm:h-36 sm:w-36 md:h-40 md:w-40 xl:h-44 xl:w-44" />

                <img
                  src={developerBoy}
                  alt="Developer groom illustration"
                  draggable="false"
                  className="relative z-10 block w-full select-none object-contain drop-shadow-[0_18px_30px_rgba(244,63,94,0.10)]"
                />
              </div>

              <div className="relative mt-3 w-full max-w-[142px] overflow-visible rounded-[1.2rem] border border-rose-100 bg-white/90 px-3 pb-3 pt-7 text-center shadow-[0_12px_28px_rgba(244,63,94,0.09)] backdrop-blur-2xl sm:max-w-[165px] sm:rounded-[1.35rem] sm:px-4 sm:pt-8 md:max-w-[185px] md:rounded-[1.45rem] lg:max-w-[175px] xl:mt-5 xl:max-w-[190px] xl:rounded-[1.6rem] xl:pb-4 xl:pt-9">
                <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-white/90" />
                <div className="pointer-events-none absolute left-4 right-4 top-3 h-10 rounded-full bg-white/70 blur-xl" />

                <div className="absolute -top-5 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/45 bg-gradient-to-br from-rose-700 via-red-600 to-pink-500 text-white shadow-[inset_2px_2px_5px_rgba(255,255,255,0.3),inset_-3px_-4px_8px_rgba(136,19,55,0.22),0_10px_20px_rgba(244,63,94,0.16)] sm:-top-6 sm:h-[46px] sm:w-[46px] xl:-top-7 xl:h-[50px] xl:w-[50px]">
                  <Code2 size={19} className="sm:h-[21px] sm:w-[21px] xl:h-[23px] xl:w-[23px]" />
                </div>

                <h3 className="relative z-10 font-['Playfair_Display',serif] text-[1.05rem] font-black leading-tight text-rose-800 sm:text-[1.18rem] md:text-[1.25rem] xl:text-[1.45rem]">
                  Developer
                </h3>

                <p className="relative z-10 mt-1 font-['Playfair_Display',serif] text-[11px] font-semibold leading-snug text-gray-700 sm:text-[12px] md:text-[13px] xl:text-sm">
                  Building the future
                </p>

                <Heart
                  size={12}
                  fill="#be123c"
                  className="relative z-10 mx-auto mt-2 text-rose-700"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.75 }}
              className="order-1 col-span-2 flex min-w-0 flex-col items-center text-center lg:order-2 lg:col-span-1"
            >
              <div className="relative flex w-full flex-col items-center">
                <motion.img
                  src={cupid}
                  alt="Cupid"
                  draggable="false"
                  className="absolute right-[6%] top-[-10px] z-20 hidden w-12 select-none drop-shadow-xl md:block lg:right-[7%] lg:top-[-4px] lg:w-12 xl:right-[5%] xl:top-[-8px] xl:w-16"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, -3, 0],
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="mx-auto flex w-full max-w-[355px] flex-col items-center sm:max-w-[430px] md:max-w-[470px] lg:max-w-[420px] xl:max-w-[500px]">
                  <h2 className="w-full text-center font-['Playfair_Display',serif] text-[2.45rem] font-black leading-[0.9] tracking-tight text-rose-800 drop-shadow-sm min-[390px]:text-[2.75rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[3.45rem] xl:text-[4.65rem]">
                    Developer
                  </h2>

                  <div className="my-0.5 flex w-full items-center justify-center gap-3 xl:my-1 xl:gap-4">
                    <span className="hidden h-px w-12 bg-gradient-to-r from-transparent via-rose-300 to-transparent sm:block md:w-16 lg:w-12 xl:w-16" />

                    <p className="text-center font-['Great_Vibes',cursive] text-[2.05rem] leading-none text-rose-500 min-[390px]:text-[2.35rem] sm:text-[2.85rem] md:text-[3.2rem] lg:text-[2.7rem] xl:text-[3.5rem]">
                      Weds
                    </p>

                    <span className="hidden h-px w-12 bg-gradient-to-r from-transparent via-rose-300 to-transparent sm:block md:w-16 lg:w-12 xl:w-16" />
                  </div>

                  <h2 className="w-full text-center font-['Playfair_Display',serif] text-[2.45rem] font-black leading-[0.9] tracking-tight text-rose-800 drop-shadow-sm min-[390px]:text-[2.75rem] sm:text-[3.25rem] md:text-[3.75rem] lg:text-[3.45rem] xl:text-[4.65rem]">
                    Tester
                  </h2>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-center gap-3 xl:mt-4">
                <span className="h-px w-12 bg-rose-200 sm:w-14 xl:w-16" />
                <Heart size={15} fill="#be123c" className="text-rose-700" />
                <span className="h-px w-12 bg-rose-200 sm:w-14 xl:w-16" />
              </div>

              <div className="mt-2 w-full max-w-[330px] sm:max-w-[390px] md:max-w-[420px] lg:max-w-[390px] xl:mt-4 xl:max-w-[450px]">
                <svg
                  viewBox="0 0 620 145"
                  className="mx-auto h-[62px] w-full overflow-visible sm:h-[78px] md:h-[90px] lg:h-[78px] xl:h-[104px]"
                  fill="none"
                >
                  <defs>
                    <filter
                      id="developerTesterSoftStarWave"
                      x="-100%"
                      y="-100%"
                      width="300%"
                      height="300%"
                    >
                      <feGaussianBlur stdDeviation="2.6" result="blur" />
                      <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="1 0 0 0 1
                                0 1 0 0 1
                                0 0 1 0 1
                                0 0 0 0.9 0"
                        result="whiteGlow"
                      />
                      <feMerge>
                        <feMergeNode in="whiteGlow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    <filter
                      id="developerTesterHeartGlow"
                      x="-60%"
                      y="-60%"
                      width="220%"
                      height="220%"
                    >
                      <feGaussianBlur stdDeviation="5.5" result="blur" />
                      <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="1 0 0 0 0.93
                                0 0.18 0 0 0.05
                                0 0 0.28 0 0.22
                                0 0 0 0.82 0"
                        result="heartGlow"
                      />
                      <feMerge>
                        <feMergeNode in="heartGlow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <path
                    d="M12 72 H78 L92 72 L104 56 L118 98 L134 32 L152 108 L170 72 H238"
                    stroke="#e11d48"
                    strokeWidth="5.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M382 72 H448 L462 34 L480 108 L496 54 L512 94 L528 72 H608"
                    stroke="#e11d48"
                    strokeWidth="5.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <g
                    transform="translate(310 72)"
                    filter="url(#developerTesterHeartGlow)"
                  >
                    <g>
                      <animateTransform
                        attributeName="transform"
                        type="scale"
                        values="1;1;1;1.055;0.988;1.018;1"
                        keyTimes="0;0.74;0.8;0.845;0.89;0.94;1"
                        dur="9s"
                        repeatCount="indefinite"
                      />

                      <path
                        d="M0 48 C-48 10 -72 -18 -69 -41 C-66 -64 -33 -70 0 -33 C33 -70 66 -64 69 -41 C72 -18 48 10 0 48Z"
                        stroke="#ef233c"
                        strokeWidth="5.2"
                        fill="rgba(255,255,255,0.55)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>

                  <g filter="url(#developerTesterSoftStarWave)">
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0;0;0;0;0;0"
                      keyTimes="0;0.04;0.31;0.35;0.4;0.44;0.48;0.78;1"
                      dur="9s"
                      repeatCount="indefinite"
                    />

                    <animateMotion
                      dur="9s"
                      repeatCount="indefinite"
                      calcMode="linear"
                      keyPoints="0;1;1"
                      keyTimes="0;0.35;1"
                      path="M12 72 H78 L92 72 L104 56 L118 98 L134 32 L152 108 L170 72 H238"
                    />

                    <circle r="1.8" fill="#ffffff" />

                    <circle r="3.8" fill="#ffffff" opacity="0.2">
                      <animate
                        attributeName="r"
                        values="3.2;5.2;3.5"
                        dur="1.15s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.34;0.08;0.24"
                        dur="1.15s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    <circle
                      r="6"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.75"
                    >
                      <animate
                        attributeName="r"
                        values="4.6;7.2;4.8"
                        dur="1.15s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.34;0;0.2"
                        dur="1.15s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>

                  <g filter="url(#developerTesterSoftStarWave)">
                    <animate
                      attributeName="opacity"
                      values="0;0;0;1;1;0;0"
                      keyTimes="0;0.37;0.4;0.43;0.78;0.82;1"
                      dur="9s"
                      repeatCount="indefinite"
                    />

                    <animateMotion
                      dur="9s"
                      repeatCount="indefinite"
                      calcMode="linear"
                      keyPoints="0;0;1;1"
                      keyTimes="0;0.4;0.8;1"
                      path="M382 72 H448 L462 34 L480 108 L496 54 L512 94 L528 72 H608"
                    />

                    <circle r="1.8" fill="#ffffff" />

                    <circle r="3.8" fill="#ffffff" opacity="0.2">
                      <animate
                        attributeName="r"
                        values="3.2;5.2;3.5"
                        dur="1.15s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.34;0.08;0.24"
                        dur="1.15s"
                        repeatCount="indefinite"
                      />
                    </circle>

                    <circle
                      r="6"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.75"
                    >
                      <animate
                        attributeName="r"
                        values="4.6;7.2;4.8"
                        dur="1.15s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.34;0;0.2"
                        dur="1.15s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                </svg>
              </div>

              <div className="mt-1 flex w-full justify-center">
                <p className="mx-auto block w-full max-w-[330px] text-center font-['Great_Vibes',cursive] text-[1rem] leading-[1.38] text-rose-700 min-[390px]:text-[1.08rem] sm:max-w-[410px] sm:text-[1.22rem] md:max-w-[430px] md:text-[1.32rem] lg:max-w-[380px] lg:text-[1.1rem] xl:max-w-[450px] xl:text-[1.48rem]">
                  From debugging bugs to building dreams, our forever begins
                  here.
                </p>
              </div>

              <Link
                to="/guest-response"
                className="group mt-4 inline-flex w-full max-w-[290px] items-center justify-center gap-3 rounded-full border border-white/40 bg-gradient-to-r from-rose-700 via-red-600 to-pink-500 px-5 py-3 font-['Playfair_Display',serif] text-[0.95rem] font-black text-white shadow-[inset_2px_2px_5px_rgba(255,255,255,0.28),inset_-4px_-5px_10px_rgba(136,19,55,0.22),0_14px_28px_rgba(244,63,94,0.18)] transition duration-300 hover:scale-[1.03] sm:w-auto sm:max-w-none sm:px-7 sm:text-base xl:px-8 xl:py-3.5 xl:text-lg"
              >
                <Heart size={19} fill="white" />
                Join Our Celebration
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="order-3 col-span-1 flex min-w-0 flex-col items-center"
            >
              <div className="relative w-full max-w-[145px] min-[390px]:max-w-[160px] sm:max-w-[190px] md:max-w-[235px] lg:max-w-[210px] xl:max-w-[255px]">
                <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-100/60 blur-3xl sm:h-36 sm:w-36 md:h-40 md:w-40 xl:h-44 xl:w-44" />

                <img
                  src={testerGirl}
                  alt="Tester bride illustration"
                  draggable="false"
                  className="relative z-10 block w-full select-none object-contain drop-shadow-[0_18px_30px_rgba(244,63,94,0.10)]"
                />
              </div>

              <div className="relative mt-3 w-full max-w-[142px] overflow-visible rounded-[1.2rem] border border-rose-100 bg-white/90 px-3 pb-3 pt-7 text-center shadow-[0_12px_28px_rgba(244,63,94,0.09)] backdrop-blur-2xl sm:max-w-[165px] sm:rounded-[1.35rem] sm:px-4 sm:pt-8 md:max-w-[185px] md:rounded-[1.45rem] lg:max-w-[175px] xl:mt-5 xl:max-w-[190px] xl:rounded-[1.6rem] xl:pb-4 xl:pt-9">
                <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-white/90" />
                <div className="pointer-events-none absolute left-4 right-4 top-3 h-10 rounded-full bg-white/70 blur-xl" />

                <div className="absolute -top-5 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/45 bg-gradient-to-br from-rose-700 via-red-600 to-pink-500 text-white shadow-[inset_2px_2px_5px_rgba(255,255,255,0.3),inset_-3px_-4px_8px_rgba(136,19,55,0.22),0_10px_20px_rgba(244,63,94,0.16)] sm:-top-6 sm:h-[46px] sm:w-[46px] xl:-top-7 xl:h-[50px] xl:w-[50px]">
                  <Bug size={19} className="sm:h-[21px] sm:w-[21px] xl:h-[23px] xl:w-[23px]" />
                </div>

                <h3 className="relative z-10 font-['Playfair_Display',serif] text-[1.05rem] font-black leading-tight text-rose-800 sm:text-[1.18rem] md:text-[1.25rem] xl:text-[1.45rem]">
                  Tester
                </h3>

                <p className="relative z-10 mt-1 font-['Playfair_Display',serif] text-[11px] font-semibold leading-snug text-gray-700 sm:text-[12px] md:text-[13px] xl:text-sm">
                  Finding perfection
                </p>

                <Heart
                  size={12}
                  fill="#be123c"
                  className="relative z-10 mx-auto mt-2 text-rose-700"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeveloperTesterSection;