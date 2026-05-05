import { Poppins } from "next/font/google";
// @ts-ignore: side-effect CSS import declaration not found
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-poppins",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${poppins.variable} antialiased font-sans`}>
				{children}
				<Toaster
					richColors
					position="top-center"
					closeButton
					toastOptions={{
						style: {
							background: "#1a1a1a",
							color: "#fff",
							border: "1px solid #333",
						},
						className: "font-sans",
					}}
				/>
			</body>
		</html>
	);
}
