import {
  AllPostQueryVariables,
  Metadata,
  PaginationInput,
  Post
} from '@/configs/graphql/generated';
import { useApiClient } from '@/libraries/providers/graphql';
import { getErrorMss } from '@/utils/helpers/formatter';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type AdminCareerUtilsResult = {
  data: Post[];
  metadata?: Metadata;
  loading: boolean;
  pagination: PaginationInput;
  setPagination: (value: PaginationInput) => void;
  setSearchValue: (value: string) => void;
};
export function AdminCareerUtils(): AdminCareerUtilsResult {
  const result = {
    data: [
      {
        id: '7a0bb39c-939d-4dd4-8d8b-b5e13d941189',
        title: 'React Compiler: What Is It and How Will It Change Frontend Development?',
        content:
          '<p>React 18 has been around for more than two years, and it is finally time to welcome React 19. The main innovation introduced, the one we all love is the React Compiler! It promises to forever simplify frontend development by eliminating the need for manual memoization optimizations.</p><p>In this guide, you will understand what React Compiler is, how it works, what benefits it introduces, and how to prepare your application.</p><p>What React 19 Brings To the Table</p><p>React 19, to be released at&nbsp;<a href="https://conf.react.dev/" rel="noopener noreferrer" target="_blank">React Conf 2024</a>&nbsp;on May 15-16, 2024, is the long-awaited next version of this framework. React 18 was released in 2022, and since then, web technologies have evolved greatly. It is high time for an update.</p><p><img src="https://semaphoreci.com/wp-content/uploads/2024/05/68747470733a2f2f692e696d6775722e636f6d2f76314f32344f452e706e67-1056x594.png"></p><p>Not only will version 19 be a step forward but it promises to forever change the way developers build applications in React. Some of the most exciting features React 19 plans to introduce are:</p><ul><li><strong>Server components</strong>: Server-side rendering of components for faster page loading and better SEO. By processing components on the server before delivering the page to users, React 19 enables faster website loading times, improved search engine visibility, and smoother data management. Next.js already uses&nbsp;<a href="https://nextjs.org/docs/app/building-your-application/rendering/server-components" rel="noopener noreferrer" target="_blank">this feature</a>.</li><li><strong>Actions</strong>: Streamline the management of data and interactions within web pages.&nbsp;<a href="https://react.dev/blog/2024/02/15/react-labs-what-we-have-been-working-on-february-2024#actions" rel="noopener noreferrer" target="_blank">Actions</a>&nbsp;make it easier to update page information through forms, removing complexities and simplifying the user experience.</li><li><strong>Optimized asset loading</strong>: Background loading of site assets for smoother page changes. React 19 can begin loading images and other files in the background while users are still browsing the current page, reducing wait times during page transitions.</li><li><strong>Document metadata</strong>: Streamlined SEO management thanks to the new&nbsp;&lt;DocumentHead&gt;&nbsp;component. Adding titles and meta tags to pages will be more intuitive, improving search engine optimization without the need for repetitive coding.</li><li><strong>Web components</strong>: Improved compatibility with the&nbsp;<a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components" rel="noopener noreferrer" target="_blank">Web Components</a>&nbsp;standard for more flexible and compatible frontend development.</li><li><strong>Enhanced hooks</strong>: Greater control over the lifecycle and state of components through both existing and new hooks. The end goal is to simplify the coding process, making React development more efficient and enjoyable.</li><li><strong>React compiler</strong>: Automatic conversion of React code into standardized, optimized JavaScript code. It allows compiled React code to automatically render only the right parts of the UI when the state changes, reducing the need for&nbsp;useMemo,&nbsp;useCallback, and&nbsp;memo. This means faster React applications with simplified codebases.</li></ul><p>All of these features are great, sure, but what stands out is React Compiler. This upgrade promises to change React development forever. Let’s now try to understand the why behind it and what benefits it will introduce!</p><p>React Compiler: Everything You Need to Know</p><p>Dig into the React 19 Compiler tool, exploring what it is and how it works.</p><p>React’s Core Mental Model</p><p>To understand the why behind React Compiler, you first need to delve into some key React concepts.</p><p>At the heart of React is a declarative and component-based mental model. In frontend development,&nbsp;<a href="https://www.techtarget.com/searchitoperations/definition/declarative-programming" rel="noopener noreferrer" target="_blank">declarative programming</a>involves describing the desired end state of the UI without specifying each step to get there through DOM manipulation. Meanwhile, the component-based approach breaks down UI elements into reusable, concise, self-contained building blocks, promoting modularization and ease of maintenance.</p><p>To efficiently identify specific DOM elements that require updates, React employs an in-memory representation of the user interface called the&nbsp;<a href="https://legacy.reactjs.org/docs/faq-internals.html" rel="noopener noreferrer" target="_blank">virtual DOM</a>. In case of changes to the application state, React compares the virtual DOM with the real DOM, identifies the minimum set of changes needed, and accurately updates the real DOM.</p><p>In short, the mental model is that React re-renders whenever the state of the application changes. However, sometimes React can be too reactive, resulting in unnecessary re-renders that significantly slow down your application.</p><p>Re-Rendering Hell: The Need for a Compiler</p><p>React’s agility in responding to changes in application state is a double-edged sword. On the one hand, it simplifies frontend development due to its declarative approach. On the other, it can lead to excessive re-rendering of the components in the UI in response of state changes.</p><p>Re-rendering problems are particularly common when dealing with JavaScript data structures such as objects and arrays. The problem is that there is no computationally efficient way to compare two objects and arrays to see if they are equivalent (have the same keys and values) in JavaScript.</p><p>Consider the following scenario. You have a React component that generates a new object or array upon each render, as in the example below:</p><p>import React from "react";</p><p><br></p><p>const AlphabetList = () =&gt; {</p><p>  // define the alphabet array</p><p>  const alphabet = Array.from({ length: 26 }, (_, i) =&gt; String.fromCharCode(65 + i));</p><p><br></p><p>  return (</p><p>    &lt;div&gt;</p><p>      &lt;h2&gt;Alphabet List&lt;/h2&gt;</p><p>      &lt;ul&gt;</p><p>        {/* render the alphabet as list items */}</p><p>        {alphabet.map((letter, index) =&gt; (</p><p>          &lt;li key={index}&gt;{letter}&lt;/li&gt;</p><p>        ))}</p><p>      &lt;/ul&gt;</p><p>    &lt;/div&gt;</p><p>  );</p><p>};</p><p><br></p><p>export default AlphabetList;</p><p>Although the content of the local array will be the same at each rendering, React cannot efficiently know that. As a result, it may trigger a re-render in the nested DOM elements of the component relying on the values in that array, unaware that the UI should remain identical. This re-rendering mechanism can quickly spiral out of control, significantly impacting application performance and user experience.</p><p>To optimize re-rendering behavior and avoid those issues, React developers must manually introduce memoization into their components. In React,&nbsp;<a href="https://en.wikipedia.org/wiki/Memoization" rel="noopener noreferrer" target="_blank">memoization</a>&nbsp;involves caching the results of expensive computations or component outputs based on their input parameters. By storing and reusing these results, memoization helps prevent unnecessary re-reading of components, improving the overall efficiency and performance of a React application.</p><p>React 18 provides several memoization tools:</p><ul><li><a href="https://react.dev/reference/react/memo" rel="noopener noreferrer" target="_blank">React.memo()</a>: A higher-order function to avoid re-rendering a component when its props remain unchanged.</li><li><a href="https://react.dev/reference/react/useMemo" rel="noopener noreferrer" target="_blank">useMemo()</a>: A React hook that caches the result of a calculation between re-renders, reducing redundant computations.</li><li><a href="https://react.dev/reference/react/useCallback" rel="noopener noreferrer" target="_blank">useCallback()</a>: A hook from React that caches the definition of a function between re-renders, avoiding unnecessary recreations of functions. Learn more in our guide to the&nbsp;<a href="https://semaphoreci.com/blog/react-usecallback-hook" rel="noopener noreferrer" target="_blank">React&nbsp;useCallback()&nbsp;hook</a>.</li></ul><p>Thanks to the&nbsp;useMemo()&nbsp;hook, you can optimize the&nbsp;&lt;AlphabetList&gt;&nbsp;component to avoid unnecessary re-renders as follows:</p><p>import React, { useMemo } from "react";</p><p><br></p><p>const AlphabetList = () =&gt; {</p><p>  // define the alphabet array via useMemo()</p><p>  const alphabet = useMemo(() =&gt; {</p><p>    return Array.from({ length: 26 }, (_, i) =&gt; String.fromCharCode(65 + i));</p><p>    // no dependencies, so it will only be calculated once on the first render</p><p>  }, []);</p><p><br></p><p>  return (</p><p>    &lt;div&gt;</p><p>      &lt;h2&gt;Alphabet List&lt;/h2&gt;</p><p>      &lt;ul&gt;</p><p>        {/* render the alphabet as list items */}</p><p>        {alphabet.map((letter, index) =&gt; (</p><p>          &lt;li key={index}&gt;{letter}&lt;/li&gt;</p><p>        ))}</p><p>      &lt;/ul&gt;</p><p>    &lt;/div&gt;</p><p>  );</p><p>};</p><p><br></p><p>export default AlphabetList;</p><p>The memoization tools offered by React are certainly powerful. At the same time, their introduction is nothing more than a clear departure from the declarative philosophy underlying React’s core mental model. This is because the burden falls on developers, who must not only describe the final state of the UI but also explicitly manage rendering optimizations. Manual memoization also introduces code complexity and maintenance headaches.</p><p>The solution? An advanced compiler capable of converting React code into optimized JavaScript code, so that components are automatically re-rendered only in case of&nbsp;<em>significant</em>&nbsp;changes in state values.</p><p>What Is React Compiler?</p><p>React Compiler, also known as&nbsp;<a href="https://react.dev/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#react-compiler" rel="noopener noreferrer" target="_blank">React Forget</a>, is an optimizing compiler for React. It now powers Instagram’s web portal in production and will be deployed on other Meta applications before its first open-source release.</p><p>The original goal of the compiler was to enforce React’s core programming model by automatically generating the equivalent of&nbsp;memo,&nbsp;useMemo, and&nbsp;useCallback&nbsp;calls to minimize the cost of re-rendering. The project has evolved greatly from its beginnings, moving from an “auto-memoizing compiler” to an “automatic reactivity compiler.”</p><p>The real objective of React Forget is now to ensure that React applications have the right amount of reactivity by default. In other words, apps should re-render only when state values&nbsp;<em>meaningfully</em>&nbsp;change. Currently, React re-renders a component when object identity changes. With React Forget, it will re-render only&nbsp;<em>when the semantic value of an object changes</em>&nbsp;— but without incurring the runtime cost of deep comparisons.</p><p>From an implementation point of view, React Compiler applies automatic memoization. However, the team behind it considers&nbsp;<em>reactivity framing</em>&nbsp;as a more complete way to understand what it does. If you want to learn more about the inner workings and logic of the React compiler,&nbsp;<a href="https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler" rel="noopener noreferrer" target="_blank">read the React Labs section dedicated to it</a>.</p><p>See React Forget in action in the video below:&nbsp;<a href="https://www.youtube.com/watch?v=qOQClO3g8-Y&amp;" rel="noopener noreferrer" target="_blank">https://www.youtube.com/watch?v=qOQClO3g8-Y&amp;</a></p><p>While JavaScript is a notoriously difficult language to optimize because of its dynamic nature and loose rules, React Compiler can compile code safely by modeling both JavaScript rules and the “<a href="https://react.dev/reference/rules" rel="noopener noreferrer" target="_blank">rules of React</a>.” These rules limit what developers can do, helping to carve out a safe space for the compiler to perform its optimizations.</p><p>The Rules of React</p><p>React comes with a set of rules that are intended to support high-quality web applications. Developers should follow these rules, which also represent what React Compiler is based on.</p><p>Some of the most important rules of React are:</p><ul><li><strong>Components must be idempotent</strong>: React components should always produce the same output given the same set of inputs, which include props, state, and context.</li><li><strong>Side effects must run outside of render</strong>: Side effects, such as data fetching, subscriptions, or manually changing the DOM, should not be performed during the rendering process of a component. Instead, they should be executed in lifecycle hooks like&nbsp;useEffect.</li><li><strong>Props and state are immutable</strong>: Props and state in React components should be treated as immutable, meaning they should not be directly modified. Changing props or state directly can lead to bugs and unpredictable behavior.</li><li><strong>Return values and arguments to hooks are immutable</strong>: Once values are passed to a React hook, they should not be modified. Hooks rely on the immutability of their arguments and return values to maintain consistency and predictability in component behavior.</li><li><strong>Values are immutable after being passed to JSX</strong>: Do not mutate values used in JSX after this has been rendered. Any necessary mutations should be performed before the JSX is created to ensure that the rendered output remains consistent.</li><li><strong>Never call component functions directly</strong>: React components should only be used within JSX and not called directly as regular functions.</li><li><strong>Never pass around hooks as regular values</strong>: React hooks, such as&nbsp;useState&nbsp;and&nbsp;useEffect, should only be called inside functional components. Using them as regular values can lead to unexpected behavior and violate the rules of hooks.</li><li><strong>Only call hooks at the top level</strong>: React hooks should always be called at the top level of functional components, before any conditional statements or loops. This ensures that hooks are called in the same order on every render and maintain their intended behavior.</li><li><strong>Only call hooks from React functions</strong>: Hooks should only be called from within React function components or custom hooks. Calling hooks from regular JavaScript functions can lead to errors and violate the rules of hooks.</li></ul><p><a href="https://react.dev/reference/react/StrictMode" rel="noopener noreferrer" target="_blank">Enable Strict Mode</a>&nbsp;and&nbsp;<a href="https://react.dev/learn/editor-setup#linting" rel="noopener noreferrer" target="_blank">configure React’s ESLint plugin</a>&nbsp;to make sure that your React application follows these rules.</p><p>Benefits and Hopes</p><p>The main benefits introduced by React Compiler are:</p><ul><li><strong>No more memoization headaches</strong>: Developers no longer have to manually implement and manage memoization strategies in their code. This reduces complexity and the likelihood of errors, streamlining the development process.</li><li><strong>Better developer experience</strong>: Developers can focus more on building features and less on performance optimization, leading to increased productivity and satisfaction. They will finally be able to fully embrace the React declarative approach.</li><li><strong>Faster React applications</strong>: Render components only when necessary, minimizing unnecessary computations and overhead. This results in faster and more responsive user interfaces, improving overall performance and user experience.</li></ul><p>These are all promising changes, but we have yet to see what effect this new tool will have on code development. To ensure that the compiler does its job, your code must follow the rules of React. Here is why the official team recommends adopting ESLint and similar tools to prepare your application for React Compiler.</p><p>React Compiler: A Frontend Revolution?</p><p>It is difficult to say soon whether the React Compiler will be enough to spark a real revolution in the realm of frontend development. What is for sure is that it has all the credentials to significantly change the development of future React applications. By introducing automatic memoization, this compiler can automatically speed up React applications and improve the developer experience. These are just some of the benefits this promising ambitious project brings to the tabl.</p><p>React Conf 2024 is just around the corner, and we look forward to seeing what breakthroughs this ambitious project will have on the frontend world!</p>',
        shareUrl: 'https://semaphoreci.com/blog/react-compiler?ref=dailydev',
        metadata: {
          url: 'https://semaphoreci.com/blog/react-compiler',
          title:
            'React Compiler: What Is It and How Will It Change Frontend Development? - Semaphore',
          imageUrl:
            'https://semaphoreci.com/wp-content/uploads/2024/05/68747470733a2f2f692e696d6775722e636f6d2f76314f32344f452e706e67-1056x594.png',
          originUrl: 'https://semaphoreci.com/blog/react-compiler?ref=dailydev',
          description:
            'Understand what React Compiler is, how it works, what benefits it introduces, and how to prepare your application.'
        },
        slug: 'react-compiler-what-is-it-and-how-will-it-change-frontend-development',
        minRead: 11,
        thumbnails: null,
        jobCategory: {
          id: '123cd1fc-58a0-4a4f-8a8e-9c24b98be035',
          name: 'Information Technology Services'
        },
        categories: null,
        tags: [
          {
            id: '4415a884-6d9c-48b7-b999-907f7a452f29',
            type: 'post',
            name: 'How Do I Choose A Career?',
            color: '#5bec2c'
          },
          {
            id: '716573d9-2329-4d58-b71a-5891bacc748c',
            type: 'post',
            name: 'What Should I Learn Today?',
            color: '#911ab6'
          },
          {
            id: '1c52a512-a80d-46d0-9296-e9845e00e2eb',
            type: 'job',
            name: 'ReactJs',
            color: '#d49f09'
          }
        ],
        createdAt: '2024-05-23T09:57:11.726Z',
        updatedAt: '2024-05-23T09:57:11.726Z',
        deletedAt: null,
        author: {
          id: 'c9c0c2a2-05b8-4f50-bef5-1325ff7cdc96',
          avatarUrl:
            'https://lh3.googleusercontent.com/a/ACg8ocIHT7K6EWRTSZpyBqlzZNYnU4_t9SWiJ8K71iIq_fZFTnnAlw=s96-c',
          avatar: null,
          firstName: 'Vững',
          lastName: 'Bùi',
          email: 'vungbt1999@gmail.com',
          color: '#586EE0',
          role: 'super_admin'
        }
      },
      {
        id: 'e115c3b1-973c-403a-b588-63e3cc82843e',
        title: 'Next.JS CMS - Top choices in 2024',
        content:
          '<p>WHY A HEADLESS CMS FOR YOUR NEXT.JS PROJECT?<a href="https://focusreactive.com/nextjs-cms/?ref=dailydev#why-a-headless-cms-for-your-nextjs-project" rel="noopener noreferrer" target="_blank">​</a></p><p>A&nbsp;<a href="https://focusreactive.com/headless-cms-expert-agency/" rel="noopener noreferrer" target="_blank">headless CMS</a>&nbsp;serves as a backend-only content repository that provides content via an API, making it displayable on any device. This approach separates content management from its presentation, which is particularly advantageous for&nbsp;<a href="https://focusreactive.com/next-js-expert-agency/" rel="noopener noreferrer" target="_blank">NextJS projects</a>. By using a headless CMS, developers can fully leverage Next.js features like&nbsp;<a href="https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering" rel="noopener noreferrer" target="_blank">server-side rendering</a>&nbsp;and&nbsp;<a href="https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation" rel="noopener noreferrer" target="_blank">static site generation</a>, optimizing both SEO and performance.</p><p>ADVANTAGES OF INTEGRATING A HEADLESS CMS WITH NEXTJS<a href="https://focusreactive.com/nextjs-cms/?ref=dailydev#advantages-of-integrating-a-headless-cms-with-nextjs" rel="noopener noreferrer" target="_blank">​</a></p><p><a href="https://focusreactive.com/next-js-expert-agency/" rel="noopener noreferrer" target="_blank">NextJS</a>&nbsp;is a powerful framework for building efficient and scalable web applications.</p><p>HERE ARE SPECIFIC ADVANTAGES OF INTEGRATING A HEADLESS CMS WITH NEXT.JS:<a href="https://focusreactive.com/nextjs-cms/?ref=dailydev#here-are-specific-advantages-of-integrating-a-headless-cms-with-nextjs" rel="noopener noreferrer" target="_blank">​</a></p><ul><li>Enhanced Performance: Next.js excels in fast page loads through features like incremental static regeneration and server-side rendering. A headless CMS complements this by efficiently delivering content through APIs, reducing load times and server strain.</li><li>Improved SEO:&nbsp;Next.js facilitates SEO-friendly site structures, which can be enhanced with a headless CMS that supports SEO optimization through metadata management and structured content delivery.</li><li>Scalability:&nbsp;As your project grows, the need to handle more traffic and content efficiently becomes crucial. A headless CMS can scale independently from the front-end, making it easier to manage large volumes of data without impacting the front-end performance.</li><li>Flexibility in Development:&nbsp;Developers can use their preferred front-end technologies and frameworks without constraints imposed by traditional CMS platforms. This means you can use the latest Next.js features and updates as soon as they are released.</li><li>Better Security and Stability:&nbsp;By decoupling the CMS from the presentation layer, security is enhanced as potential vulnerabilities in the CMS do not directly expose the front-end to security risks.</li><li>Streamlined Workflows:&nbsp;A headless CMS can support multiple front-ends simultaneously, which is advantageous for projects aiming to deliver content across different platforms and devices.</li></ul><p>These benefits make a headless CMS an excellent match for Next.js, ensuring developers can build modern, secure, and high-performing applications.</p><p><a href="https://focusreactive.com/contentful-expert-agency/" rel="noopener noreferrer" target="_blank">CONTENTFUL</a><a href="https://focusreactive.com/nextjs-cms/?ref=dailydev#contentful" rel="noopener noreferrer" target="_blank">​</a></p><p><a href="https://cdn.sanity.io/images/vftxng62/production/ba32138586ec7e60448dcb0420b1deb5a7abc1c0-1646x338.png?w=1000&amp;h=1000&amp;fit=max" rel="noopener noreferrer" target="_blank"><img src="https://cdn.sanity.io/images/vftxng62/production/ba32138586ec7e60448dcb0420b1deb5a7abc1c0-1646x338.png?w=620&amp;auto=format"></a></p><p><a href="https://focusreactive.com/contentful-cms-overview/" rel="noopener noreferrer" target="_blank">Contentful</a>&nbsp;is a leader in the headless CMS market, offering a comprehensive suite of features that cater to developers and content creators alike.</p><p><a href="https://cdn.sanity.io/images/vftxng62/production/3caa639d80ac2ff536a97301e24ac4bb25cc1fca-1400x706.png?w=2000&amp;fit=max&amp;auto=format" rel="noopener noreferrer" target="_blank"><img src="https://cdn.sanity.io/images/vftxng62/production/3caa639d80ac2ff536a97301e24ac4bb25cc1fca-1400x706.png?w=620&amp;auto=format"></a></p><ul><li>Ease of Integration:&nbsp;With its React SDK, integrating Contentful with Next.js projects is a breeze, providing a seamless workflow for developers.</li><li>Flexibility:&nbsp;Contentful\'s content modeling capabilities are unmatched, allowing for the creation of complex content structures tailored to any project\'s needs. Its environment feature supports staging and production setups, enabling a robust development workflow.</li><li>Performance:&nbsp;Its Delivery API is built for speed, ensuring that content loads quickly, which is crucial for maintaining high performance in Next.js applications.</li><li>Community and Support:&nbsp;A vast community and extensive documentation mean that developers can easily find solutions or get help when needed. Contentful also offers professional support services for enterprise users, ensuring that any issues can be swiftly addressed.</li></ul><p><a href="https://www.contentful.com/pricing/?tab=platform" rel="noopener noreferrer" target="_blank">CONTENTFUL PRICING</a><a href="https://focusreactive.com/nextjs-cms/?ref=dailydev#contentful-pricing" rel="noopener noreferrer" target="_blank">​</a></p><ul><li>Free</li><li>Basic:&nbsp;$300/month</li><li>Premium:&nbsp;Custom pricing</li></ul><p><a href="https://cdn.sanity.io/images/vftxng62/production/c5f500f5c5d820d6c4b95bf5675f9a48193f4ab9-1345x1020.png?w=2000&amp;fit=max&amp;auto=format" rel="noopener noreferrer" target="_blank"><img src="https://cdn.sanity.io/images/vftxng62/production/c5f500f5c5d820d6c4b95bf5675f9a48193f4ab9-1345x1020.png?w=620&amp;auto=format"></a></p><p><a href="https://focusreactive.com/storyblok-expert-agency/" rel="noopener noreferrer" target="_blank">STORYBLOK</a><a href="https://focusreactive.com/nextjs-cms/?ref=dailydev#storyblok" rel="noopener noreferrer" target="_blank">​</a></p><p><a href="https://cdn.sanity.io/images/vftxng62/production/58da1f8c5125cfe700d8489901e5ccdb5c91af57-2500x538.png?w=1000&amp;h=1000&amp;fit=max" rel="noopener noreferrer" target="_blank"><img src="https://cdn.sanity.io/images/vftxng62/production/58da1f8c5125cfe700d8489901e5ccdb5c91af57-2500x538.png?w=620&amp;auto=format"></a></p><p><a href="https://focusreactive.com/storyblok-cms-overview/" rel="noopener noreferrer" target="_blank">Storyblok</a>&nbsp;stands out for its visual editor and block-based approach to content management, making it particularly friendly for both developers and content creators.</p><p><a href="https://cdn.sanity.io/images/vftxng62/production/343e1023c8a5647f63c508431a4d79f1036d8230-1280x599.png?w=2000&amp;fit=max&amp;auto=format" rel="noopener noreferrer" target="_blank"><img src="https://cdn.sanity.io/images/vftxng62/production/343e1023c8a5647f63c508431a4d79f1036d8230-1280x599.png?w=620&amp;auto=format"></a></p><ul><li>Ease of Integration:&nbsp;Storyblok\'s component-based approach integrates seamlessly with Next.js, allowing developers to map components in Storyblok to React components.</li><li>Flexibility:&nbsp;The platform offers incredible flexibility through its block-based content system, enabling creators to build dynamic, rich content experiences without needing developer intervention for layout changes.</li><li>Performance:&nbsp;Storyblok\'s content delivery is optimized for speed, utilizing a CDN to ensure content is served quickly to Next.js applications globally.</li><li>Community and Support:&nbsp;Storyblok has a rapidly growing community and provides extensive documentation, tutorials, and customer support, making it easy for developers to get started and find help when needed.</li></ul><p><br></p>',
        shareUrl: '',
        metadata: {},
        slug: 'nextjs-cms-top-choices-in-2024',
        minRead: 4,
        thumbnails: null,
        jobCategory: {
          id: '7bc9d442-1724-445b-9cd0-7fca19122596',
          name: 'Customer Service'
        },
        categories: null,
        tags: null,
        createdAt: '2024-05-23T09:42:58.527Z',
        updatedAt: '2024-05-23T09:42:58.527Z',
        deletedAt: null,
        author: {
          id: 'c9c0c2a2-05b8-4f50-bef5-1325ff7cdc96',
          avatarUrl:
            'https://lh3.googleusercontent.com/a/ACg8ocIHT7K6EWRTSZpyBqlzZNYnU4_t9SWiJ8K71iIq_fZFTnnAlw=s96-c',
          avatar: null,
          firstName: 'Vững',
          lastName: 'Bùi',
          email: 'vungbt1999@gmail.com',
          color: '#586EE0',
          role: 'super_admin'
        }
      }
    ],
    metadata: {
      total: 2,
      limit: null,
      page: null
    }
  };
  const t = useTranslations();
  const { apiClient } = useApiClient();
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Post[]>([]);
  const [metadata, setMetadata] = useState<Metadata>();
  const [pagination, setPagination] = useState<PaginationInput>({ page: 1, limit: 10 });

  useEffect(() => {
    fetchingPosts({ searchValue, pagination });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, pagination]);

  const fetchingPosts = async (variables: AllPostQueryVariables) => {
    try {
      setLoading(true);
      const res = await apiClient.allPost(variables);
      setLoading(false);
      const result = res.all_post;
      if (result && result.data) {
        setData(result.data as Post[]);
        setMetadata(result?.metadata as Metadata);
      }
    } catch (error) {
      setLoading(false);
      getErrorMss(error, t('noti.createError'));
    }
  };

  return {
    loading,
    data: (result.data as Post[]) ?? [],
    metadata,
    pagination,
    setPagination,

    setSearchValue
  };
}