import * as ts from "typescript";

/**
 * "enum" is a reserved keyword.
 */
export { enum_ as enum };

/**
 * Create an enum (uses the [enum type](https://www.typescriptlang.org/docs/handbook/enums.html) by default)
 *
 * @param name The name of the enum.
 * @param values An array of enum members.
 */
function enum_<T extends string>(
	name: string,
	values: ReadonlyArray<T>
): ts.EnumDeclaration {
	return ts.factory.createEnumDeclaration(
		undefined,
		[ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
		name,
		values.map((value) => ts.factory.createEnumMember(value, undefined))
	);
}
