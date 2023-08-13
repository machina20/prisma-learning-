import Link from "next/link";

export default function () {
	return (
		<main className=" bg-[#201F1F] text-white h-screen">
			<div className=" text-6xl pt-16 flex justify-center ">
				You should only be seeing this if you are auth'd
			</div>
			<div className="flex justify-center mt-16 text-xl">
				<Link className="hover:underline" href={"/"}>
					Return to Home
				</Link>
			</div>
		</main>
	);
}
