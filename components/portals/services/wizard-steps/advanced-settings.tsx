"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface AdvancedSettingsProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function AdvancedSettings({ formData, updateFormData }: AdvancedSettingsProps) {
  const handleIntegrationChange = (value: string, checked: boolean) => {
    if (checked) {
      updateFormData({ integrations: [...formData.integrations, value] })
    } else {
      updateFormData({ integrations: formData.integrations.filter((item: string) => item !== value) })
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Budget & Financial</CardTitle>
          <CardDescription>Set budget and financial parameters for this service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="total-budget">Total Budget (USD)</Label>
            <Input
              id="total-budget"
              type="number"
              placeholder="e.g., 5000"
              value={formData.budget}
              onChange={(e) => updateFormData({ budget: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Budget Allocation</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="equipment-budget" className="text-sm">
                    Equipment
                  </Label>
                  <span className="text-sm">{formData.budgetAllocation.equipment}%</span>
                </div>
                <Slider
                  value={[formData.budgetAllocation.equipment]}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    updateFormData({
                      budgetAllocation: { ...formData.budgetAllocation, equipment: value[0] },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="labor-budget" className="text-sm">
                    Labor
                  </Label>
                  <span className="text-sm">{formData.budgetAllocation.labor}%</span>
                </div>
                <Slider
                  value={[formData.budgetAllocation.labor]}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    updateFormData({
                      budgetAllocation: { ...formData.budgetAllocation, labor: value[0] },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="materials-budget" className="text-sm">
                    Materials
                  </Label>
                  <span className="text-sm">{formData.budgetAllocation.materials}%</span>
                </div>
                <Slider
                  value={[formData.budgetAllocation.materials]}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    updateFormData({
                      budgetAllocation: { ...formData.budgetAllocation, materials: value[0] },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="other-budget" className="text-sm">
                    Other
                  </Label>
                  <span className="text-sm">{formData.budgetAllocation.other}%</span>
                </div>
                <Slider
                  value={[formData.budgetAllocation.other]}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    updateFormData({
                      budgetAllocation: { ...formData.budgetAllocation, other: value[0] },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="funding-source">Funding Source</Label>
            <Select value={formData.fundingSource} onValueChange={(value) => updateFormData({ fundingSource: value })}>
              <SelectTrigger id="funding-source">
                <SelectValue placeholder="Select funding source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal Budget</SelectItem>
                <SelectItem value="client">Client Funded</SelectItem>
                <SelectItem value="grant">Grant</SelectItem>
                <SelectItem value="mixed">Mixed Sources</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roi-target">ROI Target (%)</Label>
            <Input
              id="roi-target"
              type="number"
              placeholder="e.g., 15"
              value={formData.roiTarget}
              onChange={(e) => updateFormData({ roiTarget: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Settings</CardTitle>
          <CardDescription>Configure additional options for this service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={formData.priority} onValueChange={(value) => updateFormData({ priority: value })}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data Collection Frequency</Label>
            <Select
              value={formData.dataCollectionFrequency}
              onValueChange={(value) => updateFormData({ dataCollectionFrequency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="custom">Custom Schedule</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Integration with External Systems</Label>
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="weather-integration"
                    checked={formData.integrations.includes("Weather Data Service")}
                    onCheckedChange={(checked) => handleIntegrationChange("Weather Data Service", checked as boolean)}
                  />
                  <Label htmlFor="weather-integration" className="text-sm font-normal">
                    Weather Data Service
                  </Label>
                </div>
                <Badge variant="outline">API</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="equipment-integration"
                    checked={formData.integrations.includes("Equipment Telemetry")}
                    onCheckedChange={(checked) => handleIntegrationChange("Equipment Telemetry", checked as boolean)}
                  />
                  <Label htmlFor="equipment-integration" className="text-sm font-normal">
                    Equipment Telemetry
                  </Label>
                </div>
                <Badge variant="outline">IoT</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="satellite-integration"
                    checked={formData.integrations.includes("Satellite Imagery")}
                    onCheckedChange={(checked) => handleIntegrationChange("Satellite Imagery", checked as boolean)}
                  />
                  <Label htmlFor="satellite-integration" className="text-sm font-normal">
                    Satellite Imagery
                  </Label>
                </div>
                <Badge variant="outline">External</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="erp-integration"
                    checked={formData.integrations.includes("Farm Management ERP")}
                    onCheckedChange={(checked) => handleIntegrationChange("Farm Management ERP", checked as boolean)}
                  />
                  <Label htmlFor="erp-integration" className="text-sm font-normal">
                    Farm Management ERP
                  </Label>
                </div>
                <Badge variant="outline">Data Sync</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-sm">
                  Notifications
                </Label>
                <p className="text-xs text-muted-foreground">Enable notifications for all team members</p>
              </div>
              <Switch
                id="notifications"
                checked={formData.notifications}
                onCheckedChange={(checked) => updateFormData({ notifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public" className="text-sm">
                  Public Visibility
                </Label>
                <p className="text-xs text-muted-foreground">Make this service visible to all organization members</p>
              </div>
              <Switch
                id="public"
                checked={formData.publicVisibility}
                onCheckedChange={(checked) => updateFormData({ publicVisibility: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics" className="text-sm">
                  Advanced Analytics
                </Label>
                <p className="text-xs text-muted-foreground">Enable AI-powered analytics and recommendations</p>
              </div>
              <Switch
                id="analytics"
                checked={formData.advancedAnalytics}
                onCheckedChange={(checked) => updateFormData({ advancedAnalytics: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-reports" className="text-sm">
                  Automated Reports
                </Label>
                <p className="text-xs text-muted-foreground">Generate and send reports automatically</p>
              </div>
              <Switch
                id="auto-reports"
                checked={formData.automatedReports}
                onCheckedChange={(checked) => updateFormData({ automatedReports: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

