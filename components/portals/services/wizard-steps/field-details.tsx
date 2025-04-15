"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface FieldDetailsProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function FieldDetails({ formData, updateFormData }: FieldDetailsProps) {
  const handleTopographyChange = (value: string, checked: boolean) => {
    if (checked) {
      updateFormData({ topography: [...formData.topography, value] })
    } else {
      updateFormData({ topography: formData.topography.filter((item: string) => item !== value) })
    }
  }

  const handleFieldIssuesChange = (value: string, checked: boolean) => {
    if (checked) {
      updateFormData({ fieldIssues: [...formData.fieldIssues, value] })
    } else {
      updateFormData({ fieldIssues: formData.fieldIssues.filter((item: string) => item !== value) })
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Field Information</CardTitle>
          <CardDescription>Provide details about the field where this service will be applied</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field-name">
              Field Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="field-name"
              placeholder="e.g., North Field"
              value={formData.fieldName}
              onChange={(e) => updateFormData({ fieldName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="field-size">
                Field Size <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="field-size"
                  type="number"
                  placeholder="e.g., 25"
                  value={formData.fieldSize}
                  onChange={(e) => updateFormData({ fieldSize: e.target.value })}
                />
                <Select value={formData.fieldUnit} onValueChange={(value) => updateFormData({ fieldUnit: value })}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hectares">Hectares</SelectItem>
                    <SelectItem value="acres">Acres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="field-elevation">Average Elevation</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="field-elevation"
                  type="number"
                  placeholder="e.g., 250"
                  value={formData.elevation}
                  onChange={(e) => updateFormData({ elevation: e.target.value })}
                />
                <Select
                  value={formData.elevationUnit}
                  onValueChange={(value) => updateFormData({ elevationUnit: value })}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="feet">Feet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-location">
              Location <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="field-location"
                placeholder="e.g., North County, CA"
                className="flex-1"
                value={formData.location}
                onChange={(e) => updateFormData({ location: e.target.value })}
              />
              <Button variant="outline" size="icon">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Enter address or click the pin to select on map</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crop-type">
              Crop Type <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.cropType} onValueChange={(value) => updateFormData({ cropType: value })}>
              <SelectTrigger id="crop-type">
                <SelectValue placeholder="Select crop type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Corn">Corn</SelectItem>
                <SelectItem value="Soybeans">Soybeans</SelectItem>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Cotton">Cotton</SelectItem>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Barley">Barley</SelectItem>
                <SelectItem value="Sorghum">Sorghum</SelectItem>
                <SelectItem value="Canola">Canola</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crop-variety">Crop Variety</Label>
            <Input
              id="crop-variety"
              placeholder="e.g., Pioneer P1197AM"
              value={formData.cropVariety}
              onChange={(e) => updateFormData({ cropVariety: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Field Conditions</CardTitle>
          <CardDescription>Provide information about the current field conditions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="soil-type">Soil Type</Label>
            <Select value={formData.soilType} onValueChange={(value) => updateFormData({ soilType: value })}>
              <SelectTrigger id="soil-type">
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sandy Loam">Sandy Loam</SelectItem>
                <SelectItem value="Clay Loam">Clay Loam</SelectItem>
                <SelectItem value="Silt Loam">Silt Loam</SelectItem>
                <SelectItem value="Clay">Clay</SelectItem>
                <SelectItem value="Sandy">Sandy</SelectItem>
                <SelectItem value="Mixed">Mixed (Variable)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="previous-crop">Previous Crop</Label>
            <Select value={formData.previousCrop} onValueChange={(value) => updateFormData({ previousCrop: value })}>
              <SelectTrigger id="previous-crop">
                <SelectValue placeholder="Select previous crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Corn">Corn</SelectItem>
                <SelectItem value="Soybeans">Soybeans</SelectItem>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Cotton">Cotton</SelectItem>
                <SelectItem value="Fallow">Fallow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Topography</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="topography-flat"
                  checked={formData.topography.includes("Flat")}
                  onCheckedChange={(checked) => handleTopographyChange("Flat", checked as boolean)}
                />
                <Label htmlFor="topography-flat" className="text-sm font-normal">
                  Flat
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="topography-rolling"
                   checked={formData.topography.includes("Rolling")}
                  onCheckedChange={(checked) => handleTopographyChange("Rolling", checked as boolean)}
                />
                <Label htmlFor="topography-rolling" className="text-sm font-normal">
                  Rolling
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="topography-terraced"
                  checked={formData.topography.includes("Terraced")}
                  onCheckedChange={(checked) => handleTopographyChange("Terraced", checked as boolean)}
                />
                <Label htmlFor="topography-terraced" className="text-sm font-normal">
                  Terraced
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="topography-sloped"
                  checked={formData.topography.includes("Sloped")}
                  onCheckedChange={(checked) => handleTopographyChange("Sloped", checked as boolean)}
                />
                <Label htmlFor="topography-sloped" className="text-sm font-normal">
                  Sloped
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Irrigation System</Label>
            <Select
              value={formData.irrigationSystem}
              onValueChange={(value) => updateFormData({ irrigationSystem: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select irrigation system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Center Pivot">Center Pivot</SelectItem>
                <SelectItem value="Drip Irrigation">Drip Irrigation</SelectItem>
                <SelectItem value="Sprinkler System">Sprinkler System</SelectItem>
                <SelectItem value="Flood Irrigation">Flood Irrigation</SelectItem>
                <SelectItem value="None">None (Rainfed)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Known Field Issues</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="issue-drainage"
                  checked={formData.fieldIssues.includes("Drainage Issues")}
                  onCheckedChange={(checked) => handleFieldIssuesChange("Drainage Issues", checked as boolean)}
                />
                <Label htmlFor="issue-drainage" className="text-sm font-normal">
                  Drainage Issues
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="issue-compaction"
                  checked={formData.fieldIssues.includes("Soil Compaction")}
                  onCheckedChange={(checked) => handleFieldIssuesChange("Soil Compaction", checked as boolean)}
                />
                <Label htmlFor="issue-compaction" className="text-sm font-normal">
                  Soil Compaction
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="issue-erosion"
                  checked={formData.fieldIssues.includes("Erosion")}
                  onCheckedChange={(checked) => handleFieldIssuesChange("Erosion", checked as boolean)}
                />
                <Label htmlFor="issue-erosion" className="text-sm font-normal">
                  Erosion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="issue-salinity"
                  checked={formData.fieldIssues.includes("Salinity")}
                  onCheckedChange={(checked) => handleFieldIssuesChange("Salinity", checked as boolean)}
                />
                <Label htmlFor="issue-salinity" className="text-sm font-normal">
                  Salinity
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field-notes">Additional Notes</Label>
            <Textarea
              id="field-notes"
              placeholder="Any other relevant information about the field..."
              rows={3}
              value={formData.fieldNotes}
              onChange={(e) => updateFormData({ fieldNotes: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

