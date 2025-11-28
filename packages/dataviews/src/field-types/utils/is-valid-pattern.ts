/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

/**
 * Factory function that creates a pattern validation function.
 * Compiles the RegExp during normalization and returns both the validation function
 * and a flag indicating whether the regex pattern itself is valid.
 *
 * @param constraint The regex pattern string
 * @return Object with isValidRegex flag and validate function
 */
export default function createIsValidPattern( constraint?: string ) {
	if ( constraint === undefined ) {
		return undefined;
	}

	let regex: RegExp | null = null;
	let isValidRegex = true;

	try {
		regex = new RegExp( constraint );
	} catch ( error ) {
		isValidRegex = false;
	}

	return {
		constraint,
		validate< Item >(
			item: Item,
			field: NormalizedField< Item >
		): boolean {
			if ( ! isValidRegex || ! regex ) {
				return false;
			}

			const value = field.getValue( { item } );

			// Empty values are considered valid for pattern validation
			// (use required validation to enforce non-empty values)
			if ( [ undefined, '', null ].includes( value ) ) {
				return true;
			}

			return regex.test( String( value ) );
		},
	};
}
