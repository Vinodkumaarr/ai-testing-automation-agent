
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { DialogClose } from "@radix-ui/react-dialog"
// import axios from "axios"
// import { useEffect, useState } from "react"
// import { Button } from "../button"

// type Repo ={
//   id:number,
//   name:string,
//   full_name:string,
//   private:boolean,
//   html_url:string,
//   description:string,
//   updated_at:string,
//   language:string,
//   default_branch:string,
//   owner:string
// }

// function RepoDialog() {
  
//     const [repoList, setRepoList] = useState<Repo[]>([]);

//     useEffect(() => {
//         GetRepoList();
//     }, [])

//     const GetRepoList = async () =>{
//         const result = await axios.get("/api/github/repos");
//         console.log(result.data);
//         setRepoList(result.data);
//     }

//   return (
//     <Dialog>
//   <DialogTrigger asChild>
//     <Button  className="group rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 to-violet-700 px-7 py-6 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40">+ Add Repo</Button>
//   </DialogTrigger>
//   <DialogContent>
//     <DialogHeader>
//       <DialogTitle>Add Repository</DialogTitle>
//       <DialogDescription>
//         Search and Seclect your repositories.
//       </DialogDescription>
//     </DialogHeader>
//     <div>
//         {/* Repo List */}
        
//         <ul className='max-h-60 overflow-y-auto p-2 border rounded-md mt-4'>
//           {repoList.map((repo) => (
//             <li className='p-4 border-b border-gray-200 cursor-pointer'>{repo.full_name}</li>

//           ))}
//         </ul>
//     </div>
//     <DialogFooter className='flex gap-5 '>
//         <DialogClose>Cancel</DialogClose>
//         <Button className="group rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 to-violet-700 px-7 py-6 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40">Add</Button>
//     </DialogFooter>
//   </DialogContent>
// </Dialog>
//   )
// }

// export default RepoDialog

"use client";

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

import { UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { Button } from "../button";
import { Input } from "../input";

export type Repo = {
  id: number;
  name: string;
  full_name: string;
  private_: boolean;
  html_url: string;
  description: string;
  updated_at: string;
  language: string;
  default_branch: string;
  owner: string;
};

function RepoDialog({ setRefreshPage }: { setRefreshPage: (refresh: boolean) => void }) {
  const [repoList, setRepoList] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const {userDetail} = useContext(UserDetailContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    GetRepoList();
  }, []);

  const GetRepoList = async () => {
    try {
      setLoading(true);

      const result = await axios.get("/api/github/repos");

      console.log(result.data);

      setRepoList(result.data);
    } catch (error) {
      console.log("GitHub Repo Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRepoList = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    if (!q) return repoList;

    return repoList.filter((r=>r.full_name.toLowerCase().includes(q)));

  }, [searchTerm, repoList]);

  const SaveRepoToDB = async ()=>{
    if (!selectedRepo) return;
    const result = await axios.post("/api/user-repo",{
      repoId: selectedRepo.id,
      userId: userDetail?.id,
      name: selectedRepo.name,
      full_name: selectedRepo.full_name,
      private_: selectedRepo.private_,
      html_url: selectedRepo.html_url,
      description: selectedRepo.description,
      default_branch: selectedRepo.default_branch,
      language: selectedRepo.language,
      owner: selectedRepo.owner
    });
    
    console.log("Saved Repo:", result.data);
    setIsOpen(false);
    setRefreshPage(true);

  }

  return (
    <Dialog open={isOpen} onOpenChange={(open)=>setIsOpen(open)}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button className="group rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 to-violet-700 px-7 py-6 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:border-indigo-400/40 hover:shadow-indigo-500/40">
          + Add Repo
        </Button>
      </DialogTrigger>

      {/* Modal */}
      <DialogContent className="border border-white/10 bg-[#050816] text-white backdrop-blur-xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Add Repository
          </DialogTitle>

          <DialogDescription className="text-gray-400">
            Search and select your GitHub repositories.
          </DialogDescription>
        </DialogHeader>

        {/* Repo List */}
        <div className="mt-5">
          <Input placeholder="Search repositories..." onChange={(event)=>setSearchTerm(event.target.value)}/>
          <div className="max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-3 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
              </div>
            ) : repoList.length > 0 ? (
              <ul className="space-y-3">
                {filteredRepoList.map((repo) => (
                  <li
                    key={repo.id}
                    className={`group cursor-pointer rounded-xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20
                      ${selectedRepo?.id == repo.id ? 'border-indigo-400/40 bg-indigo-500/10 shadow-lg shadow-indigo-500/20 -translate-y-1' : null}`}
                      onClick={() => setSelectedRepo(repo)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-white">
                          {repo.full_name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                          {repo.description || "No description available"}
                        </p>
                      </div>

                      <div className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
                        {repo.language || "Code"}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center text-gray-400">
                No repositories found
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-6 flex gap-3">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-white/10 bg-transparent text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button onClick={()=>SaveRepoToDB()} className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 px-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30">
            Add Repository
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RepoDialog;