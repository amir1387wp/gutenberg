/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

export default function isValidRequiredForArray( constraint?: boolean ) {
	if ( [ undefined, false ].includes( constraint ) ) {
		return undefined;
	}

	return {
		constraint,
		validate< Item >( item: Item, field: NormalizedField< Item > ) {
			const value = field.getValue( { item } );
			return (
				Array.isArray( value ) &&
				value.length > 0 &&
				value.every(
					( element: any ) =>
						! [ undefined, '', null ].includes( element )
				)
			);
		},
	};
}
