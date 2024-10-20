import CustomCursor from "@/components/customCursor";
import SmoothScroll from "@/components/SmoothScroll";

import {Inter, Poppins} from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"], variable: "--font-alfa" });
const poppins = Poppins({ 
  weight: "500",
  subsets: ["latin"],
  variable: "--font-beta",
 });

export const metadata = {
  title: "SHUBHAM UBARHANDE | PORTFOLIO",
  description: "Shubaham's Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <CustomCursor />
        <SmoothScroll>
        {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
