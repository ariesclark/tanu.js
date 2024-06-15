import * as ts from "typescript";

import { reference } from "..";

/**
 * Create a string primitive.
 */
export function string() {
	return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
}

/**
 * Create a number primitive.
 */
export function number() {
	return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
}

/**
 * Create a bigint primitive.
 * @see [BigInt on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
 */
export function bigint() {
	return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword);
}

/**
 * Create a boolean primitive.
 */
export function boolean() {
	return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
}

/**
 * Shorthand for a reference to the Date class,
 * this is equivalent to ``t.reference("Date")``.
 */
export function date() {
	return reference("Date");
}

export function any() {
	return ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
}

export function unknown() {
	return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);
}

/**
 * "undefined" is a reserved keyword.
 */
export { undefined_ as undefined };

function undefined_() {
	return ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword);
}

/**
 * "void" is a reserved keyword.
 */
export { void_ as void };

function void_() {
	return ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword);
}

export function never() {
	return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword);
}
