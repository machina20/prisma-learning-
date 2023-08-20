type props = {
	children?: React.ReactNode;
};

export const Success = ({ children }: props) => {
	return (
		<div className="p-4 mb-4 bg-green-500 rounded-lg flex justify-center text-white">
			{children}
		</div>
	);
};
