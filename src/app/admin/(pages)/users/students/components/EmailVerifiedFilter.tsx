import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";

const EmailVerifiedFilter = ({onChange }: { onChange: (role: string | null) => void }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
        Email Verified
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onChange(null)}>All</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange('Verified')}>Verified</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChange('Not Verified')}>Not Verified</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  export default EmailVerifiedFilter;