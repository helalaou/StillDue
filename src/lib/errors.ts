export class ConflictError extends Error {constructor(){super('This item changed on another device. Your view has refreshed; review the latest version before saving again.')}}
export function errorMessage(error:unknown){return error instanceof Error?error.message:'Something went wrong. Please try again.'}
