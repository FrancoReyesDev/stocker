import { Button } from "../ui/button";

interface Props {
  title: string;
}

export function Header({ title }: Props) {
  return (
    <header className="h-14 bg-background border-b flex gap-2 items-center p-2">
      <Button size={"icon"}></Button>
      <h1>Header</h1>
    </header>
  );
}
