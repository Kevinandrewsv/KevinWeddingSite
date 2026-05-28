import { motion } from "framer-motion";

import developerBoy from "../../assets/developer-boy.png";
import testerGirl from "../../assets/tester-girl.png";
import infiniteLogo from "../../assets/infinite-logo.png";
import centerText from "../../assets/center text.png";
import bottomMiddleLogos from "../../assets/bottom middle logos.png";

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
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(115deg,rgba(250,246,255,0.96)_0%,rgba(255,255,255,0.99)_24%,rgba(255,255,255,1)_50%,rgba(255,245,248,0.96)_78%,rgba(255,249,251,0.99)_100%)]" />

          <div className="pointer-events-none absolute inset-[1px] rounded-[calc(1.75rem-1px)] bg-[radial-gradient(circle_at_18%_50%,rgba(124,58,237,0.13),transparent_27%),radial-gradient(circle_at_83%_50%,rgba(244,63,94,0.14),transparent_28%),radial-gradient(circle_at_50%_76%,rgba(236,72,153,0.07),transparent_28%)] sm:rounded-[calc(2.1rem-1px)] md:rounded-[calc(2.3rem-1px)] lg:rounded-[calc(2.6rem-1px)]" />

          <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-[34%] opacity-45 lg:block">
            <div className="absolute left-[-7rem] top-[-5rem] h-80 w-80 rounded-full border border-violet-200/45" />
            <div className="absolute left-[-5rem] top-[-3rem] h-72 w-72 rounded-full border border-violet-200/30" />
            <div className="absolute left-[-3rem] top-[-1rem] h-64 w-64 rounded-full border border-violet-200/20" />
          </div>

          <div className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[34%] opacity-40 lg:block">
            <div className="absolute bottom-[-7rem] right-[-7rem] h-80 w-80 rounded-full border border-pink-200/45" />
            <div className="absolute bottom-[-5rem] right-[-5rem] h-72 w-72 rounded-full border border-pink-200/30" />
            <div className="absolute bottom-[-3rem] right-[-3rem] h-64 w-64 rounded-full border border-pink-200/20" />
          </div>

          <div className="pointer-events-none absolute left-6 top-6 h-2 w-2 rounded-full bg-violet-400/70 shadow-[0_0_18px_rgba(139,92,246,0.45)]" />
          <div className="pointer-events-none absolute left-[29%] top-14 h-1.5 w-1.5 rounded-full bg-fuchsia-400/60" />
          <div className="pointer-events-none absolute right-[24%] top-16 h-2 w-2 rounded-full bg-rose-400/60" />
          <div className="pointer-events-none absolute bottom-9 left-16 h-3 w-3 rounded-full bg-violet-500/65" />
          <div className="pointer-events-none absolute bottom-14 right-20 h-2 w-2 rounded-full bg-rose-400/70" />

          {/* Desktop / large screens */}
          <div className="relative z-20 hidden h-[560px] overflow-hidden px-8 py-8 lg:block xl:h-[610px] xl:px-12 xl:py-10">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.75 }}
              className="absolute left-1/2 top-[7.2%] z-20 flex h-[145px] w-[27%] max-w-[320px] -translate-x-1/2 items-center justify-center xl:top-[6.8%] xl:h-[168px] xl:max-w-[365px]"
            >
              <img
                src={infiniteLogo}
                alt="Infinite developer tester logo"
                draggable="false"
                className="block max-h-full w-full select-none object-contain drop-shadow-[0_12px_26px_rgba(236,72,153,0.12)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.75, delay: 0.08 }}
              className="absolute left-[7%] top-[27%] z-20 flex h-[280px] w-[25.5%] max-w-[290px] items-center justify-center xl:left-[7.2%] xl:top-[26%] xl:h-[315px] xl:max-w-[325px]"
            >
              <img
                src={developerBoy}
                alt="Developer illustration"
                draggable="false"
                className="block max-h-full w-full select-none object-contain drop-shadow-[0_20px_35px_rgba(79,70,229,0.16)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.75, delay: 0.12 }}
              className="absolute right-[7%] top-[27%] z-20 flex h-[280px] w-[25.5%] max-w-[290px] items-center justify-center xl:right-[7.2%] xl:top-[26%] xl:h-[315px] xl:max-w-[325px]"
            >
              <img
                src={testerGirl}
                alt="Tester illustration"
                draggable="false"
                className="block max-h-full w-full select-none object-contain drop-shadow-[0_20px_35px_rgba(244,63,94,0.16)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.75, delay: 0.16 }}
              className="absolute left-1/2 top-[41.5%] z-30 flex h-[122px] w-[35%] max-w-[430px] -translate-x-1/2 items-center justify-center xl:top-[41%] xl:h-[138px] xl:max-w-[475px]"
            >
              <img
                src={centerText}
                alt="One writes the logic, one perfects the journey"
                draggable="false"
                className="block max-h-full w-full select-none object-contain drop-shadow-[0_10px_22px_rgba(30,41,59,0.08)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.75, delay: 0.2 }}
              className="absolute bottom-[6.4%] left-1/2 z-20 flex h-[92px] w-[52%] max-w-[650px] -translate-x-1/2 items-center justify-center overflow-hidden xl:bottom-[6.2%] xl:h-[108px] xl:max-w-[720px]"
            >
              <img
                src={bottomMiddleLogos}
                alt="Developer tester journey icons"
                draggable="false"
                className="block h-auto w-full translate-y-[-2px] scale-[1.18] select-none object-contain drop-shadow-[0_14px_28px_rgba(236,72,153,0.09)]"
              />
            </motion.div>
          </div>

          {/* Mobile / tablet portrait */}
          <div className="relative z-20 flex flex-col items-center overflow-hidden px-4 pb-7 pt-5 sm:px-6 sm:pb-8 sm:pt-6 md:px-8 md:pb-9 md:pt-7 lg:hidden">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.7 }}
              className="flex h-[108px] w-[74%] max-w-[270px] items-center justify-center sm:h-[130px] sm:max-w-[330px] md:h-[150px] md:max-w-[380px]"
            >
              <img
                src={infiniteLogo}
                alt="Infinite developer tester logo"
                draggable="false"
                className="block max-h-full w-full select-none object-contain"
              />
            </motion.div>

            <div className="mt-3 grid w-full grid-cols-2 items-end gap-3 sm:mt-4 sm:gap-5 md:gap-6">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="flex justify-end"
              >
                <img
                  src={developerBoy}
                  alt="Developer illustration"
                  draggable="false"
                  className="block w-full max-w-[156px] select-none object-contain drop-shadow-[0_14px_24px_rgba(79,70,229,0.12)] min-[390px]:max-w-[168px] sm:max-w-[220px] md:max-w-[270px]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="flex justify-start"
              >
                <img
                  src={testerGirl}
                  alt="Tester illustration"
                  draggable="false"
                  className="block w-full max-w-[156px] select-none object-contain drop-shadow-[0_14px_24px_rgba(244,63,94,0.12)] min-[390px]:max-w-[168px] sm:max-w-[220px] md:max-w-[270px]"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-4 flex h-[94px] w-[92%] max-w-[390px] items-center justify-center sm:mt-5 sm:h-[112px] sm:max-w-[440px] md:h-[126px] md:max-w-[500px]"
            >
              <img
                src={centerText}
                alt="One writes the logic, one perfects the journey"
                draggable="false"
                className="block max-h-full w-full select-none object-contain drop-shadow-[0_8px_18px_rgba(30,41,59,0.07)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 flex h-[64px] w-[86%] max-w-[460px] items-center justify-center overflow-hidden sm:mt-5 sm:h-[78px] sm:max-w-[540px] md:h-[88px] md:max-w-[620px]"
            >
              <img
                src={bottomMiddleLogos}
                alt="Developer tester journey icons"
                draggable="false"
                className="block h-auto w-full translate-y-[-1px] scale-[1.13] select-none object-contain"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeveloperTesterSection;