import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { getLocale } from "#/paraglide/runtime";
import PostHogProvider from "../integrations/posthog/provider";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import StoreDevtools from "../lib/demo-store-devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("lang", getLocale());
		}
	},

	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Student Council Election 2083 | Shree Baljyoti Secondary School",
			},
			{
				name: "description",
				content: "Official voting platform for Student Council Election 2083 at Shree Baljyoti Secondary School, Hetauda-5, Makawanpur, Nepal. Vote for Head Boy, Head Girl, and House Captains.",
			},
			{
				name: "keywords",
				content: "school election, student council, voting, Shree Baljyoti Secondary School, Hetauda, Makawanpur, Nepal, head boy, head girl, house captain, election 2083",
			},
			{
				name: "author",
				content: "Shree Baljyoti Secondary School",
			},
			{
				name: "robots",
				content: "index, follow",
			},
			// Open Graph / Facebook
			{
				property: "og:type",
				content: "website",
			},
			{
				property: "og:url",
				content: "https://your-domain.vercel.app/",
			},
			{
				property: "og:title",
				content: "Student Council Election 2083 | Shree Baljyoti Secondary School",
			},
			{
				property: "og:description",
				content: "Official voting platform for Student Council Election 2083 at Shree Baljyoti Secondary School, Hetauda-5, Makawanpur, Nepal.",
			},
			{
				property: "og:image",
				content: "/images/logo.png",
			},
			{
				property: "og:site_name",
				content: "Shree Baljyoti Secondary School",
			},
			{
				property: "og:locale",
				content: "en_US",
			},
			// Twitter Card
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: "Student Council Election 2083 | Shree Baljyoti Secondary School",
			},
			{
				name: "twitter:description",
				content: "Official voting platform for Student Council Election 2083 at Shree Baljyoti Secondary School, Hetauda-5, Makawanpur, Nepal.",
			},
			{
				name: "twitter:image",
				content: "/images/logo.png",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/images/logo.png",
			},
			{
				rel: "apple-touch-icon",
				href: "/images/logo.png",
			},
			{
				rel: "canonical",
				href: "https://your-domain.vercel.app/",
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang={getLocale()} suppressHydrationWarning>
			<head>
				{/** biome-ignore lint/security/noDangerouslySetInnerHtml: <it is required here> */}
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
				<PostHogProvider>
					{children}
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							StoreDevtools,
							TanStackQueryDevtools,
						]}
					/>
				</PostHogProvider>
				<Scripts />
			</body>
		</html>
	);
}
