import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmModal({
  open,
  title = "Delete Post",
  description = "Are you sure you want to delete this post? This action cannot be undone.",
  onCancel,
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onCancel?.(); }}>
      <DialogContent>
        {/* Title/Description를 Content */}
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={(e) => { e.stopPropagation?.(); onCancel?.(e); }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={(e) => { e.stopPropagation?.(); onConfirm?.(e); }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
