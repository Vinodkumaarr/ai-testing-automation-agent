import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

function WorkspaceHeader() {
  return (
    <div className="flex w-full justify-between p-4 border-b">
        {/* logo */}
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />

        {/* menu option */}
        <ul className="flex gap-8 text-xl">
            <li className="hover:text-yellow-600 cursor-pointer">Workspace</li>
            <li className="hover:text-yellow-600 cursor-pointer">Pricing</li>
            <li className="hover:text-yellow-600 cursor-pointer">Support</li>
        </ul>


        {/* User button */}
        <UserButton/>

    </div>
    
  )
}

export default WorkspaceHeader