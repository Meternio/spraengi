import type { ISbStoryData } from "@storyblok/react/rsc";
import { SB_CACHE_VERSION_TAG } from "@/lib/cacheTags";

let cachedCv: number | undefined;
let cvCacheTimestamp: number | undefined;
const CV_CACHE_DURATION = 60 * 1000;

async function getCacheVersion(): Promise<number | undefined> {
  if (
    cachedCv &&
    cvCacheTimestamp &&
    Date.now() - cvCacheTimestamp < CV_CACHE_DURATION
  ) {
    return cachedCv;
  }

  try {
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/spaces/me?token=${process.env.NEXT_PUBLIC_STORYBLOK_TOKEN}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (!response.ok) {
      console.error(
        "Failed to fetch Storyblok space data:",
        response.statusText
      );
      return undefined;
    }
    const spaceData = await response.json();
    cachedCv = spaceData.space.version;
    cvCacheTimestamp = Date.now();
    return cachedCv;
  } catch (error) {
    console.error("Error fetching Storyblok cache version:", error);
    return undefined;
  }
}

export const fetchStory = async (
  version: "draft" | "published",
  slug?: string[]
): Promise<{ story: ISbStoryData } | null> => {
  const pageSlug = slug && slug.length > 0 ? slug.join("/") : "home";
  const correctSlug = pageSlug.startsWith("/") ? pageSlug : `/${pageSlug}`;

  const params = new URLSearchParams();
  params.append("version", version);
  params.append("token", process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || "");

  if (version === "published") {
    const cv = await getCacheVersion();
    if (cv) {
      params.append("cv", cv.toString());
    }
  }

  try {
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/stories${correctSlug}?${params.toString()}`,
      {
        next: { tags: [SB_CACHE_VERSION_TAG] },
        cache: version === "published" ? "force-cache" : "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch story: ${correctSlug}`,
        response.status,
        await response.text()
      );
      return null;
    }
    return response.json() as Promise<{ story: ISbStoryData }>;
  } catch (error) {
    console.error(`Error in fetchStory for slug ${correctSlug}:`, error);
    return null;
  }
};

export const fetchContentType = async (
  folder: string,
  version: "draft" | "published",
  limit?: number,
  dateFilters?: Record<string, string | number>,
  sort?: { field: string; order: "asc" | "desc" }
): Promise<ISbStoryData[]> => {
  const url = new URL("https://api.storyblok.com/v2/cdn/stories");
  url.searchParams.append("starts_with", folder);
  url.searchParams.append("version", version);
  url.searchParams.append(
    "token",
    process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || ""
  );

  if (version === "published") {
    const cv = await getCacheVersion();
    if (cv) {
      url.searchParams.append("cv", cv.toString());
    }
  }

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
    next: { tags: [SB_CACHE_VERSION_TAG] },
    cache: version === "published" ? "force-cache" : "no-store",
  });
  if (!response.ok) {
    console.error(
      `Failed to fetch content type: ${folder}`,
      response.status,
      await response.text()
    );
    return [];
  }
  const data = await response.json();
  return (data.stories as ISbStoryData[]) || [];
};

export const fetchDatasource = async (
  slug: string | string[],
  version: "draft" | "published"
) => {
  const cv = version === "published" ? await getCacheVersion() : undefined;

  const normalizeEntries = (entries: [{ name: string; value: string }]) => {
    const normalized: Record<string, string> = {};
    if (Array.isArray(entries)) {
      entries.forEach((entry) => {
        normalized[entry.name] = entry.value;
      });
    }
    return normalized;
  };

  const fetchSingleDatasource = async (singleSlug: string) => {
    const url = new URL(
      "https://api.storyblok.com/v2/cdn/datasource_entries"
    );
    url.searchParams.append("datasource", singleSlug);
    url.searchParams.append(
      "token",
      process.env.NEXT_PUBLIC_STORYBLOK_TOKEN || ""
    );
    if (version === "published" && cv) {
      url.searchParams.append("cv", cv.toString());
    }

    const response = await fetch(url.toString(), {
      next: { tags: [SB_CACHE_VERSION_TAG] },
      cache: version === "published" ? "force-cache" : "no-store",
    });
    if (!response.ok) {
      console.error(
        `Failed to fetch datasource: ${singleSlug}`,
        response.status,
        await response.text()
      );
      return { slug: singleSlug, normalized: {} };
    }
    const data = await response.json();
    const entries = data.datasource_entries || [];
    return {
      slug: singleSlug,
      normalized: normalizeEntries(entries),
    };
  };

  if (!Array.isArray(slug)) {
    const singleResult = await fetchSingleDatasource(slug);
    return {
      datasources: {
        [singleResult.slug]: singleResult.normalized,
      },
    };
  }

  const promiseResults = await Promise.all(slug.map(fetchSingleDatasource));
  const result: Record<string, Record<string, string>> = {};
  promiseResults.forEach((item) => {
    result[item.slug] = item.normalized;
  });

  return {
    datasources: result,
  };
};
