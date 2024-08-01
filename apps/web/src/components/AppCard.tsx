import { Card } from "flowbite-react";
import { ReactNode } from "react";
import { cn } from "../utils/cn";

interface Props {
  children: ReactNode;
  styleClassName?: string;
}

export function AppCard({ children, styleClassName }: Props) {
  return (
    <Card href="#" className={cn("min-w-fit m-h-fit", styleClassName ?? "")}>
      {children}
    </Card>
  );
}
