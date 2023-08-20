import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { redirect } from "next/navigation";
import { signIn } from "next-auth/react";
import Activate from "./clientCall";

export default async function page({ params }: { params: { token: string } }) {
	const { token } = params;
	console.log(token);

	const user = await prisma.user.findFirst({
		where: {
			activateTokens: {
				some: {
					AND: [
						{ activatedAt: null }, //not activated yet
						{ createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // < 24 hours ago
						{ token }, //the user's token matches the one given to this page
					],
				},
			},
		},
	});

	if (!user) {
		return <div>Theres no user associated with that token!</div>;
	}

	await prisma.user.update({
		//if there is a user associated with that token:
		where: {
			id: user.id, //find the user by the id,
		},
		data: {
			active: true, // and activate that user
		},
	});

	console.log("right before updating the token");
	await prisma.activateToken.update({
		//activate the token
		where: {
			token,
		},
		data: {
			activatedAt: new Date(),
		},
	});

	redirect("/dashboard");

	return <div></div>;
}
