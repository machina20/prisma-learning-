type props = {
	children?: React.ReactNode;
};

export const Alert = ({ children }: props) => {
	return (
		<div className="p-4 mb-4 bg-red-500 rounded-lg flex justify-center text-white">
			{children}
		</div>
	);
};
