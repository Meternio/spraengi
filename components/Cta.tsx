import { storyblokEditable } from "@storyblok/react/rsc";
import { CtaStoryblok, ButtonStoryblok } from "@/component-types-sb";
import Button from "@/components/Button";
import Title from "@/components/Title";

const Cta: React.FC<{ blok: CtaStoryblok }> = ({ blok }) => {

  const chooseBackgroundColor = (variant?: string) => {
    switch (variant) {
      case "dark":
        return "bg-[#111111]";
      case "bright":
        return "bg-[#171717]";
      default:
        return "";
    }
  };

  return (
    <div
      {...storyblokEditable(blok)}
      className={`flex flex-col md:flex-row md:items-center p-6 text-white rounded-lg gap-6 ${
        chooseBackgroundColor(blok.variant)
      }`}
    >
      <div className="flex flex-col gap-4 flex-grow max-w-2xl">
        <Title variant={blok.description ? "h3" : "h2"}>
          {blok.title}
        </Title>
        {blok.description && (
          <span>{blok.description}</span>
        )}
      </div>
      <div className="flex flex-col gap-4 md:ml-auto">
        {blok.buttons?.map((button) => (
          <Button key={button._uid} blok={button as ButtonStoryblok} />
        ))}
      </div>
    </div>
  );
};

export default Cta;
