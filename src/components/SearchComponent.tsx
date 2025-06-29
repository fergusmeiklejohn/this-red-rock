import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface BlogPost {
  id: string;
  data: {
    title: string;
    description: string;
    excerpt?: string;
    tags: string[];
    theme?: string;
    pubDate: Date;
  };
}

interface SearchComponentProps {
  posts: BlogPost[];
}

export default function SearchComponent({ posts }: SearchComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (postId: string) => {
    setIsOpen(false);
    window.location.href = `/${postId}/`;
  };

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-600 dark:text-gray-400"
        aria-label="Search posts"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 max-w-2xl top-[20%] translate-y-0 border-2 border-gray-300 dark:border-gray-600">
          <Command className="rounded-lg border-0 shadow-lg">
            <CommandInput
              placeholder="Search posts... (⌘K to open)"
              className="border-0 focus:ring-0"
            />
            <CommandList className="max-h-96">
              <CommandEmpty className="py-8 text-center text-muted-foreground">
                No posts found.
              </CommandEmpty>
              <CommandGroup heading="Posts">
                {posts.map((post) => {
                  // Create searchable keywords for Command's built-in filtering
                  const keywords = [
                    post.data.title,
                    post.data.description,
                    post.data.excerpt || '',
                    post.data.theme || '',
                    ...post.data.tags
                  ].join(' ');

                  return (
                    <CommandItem
                      key={post.id}
                      value={keywords}
                      onSelect={() => handleSelect(post.id)}
                      className="cursor-pointer p-4 hover:bg-accent transition-colors"
                    >
                      <div className="flex flex-col gap-2 w-full">
                        <div className="font-medium text-foreground">
                          {post.data.title}
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {post.data.excerpt || post.data.description}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {post.data.theme && (
                            <span className="px-2 py-1 bg-muted rounded-md">
                              {post.data.theme}
                            </span>
                          )}
                          <span>
                            {new Date(post.data.pubDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}