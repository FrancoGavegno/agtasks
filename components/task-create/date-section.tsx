import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from 'lucide-react'
import { cn } from "@/lib/utils"

interface DateSectionProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
}

export function DateSection({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Task Period</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? new Date(startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate ? new Date(startDate) : undefined}
                onSelect={(date) => onStartDateChange(date ? date.toISOString() : "")}
                initialFocus
                className="rounded-md border shadow [&_.rdp-cell]:w-10 [&_.rdp-cell]:text-center [&_.rdp-head_th]:w-10 [&_.rdp-head_th]:text-center"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? new Date(endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate ? new Date(endDate) : undefined}
                onSelect={(date) => onEndDateChange(date ? date.toISOString() : "")}
                initialFocus
                className="rounded-md border shadow [&_.rdp-cell]:w-10 [&_.rdp-cell]:text-center [&_.rdp-head_th]:w-10 [&_.rdp-head_th]:text-center"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}

