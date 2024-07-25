import { Card } from "flowbite-react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function AppCard({ children }: Props) {
  return (
    <Card href="#" className="max-w-sm">
      {children}
    </Card>
  );
}
