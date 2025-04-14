export interface User {
    email: string
    firstName: string
    id: string
    lastName: string
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