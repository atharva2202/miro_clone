import { Link, PenIcon, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import { ConfirmModal } from "./confirm-modal";
import { renameModal } from "@/store/modal-rename";

interface ActionsProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps["side"];
    sideOffset?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string;
  }
  
  export const Actions = ({
    children,
    side,
    sideOffset,
    id,
    title,
  }: ActionsProps) => {
    const { onOpen } = renameModal();
    const { mutate, pending } = useApiMutation(api.board.remove);
  
    const onCopyLink = () => {
      navigator.clipboard
        .writeText(`${window.location.origin}/board/${id}`)
        .then(() => toast.success("Link copied"))
        .catch(() => toast.error("Error copying link"));
    };
  
    const onDelete = () => {
      mutate({ id })
        .then(() => toast.success("Board deleted"))
        .catch(() => toast.error("Error deleting board"));
    };
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          side={side}
          sideOffset={sideOffset}
          className="w-50"
        >
          <DropdownMenuItem className="p-3 cursor-pointer" onClick={onCopyLink}>
            <Link className="h-4 w-4 mr-2" />
            Copy board link
          </DropdownMenuItem>
          <DropdownMenuItem className="p-3 cursor-pointer" onClick={() => onOpen(id, title)}>
            <PenIcon className="h-4 w-4 mr-2" />
            Rename
          </DropdownMenuItem>
          <ConfirmModal
            header="Delete board"
            description="This will permanently delete the board and its content"
            disabled={pending}
            onConfirm={onDelete}
          >
            <Button variant="ghost" className="p-3 cursor-pointer text-sm w-full justify-start font-normal">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </ConfirmModal>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };