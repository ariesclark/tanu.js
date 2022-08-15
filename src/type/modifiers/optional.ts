import { TypeDefinition } from "..";
import { union } from "../composites";
import { undefined as undefined_ } from "../primitives";

/**
 * Shorthand for marking a property as optional,
 * this is equivalent to ``t.union([definition, t.undefined()])``.
 *
 * @param definition The type definition to mark as optional.
 */
export function optional(definition: TypeDefinition) {
	return union([definition, undefined_()]);
}
