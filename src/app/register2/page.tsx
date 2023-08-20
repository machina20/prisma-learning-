import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { hash } from "bcrypt";
import { signIn } from "next-auth/react";
import Credentials from "next-auth/providers/credentials";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { randomUUID } from "crypto";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { NextResponse } from "next/server";
import { startTransition, useTransition } from "react";

export default async function Register() {
	if (await getServerSession()) {
		{
			redirect("/");
		}
	}

	async function registerUser(data: FormData) {
		"use server";
		console.log(data);

		//encrypt pass and extract data

		const password = await hash(data.get("password") as string, 12);
		const name = data.get("name") as string;
		const email = data.get("email") as string;

		//see if that email is taken
		const userExists = await prisma.user.findUnique({
			where: {
				email: data.get("email") as string,
			},
		});

		if (userExists) {
			return new NextResponse(
				JSON.stringify({
					message: "There is  already an account associated with that email.",
				}),
				{ status: 400 }
			);
		}

		//else create the user
		if (password) {
			const user = await prisma.user.create({
				data: {
					name,
					email,
					password,
				},
			});

			console.log("user created");

			//create the activation token
			const token = await prisma.activateToken.create({
				data: {
					token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ""),
					userId: user.id,
				},
			});

			// send the email with the token to the user's email
			const API_KEY = process.env.MAILGUN_API_KEY;
			const DOMAIN = process.env.MAILGUN_DOMAIN;

			const mailgun = new Mailgun(formData);
			const client = mailgun.client({
				username: "api",
				key: API_KEY as string,
			});

			const messageData = {
				from: `ryanschwartz.io <me@${DOMAIN}>`,
				to: [user.email],
				subject: `Hello, ${user.name}.`,
				text: `Click this link to verify your email:  http://localhost:3000/api/activate/${token.token}`,
			};

			await client.messages
				.create(DOMAIN as string, messageData)
				.then((msg) => console.log(msg)) // logs response data
				.catch((err) => console.log(err));
		}

		return new NextResponse(
			JSON.stringify({
				message: "user created successfull",
			}),
			{ status: 200 }
		);
	}

	console.log();
	return (
		<div className="h-screen  w-screen flex justify-center items-center sm:bg-[#201F1F]">
			<div className="sm:shadow-xl px-8 py-8 sm:bg-white rounded-lg space-y-12">
				<h1 className="font-semibold text-2xl">Create an Account</h1>
				<form action={registerUser} className="space-y-12 w-full sm:w-[400px]">
					<div className="grid w-full  items-center gap-1.5">
						<Label>Name</Label>
						<Input className="mb-6" name="name" required />
						<Label>Email</Label>
						<Input className="mb-6" name="email" type="email" required />
						<Label>Password</Label>
						<Input className="mb-6" name="password" type="password" required />
						<Button type="submit">Register</Button>
					</div>
				</form>
				<p className="text-center">
					Have an account?{" "}
					<Link className="text-gray-500 hover:underline" href={"/login"}>
						Sign in
					</Link>
				</p>
			</div>
		</div>
	);
}
