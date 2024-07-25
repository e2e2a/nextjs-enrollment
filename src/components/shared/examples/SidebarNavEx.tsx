import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import Link from "next/link"
  
  export function AccordionDemo() {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="no-underline hover:no-underline">Is it accessible?</AccordionTrigger>
          <AccordionContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-2"><AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent><Link href={''}>ex2</Link></AccordionContent>
            </AccordionItem>
            </Accordion>
            <Link href={''}>ex1</Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  