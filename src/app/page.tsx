import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { User } from "./user";
import { LoginButton, LogoutButton } from "./auth";

export default async function Home() {
	const session = await getServerSession(authOptions);

	return (
		<main className="bg-slate-300 h-screen">
			<h1 className="font-bold text-xl">
				getServerSession(authOptions) on server component
			</h1>

			<pre>{JSON.stringify(session)}</pre>
			<h1 className="font-bold text-xl">useSession() on client component</h1>
			<User></User>
			<br></br>
			<br></br>
			<LoginButton></LoginButton>
			<br></br>
			<br></br>
			<LogoutButton></LogoutButton>
		</main>
	);
}
