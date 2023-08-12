"use client";
import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
	return <button onClick={() => signIn()}>LOG IN</button>;
};

export const LogoutButton = () => {
	return <button onClick={() => signOut()}>SIGN OUT</button>;
};
