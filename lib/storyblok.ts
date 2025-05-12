import { apiPlugin, storyblokInit } from "@storyblok/react/rsc";

import Page from "@/components/Page";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import Button from "@/components/Button";
import EventGrid from "@/components/EventGrid";
import Cta from "@/components/Cta";
import Carousel from "@/components/Carousel";
import Card from "@/components/Card";
import IconBlockGrid from "@/components/IconBlockGrid";
import IconBlock from "@/components/IconBlock";
import ContactGrid from "@/components/ContactGrid";
import Container from "@/components/Container";

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  use: [apiPlugin],
  components: {
    page: Page,
    hero: Hero,
    section: Section,
    button: Button,
    event_grid: EventGrid,
    cta: Cta,
    carousel: Carousel,
    card: Card,
    icon_block_grid: IconBlockGrid,
    icon_block: IconBlock,
    contact_grid: ContactGrid,
    container: Container,
  },
});