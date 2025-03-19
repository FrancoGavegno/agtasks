"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Layers, ZoomIn, ZoomOut } from "lucide-react"

export function ServiceMap() {
  const [zoomLevel, setZoomLevel] = useState(1)

  const handleZoomIn = () => {
    if (zoomLevel < 2) setZoomLevel(zoomLevel + 0.2)
  }

  const handleZoomOut = () => {
    if (zoomLevel > 0.6) setZoomLevel(zoomLevel - 0.2)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Field Map</CardTitle>
              <CardDescription>Interactive map with field data layers</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="prescription">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select map type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prescription">Seeding Prescription</SelectItem>
                  <SelectItem value="soil">Soil Analysis</SelectItem>
                  <SelectItem value="yield">Historical Yield</SelectItem>
                  <SelectItem value="satellite">Satellite Imagery</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="rounded-lg border overflow-hidden bg-white" style={{ height: "500px" }}>
              {/* This would be replaced with an actual map component */}
              <div
                className="w-full h-full relative"
                style={{
                  backgroundImage: "url('/placeholder.svg?height=500&width=800')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.3s ease",
                }}
              >
                {/* Simulated field zones with different colors */}
                <div className="absolute inset-0 opacity-60">
                  <div className="absolute top-[10%] left-[20%] w-[30%] h-[40%] bg-green-600 rounded-full blur-md"></div>
                  <div className="absolute top-[30%] left-[40%] w-[40%] h-[30%] bg-green-400 rounded-full blur-md"></div>
                  <div className="absolute top-[50%] left-[10%] w-[25%] h-[35%] bg-green-300 rounded-full blur-md"></div>
                  <div className="absolute top-[20%] left-[60%] w-[30%] h-[45%] bg-green-500 rounded-full blur-md"></div>
                </div>
              </div>
            </div>

            {/* Map controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button variant="secondary" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="icon">
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
              <span className="text-sm">High Seeding Rate (40k seeds/acre)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm">Medium-High (35k seeds/acre)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-400"></div>
              <span className="text-sm">Medium (30k seeds/acre)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-300"></div>
              <span className="text-sm">Low (25k seeds/acre)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="prescription" className="space-y-4">
        <TabsList>
          <TabsTrigger value="prescription">Prescription Data</TabsTrigger>
          <TabsTrigger value="soil">Soil Data</TabsTrigger>
          <TabsTrigger value="yield">Yield History</TabsTrigger>
        </TabsList>

        <TabsContent value="prescription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seeding Prescription Details</CardTitle>
              <CardDescription>Variable rate seeding prescription information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Total Field Area</h3>
                    <p>42 hectares</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Average Seeding Rate</h3>
                    <p>32,500 seeds/acre</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Seed Type</h3>
                    <p>Pioneer P1197AM</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Prescription Created</h3>
                    <p>February 20, 2025</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Zone Distribution</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "25%" }}></div>
                      </div>
                      <span className="ml-2 text-sm">25% High Rate Zone</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                      <span className="ml-2 text-sm">30% Medium-High Rate Zone</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-400 h-2.5 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                      <span className="ml-2 text-sm">30% Medium Rate Zone</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-300 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                      <span className="ml-2 text-sm">15% Low Rate Zone</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Soil Analysis Data</CardTitle>
              <CardDescription>Soil composition and nutrient information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Soil Type</h3>
                    <p>Sandy Loam / Clay Loam</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">pH Level</h3>
                    <p>6.2 - 7.1 (varies by zone)</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Organic Matter</h3>
                    <p>2.1% - 3.8%</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Nitrogen (N)</h3>
                    <p>Medium-High</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Phosphorus (P)</h3>
                    <p>Medium</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Potassium (K)</h3>
                    <p>Medium-Low</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Soil Composition Map</h3>
                  <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Soil composition visualization would appear here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="yield" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Yield Data</CardTitle>
              <CardDescription>Previous seasons' yield information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Last Season Yield</h3>
                    <p>185 bushels/acre (average)</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Previous Crop</h3>
                    <p>Soybeans</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Yield Variability</h3>
                    <p>High (140-220 bushels/acre)</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">3-Year Yield Trend</h3>
                  <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Yield trend chart would appear here</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

