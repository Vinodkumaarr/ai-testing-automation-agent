
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import axios from "axios"
import { useEffect, useState } from "react"
import { Button } from "../button"

type Repo ={
  id:number,
  name:string,
  full_name:string,
  private:boolean,
  html_url:string,
  description:string,
  updated_at:string,
  language:string,
  default_branch:string,
  owner:string
}

function RepoDialog() {
  
    const [repoList, setRepoList] = useState<Repo[]>([]);

    useEffect(() => {
        GetRepoList();
    }, [])

    const GetRepoList = async () =>{
        const result = await axios.get("/api/github/repos");
        console.log(result.data);
        setRepoList(result.data);
    }

  return (
    <Dialog>
  <DialogTrigger asChild>
    <Button  className="group rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 to-violet-700 px-7 py-6 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40">+ Add Repo</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Repository</DialogTitle>
      <DialogDescription>
        Search and Seclect your repositories.
      </DialogDescription>
    </DialogHeader>
    <div>
        {/* Repo List */}
        
        <ul className='max-h-60 overflow-y-auto p-2 border rounded-md mt-4'>
          {repoList.map((repo) => (
            <li className='p-4 border-b border-gray-200 cursor-pointer'>{repo.full_name}</li>

          ))}
        </ul>
    </div>
    <DialogFooter className='flex gap-5 '>
        <DialogClose>Cancel</DialogClose>
        <Button className="group rounded-2xl border border-indigo-400/20 bg-gradient-to-r from-indigo-600 to-violet-700 px-7 py-6 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/40">Add</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default RepoDialog