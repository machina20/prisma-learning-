"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { redirect } from "next/dist/server/api-utils";
import { signIn } from "next-auth/react";
import { Alert } from "@/components/ui/alert";
import Credentials from "next-auth/providers/credentials";
import { useSearchParams } from "next/navigation";

export const LoginForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [urlError, setUrlError] = useState("");

	const searchParams = useSearchParams();

	const search = searchParams.get("error");

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("clicked login");

		const signInResponse = await signIn("credentials", {
			email,
			password,
			callbackUrl: "/dashboard",
		});

		if (signInResponse?.error) {
			setError(signInResponse.error);
		}
	};

	return (
		<form onSubmit={onSubmit} className="space-y-12 w-full sm:w-[400px]">
			<div className="grid w-full  items-center gap-1.5">
				<Label htmlFor="email">Email</Label>
				<Input
					required
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
					}}
					id="email"
					type="email"
				/>
			</div>
			<div className="grid w-full  items-center gap-1.5">
				<Label htmlFor="password">Password</Label>
				<Input
					required
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
					}}
					id="password"
					type="password"
				/>
			</div>
			<div className="w-full">
				{error && <Alert>{error}</Alert>}
				{search && <Alert>{"Invalid email or password"}</Alert>}

				<Button className="w-full bg-[#201F1F] hover:bg-gray-600" size={"lg"}>
					Log In
				</Button>
			</div>
		</form>
	);
};
