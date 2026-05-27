import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="min-h-screen bg-rose-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl text-center bg-white rounded-3xl border border-rose-100 shadow-sm p-8 md:p-12">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-500">
          404
        </p>

        <h1 className="text-5xl font-bold text-gray-900 mt-4">
          Page Not Found
        </h1>

        <p className="text-gray-600 mt-5">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-rose-700 text-white font-medium hover:bg-rose-800 transition"
          >
            Go to Home
          </Link>

          <Link
            to="/events"
            className="px-6 py-3 rounded-full bg-rose-50 text-rose-700 border border-rose-100 font-medium hover:bg-rose-100 transition"
          >
            View Events
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;