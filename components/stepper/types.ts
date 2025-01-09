export type FormData = {
    name: string;
    description: string;
    [key: string]: string | undefined; // Esto permite cualquier otro campo string
};