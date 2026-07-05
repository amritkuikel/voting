/* eslint-disable */
import { experimentalStaticLocale, getLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Language_LabelInputs */

const en_language_label =
	/** @type {(inputs: Language_LabelInputs) => LocalizedString} */ () => {
		return /** @type {LocalizedString} */ (`Language`);
	};

const de_language_label =
	/** @type {(inputs: Language_LabelInputs) => LocalizedString} */ () => {
		return /** @type {LocalizedString} */ (`Sprache`);
	};

/**
 * | output |
 * | --- |
 * | "Language" |
 *
 * @param {Language_LabelInputs} inputs
 * @param {{ locale?: "en" | "de" }} options
 * @returns {LocalizedString}
 */
export const language_label =
	/** @type {((inputs?: Language_LabelInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Language_LabelInputs, { locale?: "en" | "de" }, {}>} */ (
		(inputs = {}, options = {}) => {
			const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
			if (locale === "en") return en_language_label(inputs);
			return de_language_label(inputs);
		}
	);
