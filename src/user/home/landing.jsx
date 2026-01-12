import Footer from "./Footer";
import Navbar from "./Nav";


export default function LandingPage() {
  return (
    <div className="font-sans">
      <Navbar />

      <section className="pt-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Discover & Advertise Spaces
              <span className="block text-yellow-300">Smarter with Adspora</span>
            </h1>
            <p className="mt-6 text-lg text-indigo-100">
              Find the perfect advertising or rental space.
              List, explore, and 
              connect— all in one platform.
            </p>
            <div className="mt-8 flex space-x-4">
              <button className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100">
                Explore Spaces
              </button>
              <button className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-700">
                Post an Ad
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786"
              alt="Advertising"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Adspora?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">AI Recommendations</h3>
              <p className="text-gray-600">
                Get smart space suggestions based on location, budget, and user behavior.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Verified Listings</h3>
              <p className="text-gray-600">
                Browse trusted and verified spaces with real images and details.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-3">Easy Management</h3>
              <p className="text-gray-600">
                Post, manage, and track ads easily from a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h4 className="font-semibold text-lg">Search Spaces</h4>
              <p className="text-gray-600 mt-2">
                Explore spaces based on location, type, and budget.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h4 className="font-semibold text-lg">AI Match</h4>
              <p className="text-gray-600 mt-2">
                Get AI-powered recommendations tailored for your needs.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 mx-auto bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h4 className="font-semibold text-lg">Connect & Advertise</h4>
              <p className="text-gray-600 mt-2">
                Contact owners and launch your advertising campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
        <p className="mt-4 text-indigo-100">
          Join Adspora today and discover smarter advertising spaces.
        </p>
        <button className="mt-6 bg-white text-indigo-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100">
          Get Started
        </button>
      </section>
      <Footer/>
    </div>
    
  );
}
