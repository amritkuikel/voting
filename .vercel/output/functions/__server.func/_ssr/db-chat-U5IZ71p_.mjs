import { o as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as createCollection, r as localOnlyCollectionOptions } from "../_libs/@tanstack/db+[...].mjs";
import { t as useLiveQuery } from "../_libs/tanstack__react-db.mjs";
import { h as object, m as number, v as string } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-chat-U5IZ71p_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var messagesCollection = createCollection(localOnlyCollectionOptions({
	getKey: (message) => message.id,
	schema: object({
		id: number(),
		text: string(),
		user: string()
	})
}));
function useStreamConnection(url, collection) {
	const loadedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const fetchData = async () => {
			if (loadedRef.current) return;
			loadedRef.current = true;
			const reader = (await fetch(url)).body?.getReader();
			if (!reader) return;
			const decoder = new TextDecoder();
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				for (const chunk of decoder.decode(value, { stream: true }).split("\n").filter((chunk) => chunk.length > 0)) collection.insert(JSON.parse(chunk));
			}
		};
		fetchData();
	}, [collection.insert, url]);
}
function useChat() {
	useStreamConnection("/demo/db-chat-api", messagesCollection);
	const sendMessage = (message, user) => {
		fetch("/demo/db-chat-api", {
			method: "POST",
			body: JSON.stringify({
				text: message.trim(),
				user: user.trim()
			})
		});
	};
	return { sendMessage };
}
function useMessages() {
	const { data: messages } = useLiveQuery((q) => q.from({ message: messagesCollection }).select(({ message }) => ({ ...message })));
	return messages;
}
var getAvatarColor = (username) => {
	const colors = [
		"bg-blue-500",
		"bg-green-500",
		"bg-purple-500",
		"bg-pink-500",
		"bg-indigo-500",
		"bg-red-500",
		"bg-yellow-500",
		"bg-teal-500"
	];
	return colors[username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length];
};
function Messages({ messages, user }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: messages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `flex ${msg.user === user ? "justify-end" : "justify-start"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex items-start space-x-3 max-w-xs lg:max-w-md ${msg.user === user ? "flex-row-reverse space-x-reverse" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(msg.user)}`,
				children: msg.user.charAt(0).toUpperCase()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `px-4 py-2 rounded-2xl ${msg.user === user ? "bg-blue-500 text-white rounded-br-md" : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"}`,
				children: [msg.user !== user && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-500 mb-1 font-medium",
					children: msg.user
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: msg.text
				})]
			})]
		})
	}, msg.id)) });
}
function ChatArea() {
	const { sendMessage } = useChat();
	const messages = useMessages();
	const [message, setMessage] = (0, import_react.useState)("");
	const [user, setUser] = (0, import_react.useState)("Alice");
	const postMessage = () => {
		if (message.trim().length) {
			sendMessage(message, user);
			setMessage("");
		}
	};
	const handleKeyPress = (e) => {
		if (e.key === "Enter") postMessage();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-4 py-6 space-y-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Messages, {
			messages,
			user
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white border-t border-gray-200 px-4 py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center space-x-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: user,
					onChange: (e) => setUser(e.target.value),
					className: "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "Alice",
						children: "Alice"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "Bob",
						children: "Bob"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 relative",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: message,
						onChange: (e) => setMessage(e.target.value),
						onKeyDown: handleKeyPress,
						placeholder: "Type a message...",
						className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: postMessage,
					disabled: message.trim() === "",
					className: "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
					children: "Send"
				})
			]
		})
	})] });
}
function App() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col h-screen bg-gray-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatArea, {})
	});
}
//#endregion
export { App as component };
