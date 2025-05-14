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
      className="sb-container bg-card-muted text-white p-6 lg:p-16 -m-6 lg:m-0 rounded-lg"
    >
      {blok?.body?.map((nestedBlok: SbBlokData) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </div>
  );
};

export default Container;
