export interface User {
    email: string
    firstName: string
    id: string
    lastName: string
    invitationStatus?: "Not Sent" | "Sent"
}

export interface Domain {
    id: number
    languageId: number
    name: string
    hasLogo: boolean
    domainUrl: string
    deleted: boolean
}

export interface Project {
    id: number
    name: string
    domain: Domain
}

export interface Service {
    id: string
    name: string
    establishment: string
    lots: string
    totalHectares: number
    progress: number
    startDate: string
    status: string
}