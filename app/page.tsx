// import { UserButton } from '@clerk/nextjs';
// import React from 'react';

// export default function Home() {
//   return (
//     <div>
//       <UserButton/>
//     </div>
//   );
// }

// const styles: Record<string, React.CSSProperties> = {
//   container: {
//     minHeight: '100vh',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#09090b',
//     color: '#fafafa',
//     fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
//     padding: '2rem',
//     boxSizing: 'border-box',
//   },
//   hero: {
//     textAlign: 'center',
//     maxWidth: '800px',
//     marginBottom: '4rem',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   badge: {
//     display: 'inline-block',
//     padding: '0.5rem 1rem',
//     borderRadius: '9999px',
//     backgroundColor: '#27272a',
//     fontSize: '0.875rem',
//     fontWeight: 500,
//     color: '#38bdf8',
//     marginBottom: '1.5rem',
//     border: '1px solid #3f3f46',
//   },
//   title: {
//     fontSize: '3rem',
//     fontWeight: 800,
//     letterSpacing: '-0.025em',
//     lineHeight: 1.2,
//     margin: '0 0 1rem 0',
//   },
//   gradient: {
//     background: 'linear-gradient(to right, #38bdf8, #818cf8, #c084fc)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//   },
//   subtitle: {
//     fontSize: '1.125rem',
//     color: '#a1a1aa',
//     lineHeight: 1.6,
//     margin: '0 0 2rem 0',
//     maxWidth: '600px',
//   },
//   ctaGroup: {
//     display: 'flex',
//     gap: '1rem',
//   },
//   primaryCta: {
//     padding: '0.75rem 1.5rem',
//     borderRadius: '8px',
//     backgroundColor: '#38bdf8',
//     color: '#09090b',
//     fontWeight: 600,
//     textDecoration: 'none',
//     transition: 'opacity 0.2s',
//   },
//   secondaryCta: {
//     padding: '0.75rem 1.5rem',
//     borderRadius: '8px',
//     backgroundColor: 'transparent',
//     color: '#fafafa',
//     fontWeight: 600,
//     textDecoration: 'none',
//     border: '1px solid #3f3f46',
//     transition: 'background-color 0.2s',
//   },
//   grid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
//     gap: '2rem',
//     width: '100%',
//     maxWidth: '1000px',
//     marginBottom: '4rem',
//   },
//   card: {
//     backgroundColor: '#18181b',
//     border: '1px solid #27272a',
//     borderRadius: '12px',
//     padding: '1.5rem',
//     transition: 'transform 0.2s, border-color 0.2s',
//   },
//   icon: {
//     fontSize: '2rem',
//     marginBottom: '1rem',
//   },
//   cardTitle: {
//     fontSize: '1.25rem',
//     fontWeight: 600,
//     margin: '0 0 0.5rem 0',
//   },
//   cardText: {
//     fontSize: '0.875rem',
//     color: '#a1a1aa',
//     lineHeight: 1.5,
//     margin: 0,
//   },
//   footer: {
//     fontSize: '0.875rem',
//     color: '#71717a',
//     marginTop: 'auto',
//   },
// };


"use client";

import { UserButton } from "@clerk/nextjs";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";

/* =========================
   Spotlight Card Component
========================= */

function SpotlightCard({ children }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

   function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }){
    const rect = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/20"
    >
      {/* Cursor Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(34,211,238,0.18),
              transparent 40%
            )
          `,
        }}
      />

      {/* Glow Border */}
      <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-cyan-400/30 transition duration-500" />

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* =========================
   Main Page
========================= */

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white selection:bg-cyan-500/30">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-120px] left-[-100px] h-[350px] w-[350px] rounded-full bg-cyan-500/30 blur-3xl animate-pulse" />

        <div className="absolute bottom-[-120px] right-[-100px] h-[350px] w-[350px] rounded-full bg-violet-600/30 blur-3xl animate-pulse" />

        <div className="absolute top-[40%] left-[45%] h-[250px] w-[250px] rounded-full bg-pink-500/20 blur-3xl animate-bounce" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-16 py-6 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <h1 className="text-3xl font-black tracking-wide bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent">
          AI Testing Agent
        </h1>

        <div className="flex items-center gap-5">
          <button className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 transition-all duration-300 hover:scale-105 hover:bg-white/10">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            Features
          </button>

          <div className="rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-xl">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pb-28 pt-24 md:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 shadow-lg shadow-cyan-500/10 backdrop-blur-lg">
              <Zap className="h-4 w-4 text-cyan-400" />

              <span className="text-sm text-cyan-100">
                Next Generation AI Automation
              </span>
            </div>

            <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
              Smarter
              <span className="block bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent">
                Testing Automation
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-gray-300">
              Generate AI-powered test cases, automate workflows,
              detect UI bugs instantly, and accelerate QA pipelines
              with intelligent automation.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <button className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </span>

                <div className="absolute inset-0 bg-white/10 opacity-0 transition duration-300 group-hover:opacity-100" />
              </button>

              <button className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/10">
                Live Demo
              </button>
            </div>

            {/* Stats */}
            <div className="mt-14 flex flex-wrap gap-10">
              {[
                ["99%", "Automation Accuracy"],
                ["5X", "Faster Testing"],
                ["24/7", "AI Monitoring"],
              ].map((item, index) => (
                <div key={index}>
                  <h2 className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-3xl font-bold text-transparent">
                    {item[0]}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {item[1]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Dashboard */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 opacity-40 blur-xl" />

            <SpotlightCard>
              <div className="mb-10 flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 p-4 shadow-lg shadow-cyan-500/20">
                  <Bot className="h-8 w-8" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    AI Dashboard
                  </h2>

                  <p className="text-sm text-gray-400">
                    Intelligent testing insights
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  {
                    title: "UI Regression Testing",
                    desc: "Detect visual inconsistencies instantly.",
                  },
                  {
                    title: "API Test Generation",
                    desc: "Generate smart test scripts using AI.",
                  },
                  {
                    title: "Security Validation",
                    desc: "Run automated vulnerability checks.",
                  },
                ].map((item, index) => (
                  <SpotlightCard key={index}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          {item.desc}
                        </p>
                      </div>

                      {index !== 2 ? (
                        <CheckCircle2 className="text-green-400" />
                      ) : (
                        <ShieldCheck className="text-cyan-400" />
                      )}
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 pb-24 md:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-5xl font-bold">
              Advanced AI Features
            </h2>

            <p className="mt-5 text-lg text-gray-400">
              Powerful automation tools for modern developers and QA teams.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "AI Test Case Generator",
                desc: "Generate intelligent AI-powered test cases automatically.",
              },
              {
                title: "Visual Bug Detection",
                desc: "Find UI inconsistencies and visual regressions instantly.",
              },
              {
                title: "Cloud Test Automation",
                desc: "Run scalable and secure automated testing workflows.",
              },
            ].map((item, index) => (
              <SpotlightCard key={index}>
                <div className="mb-6 h-16 w-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/20" />

                <h3 className="mb-4 text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="leading-relaxed text-gray-400">
                  {item.desc}
                </p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}