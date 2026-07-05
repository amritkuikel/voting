import { o as __toESM } from "../_runtime.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as rankItem, t as compareItems } from "../_libs/tanstack__match-sorter-utils.mjs";
import { a as getPaginationRowModel, i as getFilteredRowModel, n as useReactTable, o as getSortedRowModel, r as getCoreRowModel, s as sortingFns, t as flexRender } from "../_libs/@tanstack/react-table+[...].mjs";
import { t as f } from "../_libs/faker-js__faker.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/table-CtDykBmE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var range = (len) => {
	const arr = [];
	for (let i = 0; i < len; i++) arr.push(i);
	return arr;
};
var newPerson = (num) => {
	return {
		id: num,
		firstName: f.person.firstName(),
		lastName: f.person.lastName(),
		age: f.number.int(40),
		visits: f.number.int(1e3),
		progress: f.number.int(100),
		status: f.helpers.shuffle([
			"relationship",
			"complicated",
			"single"
		])[0]
	};
};
function makeData(...lens) {
	const makeDataLevel = (depth = 0) => {
		const len = lens[depth];
		return range(len).map((index) => {
			return {
				...newPerson(index),
				subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : void 0
			};
		});
	};
	return makeDataLevel();
}
var fuzzyFilter = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value);
	addMeta({ itemRank });
	return itemRank.passed;
};
var fuzzySort = (rowA, rowB, columnId) => {
	let dir = 0;
	if (rowA.columnFiltersMeta[columnId]) dir = compareItems(rowA.columnFiltersMeta[columnId]?.itemRank, rowB.columnFiltersMeta[columnId]?.itemRank);
	return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};
function TableDemo() {
	const rerender = import_react.useReducer(() => ({}), {})[1];
	const [columnFilters, setColumnFilters] = import_react.useState([]);
	const [globalFilter, setGlobalFilter] = import_react.useState("");
	const columns = import_react.useMemo(() => [
		{
			accessorKey: "id",
			filterFn: "equalsString"
		},
		{
			accessorKey: "firstName",
			cell: (info) => info.getValue(),
			filterFn: "includesStringSensitive"
		},
		{
			accessorFn: (row) => row.lastName,
			id: "lastName",
			cell: (info) => info.getValue(),
			header: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last Name" }),
			filterFn: "includesString"
		},
		{
			accessorFn: (row) => `${row.firstName} ${row.lastName}`,
			id: "fullName",
			header: "Full Name",
			cell: (info) => info.getValue(),
			filterFn: "fuzzy",
			sortingFn: fuzzySort
		}
	], []);
	const [data, setData] = import_react.useState(() => makeData(5e3));
	const refreshData = () => setData((_old) => makeData(5e4));
	const table = useReactTable({
		data,
		columns,
		filterFns: { fuzzy: fuzzyFilter },
		state: {
			columnFilters,
			globalFilter
		},
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: "fuzzy",
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		debugTable: true,
		debugHeaders: true,
		debugColumns: false
	});
	import_react.useEffect(() => {
		if (table.getState().columnFilters[0]?.id === "fullName") {
			if (table.getState().sorting[0]?.id !== "fullName") table.setSorting([{
				id: "fullName",
				desc: false
			}]);
		}
	}, [table.getState, table.setSorting]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gray-900 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DebouncedInput, {
				value: globalFilter ?? "",
				onChange: (value) => setGlobalFilter(String(value)),
				className: "w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none",
				placeholder: "Search all columns..."
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-lg border border-gray-700",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm text-gray-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-gray-800 text-gray-100",
						children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: headerGroup.headers.map((header) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								colSpan: header.colSpan,
								className: "px-4 py-3 text-left",
								children: header.isPlaceholder ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: header.column.getCanSort() ? "cursor-pointer select-none hover:text-blue-400 transition-colors" : "",
									onClick: header.column.getToggleSortingHandler(),
									children: [flexRender(header.column.columnDef.header, header.getContext()), {
										asc: " 🔼",
										desc: " 🔽"
									}[header.column.getIsSorted()] ?? null]
								}), header.column.getCanFilter() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, { column: header.column })
								}) : null] })
							}, header.id);
						}) }, headerGroup.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-gray-700",
						children: table.getRowModel().rows.map((row) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: "hover:bg-gray-800 transition-colors",
								children: row.getVisibleCells().map((cell) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: flexRender(cell.column.columnDef.cell, cell.getContext())
									}, cell.id);
								})
							}, row.id);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 text-gray-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
						onClick: () => table.setPageIndex(0),
						disabled: !table.getCanPreviousPage(),
						children: "<<"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
						onClick: () => table.previousPage(),
						disabled: !table.getCanPreviousPage(),
						children: "<"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
						onClick: () => table.nextPage(),
						disabled: !table.getCanNextPage(),
						children: ">"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "px-3 py-1 bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed",
						onClick: () => table.setPageIndex(table.getPageCount() - 1),
						disabled: !table.getCanNextPage(),
						children: ">>"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Page" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
							table.getState().pagination.pageIndex + 1,
							" of",
							" ",
							table.getPageCount()
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: ["| Go to page:", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							defaultValue: table.getState().pagination.pageIndex + 1,
							onChange: (e) => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								table.setPageIndex(page);
							},
							className: "w-16 px-2 py-1 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: table.getState().pagination.pageSize,
						onChange: (e) => {
							table.setPageSize(Number(e.target.value));
						},
						className: "px-2 py-1 bg-gray-800 rounded-md border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none",
						children: [
							10,
							20,
							30,
							40,
							50
						].map((pageSize) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: pageSize,
							children: ["Show ", pageSize]
						}, pageSize))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 text-gray-400",
				children: [table.getPrePaginationRowModel().rows.length, " Rows"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => rerender(),
					className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
					children: "Force Rerender"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => refreshData(),
					className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
					children: "Refresh Data"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-4 p-4 bg-gray-800 rounded-lg text-gray-300 overflow-auto",
				children: JSON.stringify({
					columnFilters: table.getState().columnFilters,
					globalFilter: table.getState().globalFilter
				}, null, 2)
			})
		]
	});
}
function Filter({ column }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DebouncedInput, {
		type: "text",
		value: column.getFilterValue() ?? "",
		onChange: (value) => column.setFilterValue(value),
		placeholder: `Search...`,
		className: "w-full px-2 py-1 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
	});
}
function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }) {
	const [value, setValue] = import_react.useState(initialValue);
	import_react.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);
	import_react.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);
		return () => clearTimeout(timeout);
	}, [
		value,
		debounce,
		onChange
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		value,
		onChange: (e) => setValue(e.target.value)
	});
}
//#endregion
export { TableDemo as component };
