import CycloneDetailClient from './CycloneDetailClient';

export async function generateStaticParams() {
  return [
    { id: 'BOB_01_2026' },
    { id: 'cyc_aruna' },
    { id: 'cyc_biparjoy' },
  ];
}

export default async function CycloneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CycloneDetailClient id={id} />;
}
