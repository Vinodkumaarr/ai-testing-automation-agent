import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "../button";
import TestCaseSettingDialog from "./TestCaseSettingDialog";
import { TestCase } from "./UserRepoList";

type Props = {
  testCases: TestCase[];
  onReload: any,
  repository:any;
};

function TestCaseList({ testCases, onReload , repository}: Props) {

  const [selectedTestCases, setSelectedTestCases] = useState<TestCase[]>([]);
  const [isModelOpen, setIsModelOpen] = useState(false);

  const handleSelectedTestCase = (
    checked: boolean | string,
    testCase: TestCase,
  ) => {
    if (checked) {
      setSelectedTestCases((prev: any) => [...prev, testCase]);
    } else {
      setSelectedTestCases((prev: any) =>
        prev.filter((item: any) => item.id !== testCase.id),
      );
    }
};

   
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="bg-gradient-to-r from-indigo-300 to-violet-400 bg-clip-text text-xl font-bold text-transparent">
          Generated Test Cases
        </h2>

        <Button
          size={"sm"}
          onClick={() => onReload(testCases[0]?.repoId)}
          className="border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 backdrop-blur-xl hover:bg-indigo-500/20"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Test Case Container */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0B1120] via-[#111827] to-[#050816] shadow-xl backdrop-blur-2xl">
        {testCases.map((testCase, index) => (
        <div
            key = {index}
            // key={testCase.id || index}
            className="group flex items-center justify-between border-b border-white/10 p-5 transition-all duration-300 hover:bg-white/[0.03]"
        >
            {/* Left Side */}
            <div className="flex items-center gap-4 rounded-2xl border border-violet-400/20 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-cyan-500/10 p-4 backdrop-blur-xl transition-all duration-300 group-hover:border-violet-400/40 group-hover:shadow-lg group-hover:shadow-violet-500/10">
              <Checkbox
                checked={selectedTestCases?.some(
                  (item: any) => item.id == testCase?.id,
                )}
                onCheckedChange={(checked) =>
                  handleSelectedTestCase(checked, testCase)
                }
              />

              <div>
                <h2 className="font-medium text-white">{testCase.title}</h2>

                <p className="mt-1 text-xs text-gray-400">
                  {testCase.description}
                </p>
              </div>
            

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <Badge className="border border-cyan-400/20 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20">
                {testCase?.type || "No Type"}
              </Badge>
              {testCase?.status == 'failed' && 
              <Badge variant={'destructive'} className="border border-amber-400/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20">
                {testCase?.status}
              </Badge>}
              {testCase?.status == 'passed' && 
              <Badge variant={'default'} className="border border-green-400/20 bg-green-500/10 text-green-300 hover:bg-green-500/20">
                {testCase?.status}
              </Badge>}
              {testCase?.status == 'running' && 
              <Badge variant={'default'} className="border border-gray-400/20 bg-gray-500/10 text-gray-300 hover:bg-gray-500/20">
                {testCase?.status}
              </Badge>}

              <TestCaseSettingDialog testCase={testCase} setReload={onReload} />
              </div>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-cyan-500/10 p-5 backdrop-blur-xl">
          <div>
            <h2 className="font-semibold text-white">
              Run Selected Test Cases
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Execute selected AI-generated test scenarios.
            </p>
          </div>

          <Button
            disabled={selectedTestCases?.length == 0} onClick={()=> setIsModelOpen(true)}
            className="group rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 px-6 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            Run
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TestCaseList;

