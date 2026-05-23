import Image from "next/image";
import React from "react";
import { Button } from "../button";
import { Link } from "lucide-react";

function EmptyWorkspace() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-black via-zinc-950 to-indigo-950 p-10 text-center shadow-2xl">
      
      {/* Folder Image */}
      <div className="rounded-2xl bg-white p-4 shadow-lg">
        <Image
          src="/folder.png"
          alt="Empty Workspace"
          width={70}
          height={70}
          className="object-contain"
        />
      </div>

      {/* Heading */}
      <h2 className="mt-5 text-2xl font-semibold text-white">
        No Repository Connected
      </h2>

      {/* Description */}
      <p className="mt-2 max-w-md text-sm text-gray-400">
        Connect your GitHub repository to start
        generating AI-powered testing workflows,
        automation pipeline    
      </p>
      <Button className="mt-5"><Link className="h-4 w-4 mr-2"/> Connect Repository</Button>
    </div>
  );
}

export default EmptyWorkspace;