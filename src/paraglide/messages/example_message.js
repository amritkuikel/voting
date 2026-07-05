/* eslint-disable */
import { experimentalStaticLocale, getLocale } from "../runtime.js";

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Example_MessageInputs */

const en_example_message =
	/** @type {(inputs: Example_MessageInputs) => LocalizedString} */ () => {
		return /** @type {LocalizedString} */ (`Welcome to your i18n app.`);
	};

const de_example_message =
	/** @type {(inputs: Example_MessageInputs) => LocalizedString} */ () => {
		return /** @type {LocalizedString} */ (`Willkommen in deiner i18n-App.`);
	};

/**
 * | output |
 * | --- |
 * | "Welcome to your i18n app." |
 *
 * @param {Example_MessageInputs} inputs
 * @param {{ locale?: "en" | "de" }} options
 * @returns {LocalizedString}
 */
export const example_message =
	/** @type {((inputs?: Example_MessageInputs, options?: { locale?: "en" | "de" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Example_MessageInputs, { locale?: "en" | "de" }, {}>} */ (
		(inputs = {}, options = {}) => {
			const locale = experimentalStaticLocale ?? options.locale ?? getLocale();
			if (locale === "en") return en_example_message(inputs);
			return de_example_message(inputs);
		}
	);
