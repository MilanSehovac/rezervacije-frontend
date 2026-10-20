import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Seo } from "../components/Seo"

const NotFound = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-5 rounded-3xl bg-gradient-beauty px-5 py-16 text-center text-primary">
      <Seo title="Page not found" noindex />
      <h1 className="text-5xl font-bold md:text-6xl">404</h1>
      <p className="text-2xl md:text-3xl">This page does not exist</p>
      <Link to="/" className="flex items-center gap-1 text-xl hover:underline hover:underline-offset-4">
        <ArrowLeft aria-hidden="true" />
        Back to the home page
      </Link>
    </div>
  )
}

export default NotFound
