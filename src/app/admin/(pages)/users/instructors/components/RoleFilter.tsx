import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";

const RoleFilter = ({onChange }: { onChange: (role: string | null) => void }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
        Role
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onChange(null)}>All Roles</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange('ADMIN')}>ADMIN</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange('STUDENT')}>STUDENT</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  export default RoleFilter;