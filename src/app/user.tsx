"use client";

import { useSession } from "next-auth/react";

export const User = () => {
	const session = useSession();
	console.log("client session", session);
	return <div>{JSON.stringify(session)}</div>;
};
