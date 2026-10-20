import { Calendar, DollarSign, Sparkles } from "lucide-react"
import { Card, CardContent } from "../../ui/card"


const Benefits = () => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
    <CardContent className="p-8">
      <h3 className="text-xl font-semibold mb-6 text-center">Why Join BeautyBook?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold">Reach New Customers</h4>
          <p className="text-sm text-muted-foreground">
            Get discovered by thousands of beauty seekers in your area
          </p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold">Manage Bookings</h4>
          <p className="text-sm text-muted-foreground">
            Easy-to-use dashboard to manage your appointments
          </p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-semibold">Grow Your Revenue</h4>
          <p className="text-sm text-muted-foreground">
            Fill empty slots and increase your booking rate
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

export default Benefits