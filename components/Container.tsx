import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";
import { ContainerStoryblok } from "@/component-types-sb";

const Container: React.FunctionComponent<ContainerStoryblok> = ({
  blok,
}) => {
  return (
    <div
      {...storyblokEditable(blok)}
      className="bg-[#171717] text-white p-4 lg:p-16 -m-4 lg:m-0 rounded-lg"
    >
      {blok?.body?.map((nestedBlok: SbBlokData) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};

export default Container;
