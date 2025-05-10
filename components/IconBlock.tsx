import { storyblokEditable } from "@storyblok/react/rsc";
import { IconBlockStoryblok } from "@/component-types-sb";
import Title from "@/components/Title";
import * as LucideIcons from "lucide-react";

const IconBlock: React.FunctionComponent<IconBlockStoryblok> = ({ blok }) => {
  const Icon = blok.icon && LucideIcons[blok.icon as keyof typeof LucideIcons];

  return (
    <div
      {...storyblokEditable(blok)}
      className="flex flex-row items-center gap-8 bg-[#171717] rounded-lg p-6"
    >
      {Icon && (
          <Icon className="h-6 w-6 text-primary" />
      )}
      <div className="flex-1">
        <Title variant="h3">{blok.title}</Title>
        <p>{blok.description || ""}</p>
      </div>
    </div>
  );
};

export default IconBlock;
