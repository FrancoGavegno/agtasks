import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function LandingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
            <div className="flex justify-center space-x-4">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center mb-16">
            <Skeleton className="h-96 w-full max-w-4xl rounded-lg" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card>
              <CardContent className="p-6 text-center">
                <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
                <Skeleton className="h-6 w-32 mx-auto mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card>
              <CardContent className="p-6 text-center">
                <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
                <Skeleton className="h-6 w-32 mx-auto mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card>
              <CardContent className="p-6 text-center">
                <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
                <Skeleton className="h-6 w-32 mx-auto mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-10 w-80 mx-auto mb-6 bg-green-500" />
          <Skeleton className="h-6 w-96 mx-auto mb-8 bg-green-500" />
          <Skeleton className="h-12 w-48 mx-auto bg-green-500" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32 bg-gray-700" />
            <Skeleton className="h-6 w-24 bg-gray-700" />
          </div>
        </div>
      </footer>
    </div>
  )
} 