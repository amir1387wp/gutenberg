export default function isValidRequiredForBool( constraint?: boolean ) {
	if ( constraint === false ) {
		return false;
	}

	return {
		constraint,
		validate< Item >( value: Item ) {
			return value === true;
		},
	};
}
