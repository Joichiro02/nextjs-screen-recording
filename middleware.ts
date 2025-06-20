import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import aj, { createMiddleware, detectBot, shield } from "./lib/arcjet";

export async function middleware(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	return NextResponse.next();
}

// to test the boot
// comment out the middleware above
// input in terminal the command: curl -v http://localhost:3000
// the return will be -> {"code":403,"message":"Forbidden"}%
const validate = aj
	.withRule(
		shield({
			mode: "LIVE",
		})
	)
	.withRule(
		detectBot({
			mode: "LIVE",
			allow: ["CATEGORY:SEARCH_ENGINE", "G00G1E_CRAWLER"], // allow other bots if you want to.
		})
	);

export default createMiddleware(validate);

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sign-in|assets).*)"],
};

// ⨯ [TypeError: Body is unusable: Body has already been read]
