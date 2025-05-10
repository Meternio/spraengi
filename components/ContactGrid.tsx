import {
  SbBlokData,
  storyblokEditable,
  StoryblokServerComponent,
} from "@storyblok/react/rsc";
import { ContactGridStoryblok } from "@/component-types-sb";
import Title from "@/components/Title";

const ContactGrid: React.FC<{ blok: ContactGridStoryblok }> = ({ blok }) => {
  return (
    <div
      {...storyblokEditable(blok)}
      className="flex flex-row flex-wrap lg:flex-nowrap items-center justify-center w-full gap-6"
    >
      <div className="relative w-full h-96">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={blok.google_maps_link}
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        ></iframe>

        <div
          className={`absolute top-0 left-0 w-full h-full bg-neutral-800/30 pointer-events-none`}
          aria-hidden="true"
        ></div>
      </div>
      <div className="flex flex-col w-full">
        <Title variant="h2">{blok.title}</Title>
        <div className="flex flex-col">
          {blok?.icon_blocks?.map((nestedBlok: SbBlokData) => (
            <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactGrid;
