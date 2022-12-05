import { withModifiers } from 'vue'

export function isBrowser() {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

/**
 * Vue's withModifiers function is not type safe 100%, this is just wrapper for it
 */
export function withEventModifiers<T extends (event: any) => any>(fn: T, modifiers: string[]): T {
  return withModifiers(fn, modifiers) as unknown as T
}
