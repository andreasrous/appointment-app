import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SectionCardsProps {
  totalRevenue: number;
  confirmedAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
}

export const SectionCards = ({
  totalRevenue,
  confirmedAppointments,
  completedAppointments,
  canceledAppointments,
}: SectionCardsProps) => {
  const cardData = [
    {
      label: "Total Revenue",
      value:
        totalRevenue.toLocaleString("el-GR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + "€",
      showBadge: false,
    },
    {
      label: "Confirmed Appointments",
      value: confirmedAppointments,
      showBadge: true,
    },
    {
      label: "Completed Appointments",
      value: completedAppointments,
      showBadge: true,
    },
    {
      label: "Canceled Appointments",
      value: canceledAppointments,
      showBadge: true,
    },
  ];

  return (
    <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cardData.map(({ label, value, showBadge }) => (
        <Card key={label} className="relative">
          <CardHeader>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-3xl font-semibold tabular-nums">
              {value}
            </CardTitle>
          </CardHeader>
          {showBadge && (
            <div className="absolute right-4 bottom-4">
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs"
              >
                Business
              </Badge>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
