import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
const NotFound = () => {
  return (
    <div className="h-full w-full flex justify-center items-center bg-gradient-beauty text-primary  flex-col gap-y-5 px-5 py-16 rounded-3xl">
      <h1 className="font-bold text-6xl">
        404 NotFound
      </h1>
      <p className="font-600 text-4xl">
        This Page Doesn't Exist
      </p>
      <Link to="/" className="hover:underline hover:underline-offset-4 text-3xl flex items-center gap-1">
        <ArrowLeft />
        Go Back
      </Link>
    </div>
    
  )
}

export default NotFound