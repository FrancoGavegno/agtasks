// app/protocols/[id]/page.tsx
import ProtocolDetail from "@/components/protocols/protocol-detail";

type Props = {
  params: {
    id: string;
  };
};

export default function ProtocolDetailPage({ params }: Props) {
  const { id } = params;

  return (
    <main>
      <ProtocolDetail id={id} />
    </main>
  );
}

export const dynamic = "force-dynamic"; // Opcional: fuerza renderizado dinámico
