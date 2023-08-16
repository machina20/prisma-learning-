import Link from "next/link";
import { LoginForm } from "./form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function login() {
	if (await getServerSession()) {
		{
			redirect("/");
		}
	}
	return (
		<div className="h-screen  w-screen flex justify-center items-center sm:bg-[#201F1F]">
			<div className="sm:shadow-xl px-8 py-8 sm:bg-white rounded-lg space-y-12">
				<h1 className="font-semibold text-2xl">Log In</h1>
				<LoginForm></LoginForm>
				<p className="text-center">
					Don&apos;t have an account?{" "}
					<Link className="text-gray-500 hover:underline" href={"/register"}>
						Sign Up
					</Link>
				</p>
			</div>
		</div>
	);
}
