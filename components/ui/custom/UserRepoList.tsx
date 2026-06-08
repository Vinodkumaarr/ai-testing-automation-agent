
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import {
  CheckCircle2,
  Code2,
  GitBranch,
  Link2Icon,
  ListChecks,
  Loader2,
  Loader2Icon,
  Sparkles,
  TrendingUp,
  XCircle
} from "lucide-react";
import Image from "next/image";
import { useContext, useState } from "react";
import { Button } from "../button";
import RepoSettings from "./RepoSettings";
import TestCaseList from "./TestCaseList";
import { UserRepo } from "./WorkspaceBody";

type Props = {
  repoList: UserRepo[],
  setReload: () => void;

};

export type TestCase = {
  id: number;
  title: string;
  description: string;
  type: string;
  repoId: number;
  targetFiles: string[];
  expectedResult: string;
  repoName: string;
  repoOwner: string;
  targetRoute: string;
  status:string;
};

type StatusData = {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
};

function UserRepoList({ repoList, setReload }: Props) {
  const { userDetail } = useContext(UserDetailContext);
  const [testCaseLoading, setTestCaseLoading] = useState(false);
  const [loadingRepoId, setLoadingRepoId] = useState<number | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  
  const [statusData, setStatusData] = useState<StatusData>({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    passRate: 0,
  });

  const handleGenerateTestCase = async (repo: UserRepo) => {
    try {
      setLoadingRepoId(repo.id);

      const payload = {
        userId: userDetail?.id,
        repoId: repo.repoId,
        owner: repo.owner,
        repo: repo.name,
        branch: repo.defaultBranch || "main",
      
      };

      console.log("Sending Payload:", payload);

      const result = await axios.post("/api/generate-test-cases", payload);

      console.log("Generated Test Cases:", result.data);
    } catch (error: any) {
      console.error(
        "Generate Test Case Error:",
        error?.response?.data || error.message,
      );
    } finally {
      setLoadingRepoId(null);
    }
  };

  const GetTestCases = async (repoId: number) => {
    setTestCaseLoading(true);
    setTestCases([]);
    const result = await axios.get(`/api/test-cases?repoId=${repoId}`);
    console.log(result.data);

    const userTestCases = result.data as TestCase[];
    const passedTests = userTestCases?.filter((test) => test.status === "passed").length || 0;
    const failedTests = userTestCases?.filter((test) => test.status === "failed").length || 0;
    const passRate = userTestCases?.length > 0 ? Math.round((passedTests / userTestCases.length) * 100) : 0;


    setStatusData({
      totalTests: result.data.length,
      passedTests: passedTests,
      failedTests: failedTests,
      passRate: passRate,
    });

    setTestCases(result.data);
    setTestCaseLoading(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="bg-gradient-to-r from-indigo-300 to-violet-400 bg-clip-text text-xl font-bold text-transparent">
          Connected Repositories
        </h2>

        <div className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1 text-sm text-indigo-300 backdrop-blur-xl">
          {repoList.length} Connected
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        onValueChange={(value) => GetTestCases(Number(value))}
        className="group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#050816] shadow-xl backdrop-blur-2xl transition-all duration-500 hover:border-indigo-400/30 hover:shadow-indigo-500/20"
      >
        {repoList.map((repo, index) => (
          <AccordionItem
            key={repo.id}
            value={repo.repoId.toString()}
            className="border px-5"
          >
            <AccordionTrigger className="px-6 py-5 hover:no-underline">
              <div className="flex w-full items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  {/* GitHub Icon */}
                  <div className="rounded-2xl border border-white/10 bg-white p-3 shadow-lg transition-all duration-300 group-hover:scale-105">
                    <Image
                      src="/github.png"
                      alt="GitHub"
                      width={34}
                      height={34}
                      className="object-contain"
                    />
                  </div>

                  {/* Repo Info */}
                  <div className="flex flex-col items-start text-left">
                    <h2 className="text-lg font-semibold text-white">
                      {repo.fullName}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-4 w-4 text-indigo-400" />
                        {repo.defaultBranch || "main"}
                      </div>

                      <div className="h-1 w-1 rounded-full bg-gray-500" />

                      <div className="flex items-center gap-1">
                        <Code2 className="h-4 w-4 text-violet-400" />
                        {repo.language || "Unknown"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-300 md:flex">
                  Active
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6">
                <div className="bg--gray-50 p-3 border rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-2 ">
                    <Link2Icon className="text-primary" />
                    <h2>Target Domain:</h2>
                    <h2 className=" p-1 px-2 border border-md">
                      {repo?.targetDomain}
                    </h2>
        </div>
        <RepoSettings repo = {repo} setReload={setReload}/>
      </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatusCard
                    title="Total Tests"
                    value={statusData.totalTests}
                    icon={<ListChecks className="h-5 w-5 text-blue-400" />}
                    glow="shadow-blue-500/20"
                    bg="bg-blue-500/10"
                    border="border-blue-400/20"
                  />

                  <StatusCard
                    title="Passed"
                    value={statusData.passedTests}
                    icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                    glow="shadow-emerald-500/20"
                    bg="bg-emerald-500/10"
                    border="border-emerald-400/20"
                  />

                  <StatusCard
                    title="Failed"
                    value={statusData.failedTests}
                    icon={<XCircle className="h-5 w-5 text-red-400" />}
                    glow="shadow-red-500/20"
                    bg="bg-red-500/10"
                    border="border-red-400/20"
                  />

                  <StatusCard
                    title="Pass Rate"
                    value={`${statusData.passRate}%`}
                    icon={<TrendingUp className="h-5 w-5 text-violet-400" />}
                    glow="shadow-violet-500/20"
                    bg="bg-violet-500/10"
                    border="border-violet-400/20"
                  />
                </div>
                {!testCaseLoading && testCases.length > 0 && (
                  <TestCaseList
                    testCases={testCases}
                    repository={repo}
                    onReload={(repoId: number) => GetTestCases(repoId)}

                  />
                )}

                {testCaseLoading ? (
                  <h2 className="flex items-center gap-3">
                    <Loader2Icon className="animate-spin" />
                    Please Wait...
                  </h2>
                ) : (
                  testCases?.length == 0 && (
                    <div className="relative overflow-hidden rounded-3xl border border-indigo-400/20 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-cyan-500/10 p-5 backdrop-blur-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-violet-500/5 to-cyan-500/5 opacity-60 blur-2xl" />

                      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {loadingRepoId === repo.id
                              ? "Generating Test Cases..."
                              : "Generate AI Test Cases"}
                          </h3>

                          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
                            Analyze this repository using AI and generate
                            intelligent automated test cases, bug detection
                            flows, API validations, and UI regression tests.
                          </p>
                        </div>

                        <Button
                          className="group h-12 rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 px-6 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40"
                          disabled={loadingRepoId === repo.id}
                          onClick={() => handleGenerateTestCase(repo)}
                        >
                          {loadingRepoId === repo.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Sparkles className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                          )}
                          Generate Test Cases
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default UserRepoList;

/* =========================
   Status Card
========================= */

function StatusCard({
  title,
  value,
  icon,
  glow,
  bg,
  border,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  glow: string;
  bg: string;
  border: string;
}) {
  return (
    <div
      className={`group rounded-2xl border ${border} bg-white/5 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glow}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
