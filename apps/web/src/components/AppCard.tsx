import { Card } from "flowbite-react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function AppCard({ children }: Props) {
  return (
    <Card href="#" className="min-w-fit m-h-fit">
      {children}
    </Card>
  );
}
