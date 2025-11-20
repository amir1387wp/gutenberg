/**
 * WordPress dependencies
 */
import { usePrevious } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';
import {
	cloneElement,
	forwardRef,
	useEffect,
	useState,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { withIgnoreIMEEvents } from '../utils/with-ignore-ime-events';
import type { ValidatedControlProps } from './components/types';
import { ValidityIndicator } from './validity-indicator';

function appendRequiredIndicator(
	label: React.ReactNode,
	required: boolean | undefined,
	markWhenOptional: boolean | undefined
) {
	if ( required && ! markWhenOptional ) {
		return (
			<>
				{ label } { `(${ __( 'Required' ) })` }
			</>
		);
	}
	if ( ! required && markWhenOptional ) {
		return (
			<>
				{ label } { `(${ __( 'Optional' ) })` }
			</>
		);
	}
	return label;
}

/**
 * HTML elements that support the Constraint Validation API.
 *
 * Here, we exclude HTMLButtonElement because although it does technically support the API,
 * normal buttons are actually exempted from any validation.
 * @see https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement/willValidate
 */
type ValidityTarget =
	| HTMLFieldSetElement
	| HTMLInputElement
	| HTMLSelectElement
	| HTMLTextAreaElement;

function UnforwardedControlWithError< C extends React.ReactElement >(
	{
		required,
		markWhenOptional,
		onValidate,
		customValidity,
		getValidityTarget,
		children,
	}: {
		/**
		 * Whether the control is required.
		 */
		required?: boolean;
		/**
		 * Label the control as "optional" when _not_ `required`, instead of the inverse.
		 */
		markWhenOptional?: boolean;
		/**
		 * The callback to run when the input should be validated.
		 */
		onValidate?: () => void;
		customValidity?: ValidatedControlProps< unknown >[ 'customValidity' ];
		/**
		 * A function that returns the actual element on which the validity data should be applied.
		 */
		getValidityTarget: () => ValidityTarget | null | undefined;
		/**
		 * The control component to apply validation to.
		 *
		 * As `children` will be cloned with additional props,
		 * the component at the root of `children` should accept
		 * `label`, `onChange`, and `required` props, and process them
		 * appropriately.
		 */
		children: C;
	},
	forwardedRef: React.ForwardedRef< HTMLDivElement >
) {
	const [ errorMessage, setErrorMessage ] = useState< string | undefined >();
	const [ statusMessage, setStatusMessage ] = useState<
		| {
				type: 'validating' | 'valid';
				message?: string;
		  }
		| undefined
	>();
	const [ isTouched, setIsTouched ] = useState( false );
	const previousCustomValidityType = usePrevious( customValidity?.type );
	const className = 'components-validated-control';

	useEffect( () => {
		const validityTarget = getValidityTarget();

		// Ensure that error messages are visible after user attemps to submit a form
		// with multiple invalid fields.
		const showValidationMessage = () =>
			setErrorMessage( validityTarget?.validationMessage );

		// Suppress the native error popover, while keeping the focus behavior intact.
		const supressNativePopover = ( event: Event ) => {
			event.preventDefault();

			const target = event.target as ValidityTarget;

			if ( ! target.form ) {
				target.focus();
				return;
			}

			const firstErrorInForm = Array.from( target.form.elements ).find(
				( el ) => ! ( el as ValidityTarget ).validity.valid
			);

			if ( firstErrorInForm === target ) {
				target.focus();
			}
		};

		// Radio inputs need special handling because all radio inputs with the
		// same `name` will be marked as invalid.
		const radioSibilings =
			validityTarget?.type === 'radio' && validityTarget?.name
				? Array.from(
						validityTarget
							?.closest( `.${ className }` )
							?.querySelectorAll< HTMLInputElement >(
								`input[type="radio"][name="${ validityTarget?.name }"]`
							) ?? []
				  ).filter( ( sibling ) => sibling !== validityTarget )
				: [];

		validityTarget?.addEventListener( 'invalid', supressNativePopover );
		radioSibilings.forEach( ( sibling ) =>
			sibling.addEventListener( 'invalid', supressNativePopover )
		);

		validityTarget?.addEventListener( 'invalid', showValidationMessage );

		return () => {
			validityTarget?.removeEventListener(
				'invalid',
				supressNativePopover
			);
			radioSibilings.forEach( ( sibling ) =>
				sibling.removeEventListener( 'invalid', supressNativePopover )
			);

			validityTarget?.removeEventListener(
				'invalid',
				showValidationMessage
			);
		};
	} );

	useEffect( (): ReturnType< React.EffectCallback > => {
		if ( ! isTouched ) {
			return;
		}

		const validityTarget = getValidityTarget();

		if ( ! customValidity?.type ) {
			validityTarget?.setCustomValidity( '' );
			setErrorMessage( validityTarget?.validationMessage );
			setStatusMessage( undefined );
			return;
		}

		switch ( customValidity.type ) {
			case 'validating': {
				// Wait before showing a validating state.
				const timer = setTimeout( () => {
					validityTarget?.setCustomValidity( '' );
					setErrorMessage( undefined );

					setStatusMessage( {
						type: 'validating',
						message: customValidity.message,
					} );
				}, 1000 );

				return () => clearTimeout( timer );
			}
			case 'valid': {
				// Ensures that we wait for any async responses before showing
				// a synchronously valid state.
				if ( previousCustomValidityType === 'valid' ) {
					break;
				}

				validityTarget?.setCustomValidity( '' );
				setErrorMessage( validityTarget?.validationMessage );

				setStatusMessage( {
					type: 'valid',
					message: customValidity.message,
				} );
				break;
			}
			case 'invalid': {
				validityTarget?.setCustomValidity(
					customValidity.message ?? ''
				);
				setErrorMessage( validityTarget?.validationMessage );

				setStatusMessage( undefined );
				break;
			}
		}
	}, [
		isTouched,
		customValidity?.type,
		customValidity?.message,
		getValidityTarget,
		previousCustomValidityType,
	] );

	const onBlur = ( event: React.FocusEvent< HTMLDivElement > ) => {
		if ( isTouched ) {
			return;
		}

		// Only consider "blurred from the component" if focus has fully left the wrapping div.
		// This prevents unnecessary blurs from components with multiple focusable elements.
		if (
			! event.relatedTarget ||
			! event.currentTarget.contains( event.relatedTarget )
		) {
			setIsTouched( true );
			onValidate?.();
		}
	};

	const onChange = ( ...args: unknown[] ) => {
		children.props.onChange?.( ...args );

		// Only validate incrementally if the field has blurred at least once,
		// or currently has an error message.
		if ( isTouched || errorMessage ) {
			onValidate?.();
		}
	};

	const onKeyDown = ( event: React.KeyboardEvent< HTMLDivElement > ) => {
		// Ensures that custom validators are triggered when the user submits by pressing Enter,
		// without ever blurring the control.
		if ( event.key === 'Enter' ) {
			onValidate?.();
		}
	};

	return (
		// Disable reason: Just listening to a bubbled event, not for interaction.
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			className={ className }
			ref={ forwardedRef }
			onBlur={ onBlur }
			onKeyDown={ withIgnoreIMEEvents( onKeyDown ) }
		>
			{ cloneElement( children, {
				label: appendRequiredIndicator(
					children.props.label,
					required,
					markWhenOptional
				),
				onChange,
				required,
			} ) }
			<div aria-live="polite">
				{ errorMessage && (
					<ValidityIndicator
						type="invalid"
						message={ errorMessage }
					/>
				) }
				{ ! errorMessage && statusMessage && (
					<ValidityIndicator
						type={ statusMessage.type }
						message={ statusMessage.message }
					/>
				) }
			</div>
		</div>
	);
}

export const ControlWithError = forwardRef( UnforwardedControlWithError );
