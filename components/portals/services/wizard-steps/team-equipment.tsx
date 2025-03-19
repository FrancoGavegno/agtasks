"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface TeamEquipmentProps {
  formData: any
  updateFormData: (data: any) => void
}

export default function TeamEquipment({ formData, updateFormData }: TeamEquipmentProps) {
  // Sample team members data
  const teamMembers = [
    { id: "1", name: "Maria Rodriguez", role: "Agronomist", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "2", name: "John Smith", role: "Farmer", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "3", name: "Carlos Mendez", role: "Technical Specialist", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "4", name: "Sarah Johnson", role: "Data Analyst", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "5", name: "Miguel Torres", role: "Equipment Provider", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "6", name: "Laura Chen", role: "Soil Scientist", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "7", name: "David Wilson", role: "Irrigation Specialist", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  // Sample equipment data
  const equipmentItems = [
    { id: "1", name: "John Deere S780 Combine", type: "Harvester" },
    { id: "2", name: "Case IH Precision Planter 2150", type: "Planter" },
    { id: "3", name: "New Holland T8 Tractor", type: "Tractor" },
    { id: "4", name: "DJI Agras T30 Drone", type: "Drone" },
    { id: "5", name: "Raven Precision Sprayer", type: "Sprayer" },
  ]

  const toggleTeamMember = (id: string) => {
    if (formData.teamMembers.includes(id)) {
      updateFormData({
        teamMembers: formData.teamMembers.filter((memberId: string) => memberId !== id),
      })
    } else {
      updateFormData({
        teamMembers: [...formData.teamMembers, id],
      })
    }
  }

  const toggleEquipment = (id: string) => {
    if (formData.equipment.includes(id)) {
      updateFormData({
        equipment: formData.equipment.filter((equipId: string) => equipId !== id),
      })
    } else {
      updateFormData({
        equipment: [...formData.equipment, id],
      })
    }
  }

  const updateTeamMemberRole = (memberId: string, role: string) => {
    updateFormData({
      teamRoles: {
        ...formData.teamRoles,
        [memberId]: role,
      },
    })
  }

  const updateEquipmentAvailability = (equipId: string, availability: string) => {
    updateFormData({
      equipmentAvailability: {
        ...formData.equipmentAvailability,
        [equipId]: availability,
      },
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Team Assignment</CardTitle>
          <CardDescription>Select team members and assign roles for this service</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Team Members</Label>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-3 w-3" />
                Add New Member
              </Button>
            </div>

            <div className="max-h-[400px] overflow-y-auto pr-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={formData.teamMembers.includes(member.id)}
                    onCheckedChange={() => toggleTeamMember(member.id)}
                  />
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor={`member-${member.id}`} className="font-medium cursor-pointer">
                      {member.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <Select
                    disabled={!formData.teamMembers.includes(member.id)}
                    value={formData.teamRoles[member.id] || ""}
                    onValueChange={(value) => updateTeamMemberRole(member.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-owner">Project Owner</SelectItem>
                      <SelectItem value="technical-lead">Technical Lead</SelectItem>
                      <SelectItem value="field-operator">Field Operator</SelectItem>
                      <SelectItem value="data-analyst">Data Analyst</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Assignment</CardTitle>
          <CardDescription>Select equipment needed for this service</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Equipment</Label>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-3 w-3" />
              Add New Equipment
            </Button>
          </div>

          <div className="space-y-2">
            {equipmentItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted">
                <Checkbox
                  id={`equipment-${item.id}`}
                  checked={formData.equipment.includes(item.id)}
                  onCheckedChange={() => toggleEquipment(item.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={`equipment-${item.id}`} className="font-medium cursor-pointer">
                    {item.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                </div>
                <Select
                  disabled={!formData.equipment.includes(item.id)}
                  value={formData.equipmentAvailability[item.id] || ""}
                  onValueChange={(value) => updateEquipmentAvailability(item.id, value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owned">Owned</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="contractor">Contractor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-2">
            <Label>Equipment Notes</Label>
            <Textarea
              placeholder="Additional notes about equipment requirements..."
              rows={3}
              value={formData.equipmentNotes}
              onChange={(e) => updateFormData({ equipmentNotes: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

