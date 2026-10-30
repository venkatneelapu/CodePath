export const metadata = {
  title: 'CodePath API Server',
  description: 'Backend REST API for CodePath Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

