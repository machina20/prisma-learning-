import Link from "next/link";
import { RegisterForm } from "./form";

export default function register() {
	return (
		<div className="h-screen  w-screen flex justify-center items-center sm:bg-[#201F1F]">
			<div className="sm:shadow-xl px-8 py-8 sm:bg-white rounded-lg space-y-12">
				<h1 className="font-semibold text-2xl">Create an Account</h1>
				<RegisterForm></RegisterForm>
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
