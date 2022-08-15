import { reference, TypeDefinition } from "..";

export function readonly(definition: TypeDefinition) {
	return reference("Readonly", [definition]);
}
