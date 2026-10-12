import { toast } from "sonner"

type ToastActionOptions = {
  loading: string
  success: string
  error?: string
}

/**
 * Run an async action with Sonner loading → success/error feedback.
 * Reusable across admin UI (sign-out, saves, toggles).
 */
export async function toastAction<T>(
  action: () => Promise<T>,
  { loading, success, error = "Something went wrong" }: ToastActionOptions,
): Promise<T> {
  const id = toast.loading(loading)
  try {
    const result = await action()
    toast.success(success, { id })
    return result
  } catch (err) {
    const message = err instanceof Error && err.message ? err.message : error
    toast.error(message, { id })
    throw err
  }
}
