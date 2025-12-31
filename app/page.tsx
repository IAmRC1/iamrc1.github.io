import { ScrollProgress } from "@/components/ScrollProgress";
import { FavoriteColorModal } from "@/components/FavoriteColorModal";
import { HomeAbout } from "@/components/home/HomeAbout";
import { HomeCaseStudy } from "@/components/home/HomeCaseStudy";
import { HomeContact } from "@/components/home/HomeContact";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeIntro } from "@/components/home/HomeIntro";
import { HomeWork } from "@/components/home/HomeWork";
import { getAllPosts } from "@/lib/blog";
import { getStatus } from "@/lib/status";

export default async function Page() {
  const status = await getStatus();
  const posts = await getAllPosts();
  const latest = posts[0] ?? null;

  return (
    <main className="min-h-dvh bg-white pt-28 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 sm:pt-16">
      <ScrollProgress />
      <FavoriteColorModal />
      <HomeHeader />
      <HomeIntro status={status} latest={latest} />
      <HomeAbout />
      <HomeWork />
      <HomeCaseStudy />
      <HomeContact />
    </main>
  );
}
