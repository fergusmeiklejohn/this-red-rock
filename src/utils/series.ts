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
    const seriesInfo = getSeriesFromPath(post.id);
    
    // Determine if this is a series post
    const isSeriesPost = post.data.series || seriesInfo;
    
    if (!isSeriesPost) {
      standalone.push(post);
    } else {
      // Priority: Use frontmatter series if available, otherwise use path-based grouping
      let seriesKey: string;
      let displayName: string | undefined;
      let path: string[];
      let name: string;
      let parent: string | undefined;
      
      if (post.data.series) {
        // Frontmatter series takes precedence
        seriesKey = post.data.series;
        displayName = post.data.series;
        // If we have path info, use it for structure, otherwise create a simple path
        path = seriesInfo ? seriesInfo.fullPath : [post.data.series];
        name = seriesInfo?.seriesName || post.data.series;
        parent = seriesInfo?.parentSeries;
      } else if (seriesInfo) {
        // Path-based series
        seriesKey = seriesInfo.fullPath.join('/');
        displayName = getSeriesName(post) || undefined;
        path = seriesInfo.fullPath;
        name = seriesInfo.seriesName;
        parent = seriesInfo.parentSeries;
      } else {
        // Should not reach here given the isSeriesPost check
        standalone.push(post);
        return;
      }
      
      if (!seriesMap.has(seriesKey)) {
        seriesMap.set(seriesKey, {
          name,
          path,
          posts: [],
          parent,
          displayName
        });
      }
      
      seriesMap.get(seriesKey)!.posts.push(post);
    }
  });
  
  // Sort posts within each series by date or episode number (most recent first)
  seriesMap.forEach(series => {
    series.posts.sort((a, b) => {
      // First try seriesOrder from frontmatter (reversed for descending order)
      if (a.data.seriesOrder !== undefined && b.data.seriesOrder !== undefined) {
        return b.data.seriesOrder - a.data.seriesOrder;
      }
      
      const aInfo = getSeriesFromPath(a.id);
      const bInfo = getSeriesFromPath(b.id);
      
      // Then try to sort by episode number from path (reversed for descending order)
      if (aInfo?.episodeNumber && bInfo?.episodeNumber) {
        return bInfo.episodeNumber - aInfo.episodeNumber;
      }
      
      // Fall back to date (reversed for most recent first)
      return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
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
 * Each post should only appear in its immediate parent folder
 */
export function createSeriesHierarchy(seriesMap: Map<string, SeriesGroup>): SeriesGroup[] {
  const allSeries = Array.from(seriesMap.values());
  
  // Sort series by path depth (deeper paths first) to properly identify hierarchy
  allSeries.sort((a, b) => b.path.length - a.path.length);
  
  // Create a map to store series by their path for quick lookup
  const seriesByPath = new Map<string, SeriesGroup>();
  allSeries.forEach(series => {
    seriesByPath.set(series.path.join('/'), series);
  });
  
  // Filter to only return top-level series (those without parents in the map)
  const rootSeries = allSeries.filter(series => {
    if (series.path.length === 1) {
      return true; // Top-level series
    }
    
    // Check if parent exists in the series map
    const parentPath = series.path.slice(0, -1).join('/');
    return !seriesByPath.has(parentPath);
  });
  
  return rootSeries;
}