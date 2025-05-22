import { storyblokEditable } from "@storyblok/react/rsc";
import { IconBlockStoryblok } from "@/component-types-sb";
import Title from "@/components/Title";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

const IconBlock: React.FunctionComponent<IconBlockStoryblok> = ({ blok }) => {
  const Icon = blok.icon && LucideIcons[blok.icon as keyof typeof LucideIcons];
  
  const content = (
    <>
      {Icon && (
        <Icon className="h-6 w-6 text-primary" />
      )}
      <div className="flex-1">
        <Title variant="h3" subvariant="secondary">{blok.title}</Title>
        <p>{blok.description || ""}</p>
      </div>
    </>
  );

  return (
    <div
      {...storyblokEditable(blok)}
      className={`flex flex-row items-center gap-8 bg-card-muted rounded-lg p-6`}
    >
      {blok.link ? (
        <Link 
          href={blok.link.url || '#'}
          className="flex flex-row items-center gap-8 w-full h-full"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  );
};

export default IconBlock;