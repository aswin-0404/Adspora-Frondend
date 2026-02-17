import { useContext } from "react";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import { AuthContext } from "../../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Search, TrendingUp, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAction = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate('/spaces');
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-white">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              The #1 Marketplace for Ad Spaces
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
              Advertise Smarter, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Reach Further.
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Connect with space owners directly. AI-powered recommendations to find the perfect spot for your brand's message.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAction}
                className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                Explore Spaces
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>

              <button
                onClick={handleAction}
                className="inline-flex justify-center items-center px-8 py-4 text-base font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
              >
                List Your Space
              </button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Verified Owners</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80"
                alt="Digital Billboard"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="font-bold text-lg">Premium Billboards</p>
                  <p className="text-white/80 text-sm">Available in 50+ Cities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Why Adspora?</h2>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to <br /> launch successful campaigns
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-8 h-8 text-indigo-600" />,
                title: "AI-Powered Matching",
                desc: "Our smart algorithm finds the best spaces based on your target audience and budget."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
                title: "Verified Listings",
                desc: "Every space is manually verified to ensure authenticity and premium quality."
              },
              {
                icon: <Search className="w-8 h-8 text-indigo-600" />,
                title: "Seamless Booking",
                desc: "Direct chat with owners and secure payments make booking effortless."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-purple-600 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">How it works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Three simple steps to start your advertising journey with Adspora.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-700 -z-10"></div>

            {[
              { step: "01", title: "Search", desc: "Browse thousands of verified ad spaces." },
              { step: "02", title: "Connect", desc: "Chat with owners & negotiate terms." },
              { step: "03", title: "Launch", desc: "Book securely and start your campaign." }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full border-4 border-gray-900 flex items-center justify-center text-3xl font-bold text-indigo-400 mb-6 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-indigo-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to grow your business?
              </h2>
              <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
                Join thousands of businesses who use Adspora to find premium advertising spaces at the best prices.
              </p>
              <button
                onClick={handleAction}
                className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform hover:-translate-y-1 shadow-lg"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
