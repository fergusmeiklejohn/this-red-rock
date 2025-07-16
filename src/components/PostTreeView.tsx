import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, FileText, Folder } from 'lucide-react';
import { clsx } from 'clsx';

interface BlogPost {
  id: string;
  data: {
    title: string;
    description: string;
    series?: string;
    seriesOrder?: number;
  };
}

interface SeriesGroup {
  name: string;
  displayName?: string;
  posts: BlogPost[];
}

interface TreeNode {
  type: 'post' | 'series';
  id: string;
  title: string;
  href?: string;
  children?: TreeNode[];
  postCount?: number;
}

interface PostTreeViewProps {
  posts: BlogPost[];
  currentPath: string;
  standalone: BlogPost[];
  series: Map<string, SeriesGroup>;
}

function TreeItem({ 
  node, 
  level = 0, 
  currentPath,
  expanded,
  onToggle 
}: { 
  node: TreeNode; 
  level?: number; 
  currentPath: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isActive = node.href === currentPath;
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <div>
      <div
        className={clsx(
          'flex items-center gap-1 px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer',
          isActive
            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={hasChildren ? onToggle : undefined}
      >
        {hasChildren && (
          <button
            className="p-0 w-4 h-4 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        
        {node.type === 'series' ? (
          <Folder className="w-4 h-4 flex-shrink-0" />
        ) : (
          <FileText className="w-3.5 h-3.5 flex-shrink-0" />
        )}
        
        {node.href ? (
          <a
            href={node.href}
            className="flex-1 truncate"
            title={node.title}
            onClick={(e) => e.stopPropagation()}
          >
            {node.title}
          </a>
        ) : (
          <span className="flex-1 truncate" title={node.title}>
            {node.title}
          </span>
        )}
        
        {node.postCount && (
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
            {node.postCount}
          </span>
        )}
      </div>
      
      {hasChildren && expanded && (
        <div className="mt-0.5">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              currentPath={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TreeNode({ 
  node, 
  level = 0, 
  currentPath 
}: { 
  node: TreeNode; 
  level?: number; 
  currentPath: string;
}) {
  const [expanded, setExpanded] = useState(() => {
    // Auto-expand if this series contains the current post
    if (node.type === 'series' && node.children) {
      return node.children.some(child => child.href === currentPath);
    }
    return false;
  });

  return (
    <TreeItem
      node={node}
      level={level}
      currentPath={currentPath}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    />
  );
}

export function PostTreeView({ posts, currentPath, standalone, series }: PostTreeViewProps) {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    const nodes: TreeNode[] = [];
    
    // Add standalone posts
    standalone.forEach(post => {
      nodes.push({
        type: 'post',
        id: post.id,
        title: post.data.title,
        href: `/${post.id}/`,
      });
    });
    
    // Add series - iterate through the Map
    if (series && series.size > 0) {
      series.forEach((group, seriesKey) => {
        const seriesNode: TreeNode = {
          type: 'series',
          id: seriesKey,
          title: group.displayName || group.name || seriesKey,
          postCount: group.posts.length,
          children: [],
        };
        
        // Sort posts by seriesOrder or date
        const sortedPosts = [...group.posts].sort((a, b) => {
          if (a.data.seriesOrder !== undefined && b.data.seriesOrder !== undefined) {
            return a.data.seriesOrder - b.data.seriesOrder;
          }
          return 0;
        });
        
        sortedPosts.forEach((post) => {
          // Extract episode name from the post ID
          const pathParts = post.id.split('/');
          const episodeName = pathParts[pathParts.length - 1];
          const formattedName = episodeName.charAt(0).toUpperCase() + episodeName.slice(1);
          
          seriesNode.children!.push({
            type: 'post',
            id: post.id,
            title: `${formattedName}: ${post.data.title}`,
            href: `/${post.id}/`,
          });
        });
        
        nodes.push(seriesNode);
      });
    }
    
    setTreeData(nodes);
  }, [posts, standalone, series]);

  return (
    <div className="space-y-0.5">
      {treeData.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          currentPath={currentPath}
        />
      ))}
    </div>
  );
}