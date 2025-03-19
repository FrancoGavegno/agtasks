"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PaperclipIcon, SendIcon, SmileIcon } from "lucide-react"

interface Message {
  id: string
  sender: {
    id: string
    name: string
    avatar: string
    role: string
  }
  content: string
  timestamp: Date
  attachments?: {
    name: string
    type: string
  }[]
}

export function ServiceChat() {
  const [newMessage, setNewMessage] = useState("")

  // Sample messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: {
        id: "1",
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Technical Lead",
      },
      content:
        "I've uploaded the soil analysis report. The northern section shows higher organic matter content which should support higher seeding rates.",
      timestamp: new Date("2025-02-15T10:30:00"),
      attachments: [{ name: "Soil Analysis Report.pdf", type: "PDF" }],
    },
    {
      id: "2",
      sender: {
        id: "2",
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Project Owner",
      },
      content: "Thanks Maria. Have you started working on the seeding prescription map based on this data?",
      timestamp: new Date("2025-02-15T11:15:00"),
    },
    {
      id: "3",
      sender: {
        id: "1",
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Technical Lead",
      },
      content:
        "Yes, I'm working with Sarah on that. We should have a draft ready by tomorrow. We're thinking of using 4 different seeding rate zones.",
      timestamp: new Date("2025-02-15T11:20:00"),
    },
    {
      id: "4",
      sender: {
        id: "4",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Data Analyst",
      },
      content:
        "I've processed the historical yield data and overlaid it with the soil analysis. There's a strong correlation between yield and organic matter in most areas, but there are a few anomalies in the western section.",
      timestamp: new Date("2025-02-15T13:45:00"),
    },
    {
      id: "5",
      sender: {
        id: "3",
        name: "Carlos Mendez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Field Operator",
      },
      content:
        "That western section had drainage issues last season. We've improved the drainage now, so we might see better performance this year.",
      timestamp: new Date("2025-02-15T14:10:00"),
    },
    {
      id: "6",
      sender: {
        id: "2",
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Project Owner",
      },
      content:
        "Good point, Carlos. Let's adjust the seeding rates in that area accordingly. @Maria, can you and Sarah take that into account?",
      timestamp: new Date("2025-02-15T14:30:00"),
    },
    {
      id: "7",
      sender: {
        id: "1",
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Technical Lead",
      },
      content: "Will do. We'll update the prescription map and share it for review tomorrow.",
      timestamp: new Date("2025-02-15T14:35:00"),
    },
  ])

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date)
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: `${messages.length + 1}`,
        sender: {
          id: "2",
          name: "John Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Project Owner",
        },
        content: newMessage,
        timestamp: new Date(),
      }

      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Group messages by date
  const groupedMessages: { [key: string]: Message[] } = {}
  messages.forEach((message) => {
    const dateKey = formatDate(message.timestamp)
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = []
    }
    groupedMessages[dateKey].push(message)
  })

  return (
    <Card className="h-[calc(100vh-16rem)]">
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="text-xl">Team Communication</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">{date}</span>
                </div>
              </div>

              {dateMessages.map((message) => (
                <div key={message.id} className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={message.sender.avatar} />
                    <AvatarFallback>
                      {message.sender.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{message.sender.name}</span>
                      <span className="text-xs text-muted-foreground">{message.sender.role}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{formatTime(message.timestamp)}</span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md">
                            <PaperclipIcon className="h-3 w-3" />
                            <span>{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button variant="ghost" size="icon">
              <PaperclipIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <SmileIcon className="h-5 w-5" />
            </Button>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <SendIcon className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

