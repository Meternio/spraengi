import { apiPlugin, storyblokInit, ISbResponse } from "@storyblok/react/rsc";

import Page from "@/components/Page";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import Button from "@/components/Button";

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  use: [apiPlugin],
  components: {
    page: Page,
    hero: Hero,
    section: Section,
    button: Button,
  },
});

export const fetchStory = async (version: 'draft' | 'published', slug?: string[]) => {
    getStoryblokApi();
    const correctSlug = `/${slug ? slug.join('/') : 'home'}`

    return fetch(`
    https://api.storyblok.com/v2/cdn/stories${correctSlug}?version=${version}&token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`,
        { next: { tags: ['cms'] }, cache: version === 'published' ? 'default' : 'no-store' }
    ).then((res) => res.json()) as Promise<{ story: ISbResponse }>;
}

export const fetchDatasource = async (slug: string | string[]) => {
    getStoryblokApi();

    // Helper function to normalize entries
    const normalizeEntries = (entries: [{name: string; value: string}]) => {
        const normalized: Record<string, string> = {};
        entries.forEach(entry => {
            normalized[entry.name] = entry.value;
        });
        return normalized;
    };

    // For a single datasource
    if (!Array.isArray(slug)) {
        const url = new URL('https://api.storyblok.com/v2/cdn/datasource_entries');
        url.searchParams.append('datasource', slug);
        url.searchParams.append('token', process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || '');

        const response = await fetch(url.toString(), { 
            next: { tags: ['cms'] }, 
            cache: 'no-store' 
        });
        const data = await response.json();
        const entries = data.datasource_entries || [];
        
        // Just use the normalized format
        const result: Record<string, Record<string, string>> = {
            [slug]: normalizeEntries(entries)
        };
        
        return {
            datasources: result
        };
    }
    
    // For multiple datasources, create separate promises and fetch in parallel
    const promiseResults = await Promise.all(
        slug.map(async singleSlug => {
            const url = new URL('https://api.storyblok.com/v2/cdn/datasource_entries');
            url.searchParams.append('datasource', singleSlug);
            url.searchParams.append('token', process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || '');

            const response = await fetch(url.toString(), { 
                next: { tags: ['cms'] }, 
                cache: 'no-store' 
            });
            const data = await response.json();
            const entries = data.datasource_entries || [];
            
            // Return only the slug and normalized data
            return {
                slug: singleSlug,
                normalized: normalizeEntries(entries)
            };
        })
    );
    
    // Convert to object with slug as key and just the normalized values
    const result: Record<string, Record<string, string>> = {};
    promiseResults.forEach(item => {
        result[item.slug] = item.normalized;
    });
    
    return {
        datasources: result
    };
};