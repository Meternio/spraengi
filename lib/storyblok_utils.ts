import type { ISbStoryData } from "@storyblok/react/rsc";

export const fetchStory = async (
  version: "draft" | "published",
  slug?: string[]
) => {
  const correctSlug = `/${slug ? slug.join("/") : "home"}`;

  return fetch(
    `
    https://api.storyblok.com/v2/cdn/stories${correctSlug}?version=${version}&token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`,
    {
      next: { tags: ["cms"] },
      cache: version === "published" ? "default" : "no-store",
    }
  ).then((res) => res.json()) as Promise<{ story: ISbStoryData }>;
};

export const fetchContentType = async (
  folder: string,
  version: "draft" | "published",
  limit?: number,
  dateFilters?: Record<string, string | number>,
  sort?: { field: string; order: "asc" | "desc" }
) => {
  const url = new URL("https://api.storyblok.com/v2/cdn/stories");
  url.searchParams.append("starts_with", folder);
  url.searchParams.append("version", version);
  url.searchParams.append(
    "token",
    process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || ""
  );
  if (limit) {
    url.searchParams.append("per_page", limit.toString());
  }
  if (dateFilters) {
    Object.entries(dateFilters).forEach(([key, value]) => {
      url.searchParams.append(
        `filter_query[${key}][gt_date]`,
        value.toString()
      );
    });
  }

  if (sort) {
    url.searchParams.append("sort_by", `${sort.field}:${sort.order}`);
  }

  const response = await fetch(url.toString(), {
    next: { tags: ["cms"] },
    cache: version === "published" ? "default" : "no-store",
  });
  const data = await response.json();

  return data.stories as ISbStoryData[];
};

export const fetchDatasource = async (
  slug: string | string[],
  version: "draft" | "published"
) => {
  // Helper function to normalize entries
  const normalizeEntries = (entries: [{ name: string; value: string }]) => {
    const normalized: Record<string, string> = {};
    entries.forEach((entry) => {
      normalized[entry.name] = entry.value;
    });
    return normalized;
  };

  // For a single datasource
  if (!Array.isArray(slug)) {
    const url = new URL("https://api.storyblok.com/v2/cdn/datasource_entries");
    url.searchParams.append("datasource", slug);
    url.searchParams.append(
      "token",
      process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || ""
    );
    url.searchParams.append("_", Date.now().toString());

    const response = await fetch(url.toString(), {
      next: { tags: ["cms"] },
      cache: version === "published" ? "default" : "no-store",
    });
    const data = await response.json();
    const entries = data.datasource_entries || [];

    // Just use the normalized format
    const result: Record<string, Record<string, string>> = {
      [slug]: normalizeEntries(entries),
    };

    return {
      datasources: result,
    };
  }

  // For multiple datasources, create separate promises and fetch in parallel
  const promiseResults = await Promise.all(
    slug.map(async (singleSlug) => {
      const url = new URL(
        "https://api.storyblok.com/v2/cdn/datasource_entries"
      );
      url.searchParams.append("datasource", singleSlug);
      url.searchParams.append(
        "token",
        process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || ""
      );
      url.searchParams.append("_", Date.now().toString());

      const response = await fetch(url.toString(), {
        next: { tags: ["cms"] },
        cache: "default",
      });
      const data = await response.json();
      const entries = data.datasource_entries || [];

      // Return only the slug and normalized data
      return {
        slug: singleSlug,
        normalized: normalizeEntries(entries),
      };
    })
  );

  // Convert to object with slug as key and just the normalized values
  const result: Record<string, Record<string, string>> = {};
  promiseResults.forEach((item) => {
    result[item.slug] = item.normalized;
  });

  return {
    datasources: result,
  };
};
