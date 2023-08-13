import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { User } from "./user";
import { LoginButton, LogoutButton } from "./auth";
import Link from "next/link";

export default async function Home() {
	const session = await getServerSession(authOptions);

	return (
		<main className="bg-[#201F1F] text-white h-screen space-y-4">
			<h1 className="pt-16 flex justify-center font-bold text-xl">
				getServerSession(authOptions) on server component
			</h1>
			<pre className="flex justify-center">{JSON.stringify(session)}</pre>

			<h1 className="flex justify-center font-bold text-xl">
				useSession() on client component
			</h1>
			<div className="flex justify-center">
				<User></User>
			</div>

			<br></br>
			<br></br>
			{!session ? (
				<div className="hover:underline flex justify-center">
					<LoginButton />
				</div>
			) : (
				<></>
			)}

			<br></br>
			<br></br>
			<div className="hover:underline flex justify-center">
				<LogoutButton />
			</div>

			<br />
			<br />
			<Link className="hover:underline flex justify-center" href={"/dashboard"}>
				Dashboard
			</Link>
		</main>
	);
}
