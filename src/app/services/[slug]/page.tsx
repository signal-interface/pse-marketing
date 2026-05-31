import { notFound } from 'next/navigation';
import { serviceData, SERVICE_SLUGS } from '@/data/services';
import { ServicePage } from '@/components/templates/ServicePage';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceData[slug];
  if (!service) return {};
  return {
    title: `${service.name} | Payroll Synergy Experts`,
    description: service.metaDescription,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const service = serviceData[slug];
  if (!service) notFound();
  return <ServicePage service={service} />;
}
