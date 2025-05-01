"use client";

import { cancelAppointment } from "@/actions/booking";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface CancelAppointmentButtonProps {
  appointmentId: string;
}

export const CancelAppointmentButton = ({
  appointmentId,
}: CancelAppointmentButtonProps) => {
  const handleCancel = () => {
    cancelAppointment(appointmentId)
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        }

        if (data.success) {
          toast.success(data.success);
        }
      })
      .catch(() => toast.error("Something went wrong!"));
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-accent"
          onSelect={(e) => e.preventDefault()}
        >
          Cancel
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Cancellation</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately remove the event from all calendars and notify
            participants. You can&apos;t undo this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
