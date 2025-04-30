import * as motion from "motion/react-client";

import { notFound } from "next/navigation";

import { Employee } from "@prisma/client";
import { BookingForm } from "@/components/booking/booking-form";
import { getBusinessById } from "@/data/business";
import { getServicesWithEmployeesByBusinessId } from "@/data/service";
import { getAvailabilitiesByBusinessId } from "@/data/availability";

interface BookingPageProps {
  params: { businessId: string };
}

const BookingPage = async ({ params }: BookingPageProps) => {
  const { businessId } = await params;
  const business = await getBusinessById(businessId);
  const services = await getServicesWithEmployeesByBusinessId(businessId);
  const availabilities = await getAvailabilitiesByBusinessId(businessId);

  if (!business || !services || !availabilities) {
    return notFound();
  }

  const employeesByService = services.reduce((acc, service) => {
    acc[service.id] = service.employees;
    return acc;
  }, {} as Record<string, Employee[]>);

  return (
    <motion.div
      className="h-full p-4 sm:p-16"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <BookingForm
        business={business}
        services={services}
        availabilities={availabilities}
        employeesByService={employeesByService}
      />
    </motion.div>
  );
};

export default BookingPage;
