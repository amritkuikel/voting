/* eslint-disable */
import { experimentalStaticLocale, getLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} About_PageInputs */

const en_about_page =
	/** @type {(inputs: About_PageInputs) => LocalizedString} */ () => {
		return /** @type {LocalizedString} */ (`About page`);
	};

const de_about_page =
	/** @type {(inputs: About_PageInputs) => LocalizedString} */ () => {
		return /** @type {LocalizedString} */ (`Über uns`);
	};

/**
 * | output |
 * | --- |
 * | "About page" |
 *
 * @param {About_PageInputs} inputs
 * @param {{ locale?: "en" | "de" }} options
 * @returns {LocalizedString}
 */
export const about_page =
	/** @type {((inputs?: About_PageInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<About_PageInputs, { locale?: "en" | "de" }, {}>} */ (
		(inputs = {}, options = {}) => {
			const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
			if (locale === "en") return en_about_page(inputs);
			return de_about_page(inputs);
		}
	);
