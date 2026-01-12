import { Link } from "react-router-dom";
import OwnerNavbar from "./OwnerNav";

export default function SpaceOwnerLanding() {
  return (
    <>
    <OwnerNavbar/>
    <div className="bg-gray-50 min-h-screen">

      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Turn Your Space Into <br /> a Revenue Opportunity
            </h1>
            <p className="mt-5 text-lg text-indigo-100">
              List your advertising spaces and connect with businesses
              looking for the perfect place to promote their brand.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to=""
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
            </div>
          </div>

        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Why Space Owners Choose Us
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-indigo-600">
                Earn More
              </h3>
              <p className="mt-3 text-gray-600">
                Monetize unused or premium spaces by connecting with
                advertisers ready to pay.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-indigo-600">
                Easy Management
              </h3>
              <p className="mt-3 text-gray-600">
                Manage listings, pricing, availability, and requests
                from a single dashboard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-indigo-600">
                Trusted Clients
              </h3>
              <p className="mt-3 text-gray-600">
                Work with verified businesses and ensure safe,
                transparent transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            How It Works
          </h2>

          <div className="mt-12 grid md:grid-cols-4 gap-6 text-center">
            {[
              "Create Account",
              "List Your Space",
              "Receive Requests",
              "Start Earning",
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow"
              >
                <div className="text-3xl font-bold text-indigo-600">
                  {index + 1}
                </div>
                <p className="mt-3 font-medium text-gray-700">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Ready to List Your Space?
          </h2>
          <p className="mt-4 text-gray-600">
            Join hundreds of space owners who are already earning
            through our platform.
          </p>
          <Link
            to="/register"
            className="inline-block mt-8 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
          >
            Start Listing
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
