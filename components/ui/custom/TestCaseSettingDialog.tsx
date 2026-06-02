import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { SettingsIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { TestCase } from "./UserRepoList";


type props = {
    testCase?:TestCase,
    setReload:any,
}

function TestCaseSettingDialog({testCase,setReload}:props) {

    const [formTestCase,setFormTestCase] = useState({
        title:testCase?.title || '',
        description:testCase?.description || '',
        targetRoute:testCase?.targetRoute || '',
        expectedResult:testCase?.expectedResult || '',
    });

    const handleInputChange = (fieldName:string,value:string) => {
        setFormTestCase((prev) => ({
            ...prev,
            [fieldName]:value,
        }))
    }
    const updateCase = async() => {
        const result = await axios.post('/api/test-cases/settings', {
            ...formTestCase,
            testCaseId:testCase?.id
        })
        console.log(result?.data);
        setReload();

        }

    

  return (
    <div>
      <Dialog >
        <DialogTrigger asChild>
            <Button
                size={"icon"}
                variant={"outline"}
                className="border-indigo-400/20 bg-white/5 text-indigo-300 hover:bg-indigo-500/10 hover:text-white"
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Testing Requirements</DialogTitle>
            <DialogDescription>
                Modifying these parameters automatically clears pre-generated TestCases.
    
            </DialogDescription>
          </DialogHeader>
          <div className="mt-1">
            <div className="mt-5">
                <label className="text-gray-500">TEST TITLE</label>
                <Input value={formTestCase?.title}
                onChange={(event) => handleInputChange('title', event.target.value)}
                placeholder = 'Test Title' className="mt-2"/>
            </div>
            <div className="mt-5">
                <label className="text-gray-500">DESCRIPTION/ACTION</label>
                <Textarea value={formTestCase?.description} 
                onChange={(event) => handleInputChange('description', event.target.value)}
                placeholder = 'Description' className="mt-2"/>
            </div>
            <div className="mt-5">
                <label className="text-gray-500">TARGET ROUTE/PATH</label>
                <Input  value={formTestCase?.targetRoute} 
                onChange={(event) => handleInputChange('targetRoute', event.target.value)}
                placeholder = 'Target Route' className="mt-2"/>
            </div>
            <div className="mt-5">
                <label className="text-gray-500">EXPECTED RESULT</label>
                <Textarea value={formTestCase?.expectedResult} 
                onChange={(event) => handleInputChange('expectedResult', event.target.value)}
                placeholder = 'Expected Result' className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button onClick={updateCase}>Update Case</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TestCaseSettingDialog;

