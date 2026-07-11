import { Link } from "react-router-dom";
import { FaTrain } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row justify-between gap-8">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <FaTrain size={20} />
            </div>

            <div>
              <h2 className="font-bold text-lg">
                TripSure
              </h2>

              <p className="text-sm text-gray-500">
                Smarter journeys, every day.
              </p>
            </div>

          </div>

          <div className="flex gap-6 text-gray-600">

            <Link to="/">Home</Link>

            <Link to="/bookings">
              My Bookings
            </Link>

            <Link to="/profile">
              Profile
            </Link>

          </div>

        </div>

        <div className="mt-8 text-sm text-gray-500">
          © {new Date().getFullYear()} TripSure. All rights reserved.
        </div>

      </div>
    </footer>
  );
}