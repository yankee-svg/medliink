import Button from "./components/Button";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <section className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Layout>
        <Navbar />
        <section className="m-auto w-full">
          <div className="container mx-auto py-5 md:py-16 px-4  lg:flex lg:items-start overflow-x-hidden">
            <div className="lg:w-1/2 lg:ml-12 mt-8 lg:mt-28">
              <h1 className="md:text-4xl text-3xl  font-bold capitalize mb-4">
                transforming health care through innovation, technology and
                compassion.
              </h1>
              <p className="text-slate-600 py-5">
                Discover the profound synergy of technology and empathy
                seamlessly merging into a powerful force. Medliink stands as
                your unwavering partner in your journey towards unparalleled
                health and well-being
              </p>

              <section className="button-section w-full flex items-center justify-around gap-x-5 md:gap-x-10 md:justify-start">
                <Link
                  href="/auth/signup"
                  className="capitalize text-white w-3/12 rounded p-3 btn-secondary transition-colors text-center"
                >
                  Signup
                </Link>
                <Link href="/auth/signup" className="capitalize text-white text-center rounded p-3 btn-secondary transition-colors w-9/12 my-8 md:w-3/4 lg:w-2/4">
                  join as an hospital
                </Link>
              </section>
            </div>

            <div className="lg:w-1/2 flex items-center justify-center relative min-h-[500px]">
              <div className="relative w-full h-full">
                {/* Decorative background blur circles */}
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                
                {/* Main image with styling */}
                <div className="relative z-20 w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Medical professional in operating room"
                    className="w-full h-full object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500 border-4 border-white/50"
                  />
                  {/* Gradient overlay on image for depth */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-cyan-500/10 rounded-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/30 rounded-3xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </section>
  );
}
