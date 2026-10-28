
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ItemDetailsClient from "@/components/ItemDetailsClient";
import { getCustomizationById } from "@/lib/mock-data";

type ItemPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ItemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getCustomizationById(slug);

  if (!item) {
    return { title: "Item not found" };
  }

  return {
    title: item.title,
    description: item.description,
    openGraph: {
      title: `${item.title} | Vignify`,
      description: item.description,
      images: [item.image],
    },
  };
}

export default async function ItemDetailsPage({
  params,
}: ItemPageProps) {
  const { slug } = await params;
  const item = getCustomizationById(slug);

  if (!item) {
    notFound();
  }

  return <ItemDetailsClient item={item} />;
}
