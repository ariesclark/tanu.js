import test from "ava";

import { t } from "../src";

const emptyEnumResult = `
export enum EmptyEnum {
}
`;

const basicEnumResult = `
export enum BasicEnum {
    Foo,
    Bar,
    Baz
}
`;

test("empty", async (tc) => {
	const emptyEnum = t.enum("EmptyEnum", []);
	const generated = await t.generate([emptyEnum], { banner: "" });
	tc.is(generated, emptyEnumResult);
});

test("basic", async (tc) => {
	const basicEnum = t.enum("BasicEnum", ["Foo", "Bar", "Baz"]);
	const generated = await t.generate([basicEnum], { banner: "" });
	tc.is(generated, basicEnumResult);
});
