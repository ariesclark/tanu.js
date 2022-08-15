import { t } from "./";

/**
 * A quick demonstration of converting a
 * JSON object to a TypeScript interface.
 */
function toTypeScript(name: string, rootObject: Record<string, unknown>) {
	function recursive(object: Record<string, unknown>): t.TypeDefinitionObject {
		return Object.fromEntries(
			Object.entries(object).map(([key, value]) => {
				if (typeof value === "object") return [key, recursive(value as Record<string, unknown>)];
				const kind =
					typeof value === "string"
						? t.string()
						: typeof value === "number"
						? t.number()
						: typeof value === "boolean"
						? t.boolean
						: t.undefined();
				return [key, kind];
			})
		) as t.TypeDefinitionObject;
	}

	return t.interface(name, recursive(rootObject));
}

void (async () => {
	/**
	 * Create an interface from a json object. This isn't technically
	 * part of the exposed api, but it's good for demonstration purposes.
	 */
	const User = toTypeScript("User", {
		id: 1,
		name: "Leanne Graham",
		username: "Bret",
		emails: ["sincere@april.biz", "leanne.graham@gajin.sh"],
		address: {
			street: "Kulas Light",
			suite: "Apt. 556",
			city: "Gwenborough",
			zipcode: "92998-3874",
			geo: {
				lat: "-37.3159",
				lng: "81.1496"
			}
		},
		phone: "1-770-736-8031 x56442",
		website: "hildegard.org",
		company: {
			name: "Romaguera-Crona",
			catchPhrase: "Multi-layered client-server neural-net",
			bs: "harness real-time e-markets"
		}
	});

	const MemberRole = t.enum("MemberRole", ["DEFAULT", "SPONSOR", "ADMINISTRATOR"]);

	const Member = t.interface("Member", {
		user: User,
		role: MemberRole
	});

	const Foo = t.type("Foo", t.intersection([1, 2]));

	const Organization = t.interface("Organization", {
		id: t.readonly(t.number()),
		name: t.comment(t.string(), [
			"The organization name",
			"@see https://example.com/organization-name"
		]),
		description: t.optional(t.string()),
		members: t.array(Member)
	});

	const a = t.const("a", t.propertyOf(MemberRole, "DEFAULT"));

	const result = await t.generate([User, MemberRole, Member, Organization, Foo, a]);
	console.log(result);
})();
