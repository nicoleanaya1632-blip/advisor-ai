export const metadata = {
  title: "AdvisorAI",
  description: "A shared tool to ask sharper questions and get new perspectives.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          async
        />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
          async
        />
      </head>
      <body style={{ margin: 0, background: "#ECEAE5" }}>{children}</body>
    </html>
  );
}
