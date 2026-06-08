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
import axios from "axios";
import { Settings2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { UserRepo } from "./WorkspaceBody";


type props = {
    repo : UserRepo,
    setReload: () => void;
}

function RepoSettings({ repo, setReload }: props ) {

    const [isOpen, setIsOpen] = useState(false);
    const [repoSettings,setRepoSettings] = useState({
        targetDomain: repo?.targetDomain || '',
        globalInstruction: repo?.globalInstruction || '',
    });

    const handleSaveSettings = async () => {
        // Implement API call to save settings to the database
        console.log("Saving settings:", repoSettings);

        const result = await axios.post('/api/user-repo/settings', {
            repoId: repo.repoId,
            targetDomain: repoSettings.targetDomain,
            globalInstruction: repoSettings.globalInstruction,
        
        });
        console.log("Settings saved:", result?.data);
        setIsOpen(false);
        setReload();
    }

  return (
    <div>
      < Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogTrigger asChild><Button
        className="h-11 rounded-xl
        border border-indigo-400/20
        bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 text-white
        shadow-lg
        shadow-indigo-500/20
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-indigo-500/40
      "
      >
      <Settings2 className="h-4 w-4 mr-1" />
      Project Config
      </Button></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center"><Settings2 className="text-primary" /> Project/Repo Settings</DialogTitle>
            <DialogDescription>
              Configure project-level defaults used during script generation and exception handling.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div>
                <label className="text-gray-500">APP URL/DEFAULT WEBSITE</label>
                <Input value={repoSettings?.targetDomain}
                 onChange = {(e) => setRepoSettings({...repoSettings, targetDomain: e.target.value})}
                 placeholder='App url/Domain' className="mt-1"/>
            </div>
            <p className="text-sm text-gray-400">
              The target address where automation headless browsers will connect and run test cases
            </p>
            <div className="mt-4">
                <label className="text-gray-500">GLOBAL TEST INSTRUCTIONS</label>
                <Textarea value={repoSettings?.globalInstruction}
                 onChange = {(e) => setRepoSettings({...repoSettings, globalInstruction: e.target.value})}
                 placeholder='Global test instructions' className="mt-1"/>
                <p className="text-sm text-gray-400">
                    Include any authentication credentials,cookies, or teardown instructions.
                    These are automatically appended to Gemini's prompts.
                </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Close</Button>
            </DialogClose>
            <Button onClick={handleSaveSettings}>Save Config</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RepoSettings;
