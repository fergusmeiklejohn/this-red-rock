import type { CollectionEntry } from 'astro:content';

export interface SeriesInfo {
  fullPath: string[];
  seriesName: string;
  parentSeries?: string;
  episodeName: string;
  episodeNumber?: number;
}

export interface SeriesGroup {
  name: string;
  path: string[];
  posts: CollectionEntry<'blog'>[];
  parent?: string;
  displayName?: string; // Manual series name from frontmatter
}

/**
 * Extract series information from a post ID
 * e.g., "Researching with Claude/Claude's Research Diary/Day 1" returns series info
 */
export function getSeriesFromPath(id: string): SeriesInfo | null {
  const parts = id.split('/');
  
  if (parts.length < 2) {
    return null; // Not a series post
  }
  
  const episodeName = parts[parts.length - 1];
  const seriesName = parts[parts.length - 2];
  const parentSeries = parts.length > 2 ? parts[parts.length - 3] : undefined;
  
  // Try to extract episode number from name (e.g., "Day 1", "Episode 3", "Part 2")
  const numberMatch = episodeName.match(/(?:Day|Episode|Part)\s+(\d+)/i);
  const episodeNumber = numberMatch ? parseInt(numberMatch[1]) : undefined;
  
  return {
    fullPath: parts.slice(0, -1),
    seriesName,
    parentSeries,
    episodeName,
    episodeNumber
  };
}

/**
 * Get series name from post data or path
 */
export function getSeriesName(post: CollectionEntry<'blog'>): string | null {
  // First check if series is defined in frontmatter
  if (post.data.series) {
    return post.data.series;
  }
  
  // Fall back to path-based detection
  const seriesInfo = getSeriesFromPath(post.id);
  if (seriesInfo) {
    // Format path segments into readable name
    const formattedPath = seriesInfo.fullPath.map(segment => 
      segment.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    ).join(': ');
    return formattedPath;
  }
  
  return null;
}

/**
 * Group posts by their series
 */
export function groupPostsBySeries(posts: CollectionEntry<'blog'>[]): {
  standalone: CollectionEntry<'blog'>[];
  series: Map<string, SeriesGroup>;
} {
  const standalone: CollectionEntry<'blog'>[] = [];
  const seriesMap = new Map<string, SeriesGroup>();
  
  posts.forEach(post => {
    const seriesName = getSeriesName(post);
    const seriesInfo = getSeriesFromPath(post.id);
    
    if (!seriesName && !seriesInfo) {
      standalone.push(post);
    } else {
      // Use frontmatter series name as key if available, otherwise use path
      const seriesKey = post.data.series || (seriesInfo ? seriesInfo.fullPath.join('/') : '');
      
      if (!seriesMap.has(seriesKey)) {
        seriesMap.set(seriesKey, {
          name: seriesInfo?.seriesName || 'Series',
          path: seriesInfo?.fullPath || [],
          posts: [],
          parent: seriesInfo?.parentSeries,
          displayName: seriesName || undefined
        });
      }
      
      seriesMap.get(seriesKey)!.posts.push(post);
    }
  });
  
  // Sort posts within each series by date or episode number
  seriesMap.forEach(series => {
    series.posts.sort((a, b) => {
      const aInfo = getSeriesFromPath(a.id);
      const bInfo = getSeriesFromPath(b.id);
      
      // First try to sort by episode number
      if (aInfo?.episodeNumber && bInfo?.episodeNumber) {
        return aInfo.episodeNumber - bInfo.episodeNumber;
      }
      
      // Fall back to date
      return a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
    });
  });
  
  return { standalone, series: seriesMap };
}

/**
 * Get a display name for a series post
 */
export function getSeriesDisplayName(post: CollectionEntry<'blog'>): string {
  const seriesInfo = getSeriesFromPath(post.id);
  
  if (!seriesInfo) {
    return post.data.title;
  }
  
  // If the title already contains the episode info, use it as is
  if (post.data.title.match(/^(Day|Episode|Part)\s+\d+/i)) {
    return post.data.title;
  }
  
  // Otherwise, prepend the episode name with proper capitalization
  const episodeName = seriesInfo.episodeName;
  const capitalizedName = episodeName.charAt(0).toUpperCase() + episodeName.slice(1);
  return `${capitalizedName}: ${post.data.title}`;
}

/**
 * Create a hierarchical structure for nested series
 */
export function createSeriesHierarchy(seriesMap: Map<string, SeriesGroup>): SeriesGroup[] {
  const rootSeries: SeriesGroup[] = [];
  const processed = new Set<string>();
  
  // First, identify root series (those without parents)
  seriesMap.forEach((series, key) => {
    if (!series.parent && !processed.has(key)) {
      rootSeries.push(series);
      processed.add(key);
    }
  });
  
  // Then, nest child series
  seriesMap.forEach((series, key) => {
    if (series.parent && !processed.has(key)) {
      // Find parent series
      const parentKey = series.path.slice(0, -1).join('/');
      const parentSeries = Array.from(seriesMap.values()).find(s => 
        s.path.join('/') === parentKey
      );
      
      if (parentSeries) {
        // Add posts from child series to parent
        parentSeries.posts.push(...series.posts);
      }
    }
  });
  
  return rootSeries;
}