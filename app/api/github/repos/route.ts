// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export async function GET(){
//     const cookiesStore=await cookies();
//     const token=cookiesStore.get("gh_token")?.value;

//     if(!token){
//         return NextResponse.json(
//             {error:"User not authenticated"},
//             {status:401}
//         );
//     }
//     const allRepo = [];
//     let page=1;

//     while(true){
//         const res = await fetch(`https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated`,{
//             headers:{
//                 Authorization:`Bearer ${token}`,
//                 Accept:"application/vnd.github+json"
//             }
//         })
//         const repos = await res.json();
//         if(!repos.length) break;
//         allRepo.push(...repos);
//         page++;
    
//     }
//     return NextResponse.json(allRepo.map( r=> ({
//         id:r.id,
//         name:r.name,
//         full_name:r.full_name,
//         private:r.private,
//         html_url:r.html_url,
//         description:r.description,
//         updated_at:r.updated_at,
//         language:r.language,
//         default_branch:r.default_branch,
//         owner:r.owner.login

//     })));
// }


import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("gh_token")?.value;

    console.log("TOKEN:", token);

    if (!token) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const response = await fetch(
      "https://api.github.com/user/repos?per_page=100&sort=updated",
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
        },

        cache: "no-store",
      }
    );

    console.log("GitHub Status:", response.status);

    const data = await response.json();

    if (!response.ok) {
      console.log("GitHub Error:", data);

      return NextResponse.json(
        {
          error: data.message || "GitHub API Error",
        },
        {
          status: response.status,
        }
      );
    }

    const repos = data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private_: repo.private,
      html_url: repo.html_url,
      description: repo.description,
      updated_at: repo.updated_at,
      language: repo.language,
      default_branch: repo.default_branch,
      owner: repo.owner?.login,
    }));

    return NextResponse.json(repos);
  } catch (error) {
    console.log("SERVER ERROR:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}