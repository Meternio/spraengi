import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";
import { IconBlockGridStoryblok } from "@/component-types-sb";

const IconBlockGrid: React.FunctionComponent<IconBlockGridStoryblok> = ({
  blok,
}) => {
  return (
    <div
      {...storyblokEditable(blok)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {blok?.icon_blocks?.map((nestedBlok: SbBlokData) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};

export default IconBlockGrid;
