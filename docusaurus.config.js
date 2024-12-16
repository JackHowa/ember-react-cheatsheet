// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Ember to React cheat sheet",
  tagline: "Ember is cool but React is where devs are going.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://ember-to-react.netlify.app/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // via https://docusaurus.io/docs/deployment#docusaurusconfigjs-settings
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  themes: ["@docusaurus/theme-live-codeblock"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/JackHowa/ember-react-cheat-sheet/tree/main",
        },
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ["rss", "atom"],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     "https://github.com/JackHowa/ember-react-cheat-sheet/tree/main/packages/create-docusaurus/templates/shared/",
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: "warn",
        //   onInlineAuthors: "warn",
        //   onUntruncatedBlogPosts: "warn",
        // },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        // The application ID provided by Algolia
        appId: "BU87XCRIDV",

        // Public API key: it is safe to commit it
        apiKey: "decc2adee6eb8b2f7438431e2f861116",

        indexName: "ember-to-react",

        // Optional: see doc section below
        contextualSearch: true,

        // Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: "external\\.com|domain\\.com",

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        // replaceSearchResultPathname: {
        //   from: "/docs/", // or as RegExp: /\/docs\//
        //   to: "/",
        // },

        // Optional: Algolia search parameters
        // searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        // searchPagePath: "search",

        // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
        insights: true,
      },
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Ember to React cheat sheet",
        logo: {
          alt: "Ember to React cheat sheet Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Help",
          },
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Examples",
            href: "/docs/category/examples",
          },
          {
            href: "https://github.com/JackHowa/ember-react-cheat-sheet",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Help",
                to: "/docs/intro",
              },
              {
                label: "Examples",
                href: "/docs/category/examples",
              },
            ],
          },
          {
            title: "General Resources",
            items: [
              {
                label: "React docs",
                href: "https://react.dev/learn",
              },
              {
                label: "Frontend Masters React",
                href: "https://frontendmasters.com/courses/?q=react&c=courses&dg=1",
              },
              {
                label: "Ember docs (3.24)",
                href: "https://guides.emberjs.com/v3.24.0/",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Expel`,
      },
      prism: {
        theme: prismThemes.github,
        // see fix https://github.com/shipshapecode/ember-prism/issues/29
        additionalLanguages: ["handlebars", "markup-templating"],
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
