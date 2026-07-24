import ThemeToggle from "@/components/common/ThemeToggle";

export default function AuthShowcase() {
  return (
    <div
      className="
    hidden lg:flex
    relative overflow-hidden
    p-16
    flex-col justify-between
    text-white

    bg-gradient-to-br
    from-blue-700
    via-blue-600
    to-cyan-500

    dark:from-slate-850
  dark:via-blue-950
  dark:to-slate-800

    transition-all
    duration-500
  "
    >
      {/* Floating circles */}
      <div
        className="
      absolute
      w-96 h-96
      rounded-full
      -top-24 -left-24
      blur-3xl

      bg-white/10
      dark:bg-blue-400/10

      transition-all
      duration-500
    "
      />

      <div
        className="
      absolute
      w-80 h-80
      rounded-full
      bottom-0 right-0
      blur-3xl

      bg-cyan-300/20
      dark:bg-blue-500/10

      transition-all
      duration-500
    "
      />

      <div className="absolute top-8 right-8 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mt-20">
        <h1 className="text-6xl font-bold leading-tight text-white">
          Shop Smarter.
          <br />
          Live Better.
        </h1>

        <p
          className="
        mt-6
        text-xl
        max-w-lg

        text-blue-100
        dark:text-blue-200

        transition-colors
        duration-500
      "
        >
          Discover premium products with fast delivery, secure payments and an
          amazing shopping experience.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-3 xl:gap-6">
        <div
          className="
        bg-white/10
        dark:bg-white/5

        backdrop-blur-md
        rounded-3xl
        p-4 xl:p-6

        text-center
        min-w-0

        border border-white/10
        dark:border-white/5

        transition-all
        duration-500
      "
        >
          <h3 className="text-2xl xl:text-4xl font-bold break-words">20K+</h3>

          <p
            className="
          text-xs sm:text-sm xl:text-base
          mt-2
          break-words

          text-blue-100
          dark:text-blue-200

          transition-colors
          duration-500
        "
          >
            Products
          </p>
        </div>

        <div
          className="
        bg-white/10
        dark:bg-white/5

        backdrop-blur-md
        rounded-3xl
        p-4 xl:p-6

        text-center
        min-w-0

        border border-white/10
        dark:border-white/5

        transition-all
        duration-500
      "
        >
          <h3 className="text-2xl xl:text-4xl font-bold break-words">24H</h3>

          <p
            className="
          text-xs sm:text-sm xl:text-base
          mt-2
          break-words

          text-blue-100
          dark:text-blue-200

          transition-colors
          duration-500
        "
          >
            Delivery
          </p>
        </div>

        <div
          className="
        bg-white/10
        dark:bg-white/5

        backdrop-blur-md
        rounded-3xl
        p-4 xl:p-6

        text-center
        min-w-0

        border border-white/10
        dark:border-white/5

        transition-all
        duration-500
      "
        >
          <h3 className="text-2xl xl:text-4xl font-bold break-words">99.9%</h3>

          <p
            className="
          text-xs sm:text-sm xl:text-base
          mt-2
          break-words

          text-blue-100
          dark:text-blue-200

          transition-colors
          duration-500
        "
          >
            Secure Payments
          </p>
        </div>
      </div>
    </div>
  );
}
