import { FileText, LifeBuoy, MessageSquare } from "lucide-react";

const PROPS = { className: "size-5", strokeWidth: 1.75 } as const;

function IconePour({ titre }: { titre: string }) {
  const t = titre.toLowerCase();
  if (t.includes("garde")) return <LifeBuoy {...PROPS} />;
  if (t.includes("orientation")) return <MessageSquare {...PROPS} />;
  return <FileText {...PROPS} />;
}

export function DemandeIcone({ titre }: { titre: string }) {
  return (
    <span
      aria-hidden
      className="grid size-11 shrink-0 place-items-center rounded-full bg-ink/5 text-navy"
    >
      <IconePour titre={titre} />
    </span>
  );
}