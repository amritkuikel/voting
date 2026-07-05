/* eslint-disable */
import { experimentalStaticLocale, getLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Home_PageInputs */

const en_home_page =
	/** @type {(inputs: Home_PageInputs) => LocalizedString} */ () => {
		return /** @type {LocalizedString} */ (`Home page`);
	};

const de_home_page =
	/** @type {(inputs: Home_PageInputs) => LocalizedString} */ () => {
		return /** @type {LocalizedString} */ (`Startseite`);
	};

/**
 * | output |
 * | --- |
 * | "Home page" |
 *
 * @param {Home_PageInputs} inputs
 * @param {{ locale?: "en" | "de" }} options
 * @returns {LocalizedString}
 */
export const home_page =
	/** @type {((inputs?: Home_PageInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Home_PageInputs, { locale?: "en" | "de" }, {}>} */ (
		(inputs = {}, options = {}) => {
			const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
			if (locale === "en") return en_home_page(inputs);
			return de_home_page(inputs);
		}
	);
