import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'sonner-native',
  tagline: 'Animated, customizable Toasts for React Native',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://sonner-native.netlify.app',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'gunnartorfis', // Usually your GitHub org/user name.
  projectName: 'sonner-native', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        blog: false,
        docs: {
          routeBasePath: '/', // Serve the docs at the site's root.
          sidebarPath: './sidebars.ts',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'sonner-native',
      logo: {
        alt: 'sonner-native Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'defaultSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/gunnartorfis/sonner-native',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Made by Gunnar',
              href: 'https://twitter.com/gunnarthedev',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/gunnartorfis/sonner-native',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} sonner-native, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
