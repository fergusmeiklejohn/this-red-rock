// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://this-red-rock.com',
  integrations: [mdx(), sitemap(), tailwind(), react()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },

    imageService: "passthrough"
  }),
});