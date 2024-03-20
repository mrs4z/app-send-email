
import type { Metadata } from 'next'
import './global.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export const metadata: Metadata = {
  title: 'Тестирование отправки писем',
  description: 'Отправка писем ejs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={false}>
          <div className="wrapper">
            <h1>{metadata.title as string}</h1>
            <p>{metadata.description}</p>
            <div className="content">
              {children}
              <ToastContainer />
            </div>
          </div>
      </body>
    </html>
  )
}
