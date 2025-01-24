// src/types.ts
export interface TelegramLoginProps {
  onAuth: (userData: any) => void; // Callback to pass user data to the parent
  onError: (error: string) => void; // Callback to handle errors
}
