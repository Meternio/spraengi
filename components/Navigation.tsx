import Button from "@/components/Button";
import { cn } from "@/lib/utils";
import { SectionStoryblok } from "@/component-types-sb";
import { ISbStoryData } from "@storyblok/react/rsc";

export default function Navigation({ pageData, className }: { pageData: ISbStoryData, className?: string }) {
  function getSectionComponents(data: ISbStoryData) {
    if (!data?.content?.body) return [];

    return data.content.body.filter(
      (component: SectionStoryblok) => component.component === "section"
    );
  }

  const sections = getSectionComponents(pageData);
  return (
    <nav
      className={cn(
        `flex flex-col items-center gap-2 mt-4 font-bold`,
        className
      )}
    >
      {sections.map((section: SectionStoryblok) => {
        return (
          <Button
            key={section._uid}
            className="text-white"
            blok={{
              _uid: section._uid,
              component: "button",
              variant: "link",
              href: section.name,
              title: section.name,
              type: "localScroll",
            }}
          />
        );
      })}
    </nav>
  );
}
