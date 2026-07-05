/* eslint-disable */
import { experimentalStaticLocale, getLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Learn_RouterInputs */

const en_learn_router =
	/** @type {(inputs: Learn_RouterInputs) => LocalizedString} */ () => {
		return /** @type {LocalizedString} */ (`Learn Paraglide JS`);
	};

const de_learn_router =
	/** @type {(inputs: Learn_RouterInputs) => LocalizedString} */ () => {
		return /** @type {LocalizedString} */ (`Paraglide JS lernen`);
	};

/**
 * | output |
 * | --- |
 * | "Learn Paraglide JS" |
 *
 * @param {Learn_RouterInputs} inputs
 * @param {{ locale?: "en" | "de" }} options
 * @returns {LocalizedString}
 */
export const learn_router =
	/** @type {((inputs?: Learn_RouterInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Learn_RouterInputs, { locale?: "en" | "de" }, {}>} */ (
		(inputs = {}, options = {}) => {
			const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
			if (locale === "en") return en_learn_router(inputs);
			return de_learn_router(inputs);
		}
	);
