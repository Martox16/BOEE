import "./globals.css";

export const metadata = {
  title: "Mi Web",
  description: "Sitio con fondo violetita",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}