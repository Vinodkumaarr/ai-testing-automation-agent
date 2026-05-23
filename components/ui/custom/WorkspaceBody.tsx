// "use client";

// import { UserDetailContext } from "@/context/UserDetailContext";
// import Image from "next/image";
// import React, { useContext } from "react";
// import { Button } from "../button";
// import { Card } from "../card";


// function WorkspaceBody() {
//   const { userDetail } = useContext(UserDetailContext);

//   return (
//     <>
      
//       {/* Left Section */}
//       <div className='flex justify-between items-center'>
//         <h2 className="text-4xl font-semibold text-gray-800">
//           Workspace
//         </h2>
//         <h2 className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
//           Remaining Credits: {userDetail?.credits ?? 0}
//         </h2>
//       </div>
        
//     <div>
//       {/* Right Section */}
//       <Card className="mt-5 flex items-center gap-4">
        
//         <div className="flex items-center gap-5 transition hover:shadow-md">
//           <Image
//             src="/github.png"
//             alt="GitHub"
//             width={40}
//             height={40}
//             className="object-contain"
//           />
//           <h2>Connect GitHub & Add Repository</h2>
//         </div>
//         <div>
//             <Button>Install</Button>
//         </div>
//       </Card>
//     </div>
//   );
// }

// export default WorkspaceBody;

"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import Image from "next/image";
import React, { useContext } from "react";
import { Button } from "../button";
import { Card, CardContent } from "../card";
import {
  Github,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import EmptyWorkspace from "./EmptyWorkspace";

/* =========================
   Interactive Card
========================= */

function GlowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    const rect =
      e.currentTarget.getBoundingClientRect();

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      whileHover={{
        scale: 1.02,
        y: -6,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
      }}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-black via-zinc-950 to-indigo-950 backdrop-blur-xl transition-all duration-500 hover:border-indigo-400/40 hover:shadow-[0_0_40px_rgba(99,102,241,0.35)] ${className}`}
    >
      {/* Cursor Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(99,102,241,0.22),
              transparent 40%
            )
          `,
        }}
      />

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-indigo-400/30 transition duration-300" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

/* =========================
   Main Component
========================= */

function WorkspaceBody() {
  const { userDetail } =
    useContext(UserDetailContext);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <GlowCard className="p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          
          {/* Left */}
          <div>
            <h2 className="bg-gradient-to-r from-indigo-400 via-violet-400 to-white bg-clip-text text-4xl font-bold text-transparent">
              Workspace
            </h2>

            <p className="mt-2 max-w-xl text-sm text-gray-400">
              Manage repositories, automate testing
              workflows, and monitor AI-powered QA
              pipelines with intelligent automation.
            </p>
          </div>

          {/* Credits */}
          <div className="flex items-center gap-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-3 backdrop-blur-xl">
            <Sparkles className="h-5 w-5 text-indigo-400" />

            <div>
              <p className="text-xs text-gray-400">
                Remaining Credits
              </p>

              <h2 className="text-xl font-bold text-indigo-300">
                {userDetail?.credits ?? 0}
              </h2>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* ================= GITHUB CARD ================= */}

      <GlowCard className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* Left Content */}
          <div className="flex items-center gap-5">
            
            {/* Logo */}
            <motion.div
              whileHover={{
                rotate: 5,
                scale: 1.08,
              }}
              className="rounded-2xl border border-white/10 bg-black/40 p-4 shadow-lg shadow-indigo-500/10"
            >
              <Image
                src="/github.png"
                alt="GitHub"
                width={50}
                height={50}
                className="object-contain"
                
              />
            </motion.div>

            {/* Text */}
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-white">
                <Github className="h-6 w-6 text-indigo-400" />

                Connect GitHub
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-400">
                Connect your GitHub repositories to
                automatically generate AI-powered
                testing workflows, regression tests,
                and deployment validation.
              </p>
            </div>
          </div>

          {/* Button */}
          <Button className="group rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 to-violet-700 px-7 py-6 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40">
            <span className="flex items-center gap-2">
              Install Now

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </GlowCard>

      <GlowCard className="p-6">
        <CardContent>
            <EmptyWorkspace />
        </CardContent>
      </GlowCard>

      {/* ================= EXTRA FEATURE CARDS ================= */}

      {/* <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "AI Automation",
            desc: "Generate smart automated test cases instantly.",
          },
          {
            title: "Visual Detection",
            desc: "Track UI bugs and regressions with AI.",
          },
          {
            title: "Cloud Pipelines",
            desc: "Run scalable automated workflows securely.",
          },
        ].map((item, index) => (
          <GlowCard
            key={index}
            className="p-6"
          >
            <div className="mb-5 h-14 w-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 shadow-lg shadow-indigo-500/20" />

            <h2 className="text-xl font-semibold text-white">
              {item.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              {item.desc}
            </p>
          </GlowCard>
        ))}
      </div> */}
    </div>
  );
}

export default WorkspaceBody;

