import { TaskProvider } from "@/context/taskContext.js";
import "../../public/css/styles.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TaskProvider>
          {children}
        </TaskProvider>
      </body>
    </html>
  )
}
