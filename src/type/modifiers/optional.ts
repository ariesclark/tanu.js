import { union } from "../composites";
import { undefined as undefined_ } from "../primitives";

import type { TypeDefinition } from "..";

/**
 * Shorthand for marking a property as optional,
 * this is equivalent to ``t.union([definition, t.undefined()])``.
 *
 * @param definition The type definition to mark as optional.
 */
export function optional(definition: TypeDefinition) {
	return union([definition, undefined_()]);
}
