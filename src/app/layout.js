import { TaskProvider } from "@/context/taskContext.js";
import "../../public/css/styles.css";
import "../../public/css/signForms.css";
import "../../public/css/nav.css";
import "../../public/css/chat.css";
import "../../public/css/navLeft.css"

export const metadata = {
  title:"NextChat"
}

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
