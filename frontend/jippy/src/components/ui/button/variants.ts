export const buttonVariants = {
  default: "bg-gray-100 hover:bg-gray-200 text-gray-800",
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  danger: "bg-red-500 hover:bg-red-600 text-white",
  orange: "bg-orange-500 hover:bg-orange-600 text-white",
  "orange-border": "border-2 border-orange-500 text-orange-500 hover:bg-orange-50",
  brown: "bg-amber-800 hover:bg-amber-900 text-white"
} as const;

export type ButtonVariant = keyof typeof buttonVariants;