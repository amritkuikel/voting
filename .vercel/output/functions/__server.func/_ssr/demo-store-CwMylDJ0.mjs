import { l as Store } from "../_libs/@tanstack/form-core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demo-store-CwMylDJ0.js
var store = new Store({
	firstName: "Jane",
	lastName: "Smith"
});
var fullName = new Store(`${store.state.firstName} ${store.state.lastName}`);
store.subscribe(() => {
	fullName.setState(() => `${store.state.firstName} ${store.state.lastName}`);
});
//#endregion
export { store as n, fullName as t };
