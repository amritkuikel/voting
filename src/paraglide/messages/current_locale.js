/* eslint-disable */
import { experimentalStaticLocale, getLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ locale: NonNullable<unknown> }} Current_LocaleInputs */

const en_current_locale =
	/** @type {(inputs: Current_LocaleInputs) => LocalizedString} */ (i) => {
		return /** @type {LocalizedString} */ (`Current locale: ${i?.locale}`);
	};

const de_current_locale =
	/** @type {(inputs: Current_LocaleInputs) => LocalizedString} */ (i) => {
		return /** @type {LocalizedString} */ (`Aktuelle Sprache: ${i?.locale}`);
	};

/**
 * | output |
 * | --- |
 * | "Current locale: {locale}" |
 *
 * @param {Current_LocaleInputs} inputs
 * @param {{ locale?: "en" | "de" }} options
 * @returns {LocalizedString}
 */
export const current_locale =
	/** @type {((inputs: Current_LocaleInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Current_LocaleInputs, { locale?: "en" | "de" }, {}>} */ (
		(inputs, options = {}) => {
			const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
			if (locale === "en") return en_current_locale(inputs);
			return de_current_locale(inputs);
		}
	);
