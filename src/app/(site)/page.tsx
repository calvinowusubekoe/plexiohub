import { HomeSections } from '@/components/home/HomeSections';
import { getFaqs } from '@/lib/data/faqs';
import { getPublishedProjects } from '@/lib/data/projects';

export const revalidate = 300;

export default async function HomePage() {
  const [projects, faqs] = await Promise.all([getPublishedProjects(), getFaqs()]);
  return <HomeSections projects={projects} faqs={faqs} />;
}
