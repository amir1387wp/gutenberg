export default function isValidRequiredNoop( constraint?: boolean ) {
	if ( constraint === false ) {
		return false;
	}

	return {
		constraint,
		validate: () => true,
	};
}
