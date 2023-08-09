import { prisma } from "../../lib/prisma";

export default async function Home() {
	const user = await prisma.user.findFirst({
		where: {
			email: "test@test.com",
		},
	});
	return <main className="flex justify-center pt-16">Hello {user?.name}</main>;
}
