import NavLeft from "@/components/NavLeft";
import Navigation from "@/components/Navigation.jsx";

export default function App() {
  return (
    <>
    <Navigation/>
    <main style={{display:"flex"}}>
      <NavLeft/>
    </main>
    </>
  )
}
