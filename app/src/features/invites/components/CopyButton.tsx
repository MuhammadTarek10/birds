import { Button } from '#/components/ui/Button'
import { toast } from '#/lib/toasts'

export const CopyButton = ({ value }: { value: string }) => {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Copied', 'Share the link like a love letter.')
    } catch {
      toast.error("Couldn't copy", 'Copy the URL manually.')
    }
  }
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => void copy()}
    >
      Copy
    </Button>
  )
}
