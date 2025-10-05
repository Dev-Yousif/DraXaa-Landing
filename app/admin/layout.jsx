import { Providers } from "../providers";
import "@/styles/style.scss";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
