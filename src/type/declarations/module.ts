import * as ts from "typescript";

export interface ModuleOptions {
	declare?: boolean;
	namespace?: boolean;
	global?: boolean;
}

function module_(
	name: string,
	statements: Array<ts.InterfaceDeclaration | ts.ModuleDeclaration>,
	options: ModuleOptions = {}
): ts.ModuleDeclaration {
	let flags = ts.NodeFlags.None;

	if (name === "global" || options.global)
		flags |= ts.NodeFlags.GlobalAugmentation;
	if (options.namespace) flags |= ts.NodeFlags.Namespace;

	return ts.factory.createModuleDeclaration(
		options.declare
			? [ts.factory.createModifier(ts.SyntaxKind.DeclareKeyword)]
			: undefined,
		ts.factory.createIdentifier(name),
		ts.factory.createModuleBlock(statements),
		flags
	);
}

/**
 * Shorthand for creating a module namespace, this is equivalent to
 * ``t.module(name, statements, { ...options, namespace: true })``.
 */
export function namespace(
	name: string,
	statements: Array<ts.InterfaceDeclaration | ts.ModuleDeclaration>,
	options: ModuleOptions = {}
): ts.ModuleDeclaration {
	return module_(name, statements, { ...options, namespace: true });
}

/**
 * `module` interferes with CommonJS `exports.module`.
 */
export { module_ as module };
