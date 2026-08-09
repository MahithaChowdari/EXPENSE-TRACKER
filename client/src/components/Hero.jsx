import hero from "../assets/hero.png";
import { FaArrowRight, FaPlayCircle } from "react-icons/fa";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-50 via-white to-cyan-50 min-h-[90vh] flex items-center">

      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Side */}

        <div>

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
            #1 Expense Tracker for Students
          </span>

          <h1 className="mt-6 text-6xl md:text-7xl font-extrabold leading-tight text-slate-900">
            Manage Your Money
            <br />
            Smarter Than Ever
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-8 max-w-xl">
            Track your income, expenses, budgets and savings with a
            beautiful dashboard designed especially for students.
            Manage your finances effortlessly and achieve your goals.
          </p>

          <div className="flex gap-5 mt-10">

            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-xl font-semibold shadow-lg transition duration-300">

              Get Started

              <FaArrowRight />

            </button>

            <button className="flex items-center gap-2 border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-7 py-4 rounded-xl font-semibold transition duration-300">

              <FaPlayCircle />

              Live Demo

            </button>

          </div>

        </div>

        {/* Right Side */}

        <div className="flex justify-center items-center">

          <img
            src={hero}
            alt="Expense Tracker"
            className="w-full max-w-2xl object-contain"
            />

        </div>

      </div>

    </section>
  );
}

export default Hero;