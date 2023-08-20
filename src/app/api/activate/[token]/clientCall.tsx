"use client";

import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";

type ActivateProps = {
	email: string;
	token: string;
};

export default function Activate({ email, token }: ActivateProps) {
	console.log("entered <Activate>");
	async function signInCall() {
		console.log("entering signIn()");
		const signInResponse = await signIn("credentials", {
			email: { email },
			token: { token },
			callbackUrl: "/dashboard",
		});
	}
	signInCall(); // this might be a duplicate call
	console.log("exited signInCall inside");

	return <div>Hello world</div>;
	//now the cookie should be on the client machine
}
