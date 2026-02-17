import { Link, useNavigate } from "react-router-dom";
import OwnerNavbar from "../../components/layout/OwnerNavbar";
import Button from "../../components/ui/Button";
import { ArrowRight, TrendingUp, Shield, Layers, DollarSign } from "lucide-react";

export default function SpaceOwnerLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <OwnerNavbar />

      <main className="flex-grow pt-16">

        <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gray-50/50">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-50 blur-[120px] rounded-full opacity-60"></div>
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-purple-50 blur-[120px] rounded-full opacity-60"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-white border border-gray-200 text-indigo-600 text-sm font-bold mb-8 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                Owner Portal
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8 text-gray-900">
                Monetize <br />
                <span className="text-indigo-600">Your Property</span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-xl font-medium">
                Connect with global brands looking for premium advertising visibility. List your spaces and start earning today.
              </p>
              <div className="flex flex-wrap gap-6">
                <button
                  onClick={() => navigate('/owner/addspace')}
                  className="px-8 py-4 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 flex items-center gap-2 group"
                >
                  Start Listing <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
                <button
                  onClick={() => navigate('/myspace')}
                  className="px-8 py-4 bg-white text-gray-700 border border-gray-200 hover:border-gray-300 rounded-2xl font-bold text-lg transition-all shadow-sm"
                >
                  Dashboard
                </button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-6 relative animate-fade-in">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 transform rotate-2">
                  <TrendingUp className="text-indigo-600 mb-4" size={32} />
                  <p className="text-3xl font-bold text-gray-900 mb-1">₹45k+</p>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest leading-none">Avg. Monthly</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 transform -rotate-2">
                  <Layers className="text-indigo-600 mb-4" size={32} />
                  <p className="text-3xl font-bold text-gray-900 mb-1">500+</p>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest leading-none">Active Brands</p>
                </div>
                <div className="col-span-2 bg-indigo-600 p-10 rounded-3xl shadow-2xl shadow-indigo-600/30">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
                      <Shield size={32} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">Full Transparency</p>
                      <p className="text-indigo-100 font-medium opacity-80">Track every impression and rupee earned.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Built for Efficiency</h2>
              <p className="text-lg text-gray-500 font-medium">Manage your entire portfolio with our automated tools.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: <DollarSign className="w-8 h-8 text-indigo-600" />,
                  title: "Fast Payouts",
                  desc: "Automated billing and direct bank transfers ensure you get paid on time, every time.",
                  bg: "bg-indigo-50"
                },
                {
                  icon: <Layers className="w-8 h-8 text-emerald-600" />,
                  title: "Smart Inventory",
                  desc: "Real-time vacancy tracking and dynamic pricing to maximize your occupancy rates.",
                  bg: "bg-emerald-50"
                },
                {
                  icon: <Shield className="w-8 h-8 text-purple-600" />,
                  title: "Verified Brands",
                  desc: "We screen every advertiser strictly to maintain the quality and integrity of your property.",
                  bg: "bg-purple-50"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-10 rounded-3xl bg-white border border-gray-100 hover:border-indigo-600/20 hover:shadow-2xl hover:shadow-indigo-600/5 transition-all duration-300">
                  <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-950 rounded-[40px] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-3xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full"></div>
              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to earn?</h2>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">Join the future of advertising management. List your space in minutes.</p>
                <button
                  onClick={() => navigate('/owner/addspace')}
                  className="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xl transition-all shadow-2xl shadow-indigo-600/40"
                >
                  Start Listing Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
