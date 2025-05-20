import { startOfDay } from "date-fns";
import { Day, UserRole } from "@prisma/client";
import { z } from "zod";

export const MessageSchema = z.object({
  conversationId: z.string(),
  type: z.string(),
  content: z.array(z.string().min(1, "Message cannot be empty")),
});

export const ConversationSchema = z.object({
  businessId: z.string().min(1, "Please select a business."),
});

export const BookingSchema = z.object({
  description: z.optional(
    z.string().max(500, "Description is too long").nullable()
  ),
  startTime: z.date().min(new Date()),
  date: z.date().min(startOfDay(new Date()), "Must be in the future"),
  businessId: z.string(),
  serviceId: z.string(),
  employeeId: z.string(),
  paymentIntentId: z.optional(z.string().nullable()),
});

export const EmployeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .refine((value) => /^[a-zA-Z\s]+$/.test(value), {
      message: "Name must contain only letters and spaces",
    }),
});

export const ServiceSchema = z.object({
  id: z.optional(z.string()),
  name: z.string().min(1, "Service name is required"),
  description: z.optional(
    z.string().max(500, "Description is too long").nullable()
  ),
  duration: z.number({ message: "Duration is required" }).int(),
  price: z.coerce
    .number({ message: "Price is required" })
    .nonnegative("Price cannot be negative")
    .refine((value) => {
      const decimalPlaces = value.toString().split(".")[1]?.length || 0;
      return decimalPlaces <= 2;
    }, "Price can have maximum 2 decimal places"),
  isActive: z.optional(z.boolean()).default(true),
  employeeIds: z
    .array(z.string())
    .refine(
      (value) => value.some((item) => item),
      "You have to select at least one employee"
    ),
});

export const AvailabilitySchema = z.object({
  availabilities: z.array(
    z
      .object({
        id: z.string(),
        dayOfWeek: z.enum([
          Day.MONDAY,
          Day.TUESDAY,
          Day.WEDNESDAY,
          Day.THURSDAY,
          Day.FRIDAY,
          Day.SATURDAY,
          Day.SUNDAY,
        ]),
        startTime: z
          .string()
          .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time (HH:mm)"),
        endTime: z
          .string()
          .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time (HH:mm)"),
        isActive: z.optional(z.boolean()).default(true),
      })

      .refine(
        ({ startTime, endTime }) => {
          const [startHour, startMinute] = startTime.split(":").map(Number);
          const [endHour, endMinute] = endTime.split(":").map(Number);
          return (
            endHour > startHour ||
            (endHour === startHour && endMinute > startMinute)
          );
        },
        {
          message: "End time must be later than start time",
          path: ["endTime"],
        }
      )
  ),
});

export const BusinessSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.optional(
    z.string().max(500, "Description is too long").nullable()
  ),
  email: z.string().email("Invalid email address"),
  phone: z.optional(
    z
      .string()
      .regex(/^$|^(\+30\s?)?((69\d{8})|(2\d{9}))$/, "Invalid phone number")
      .nullable()
  ),
  address: z.optional(z.string().max(200, "Address is too long").nullable()),
  logo: z.optional(z.string().nullable()),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(
      z.string().regex(/^$|^.{6,}$/, "Minimum of 6 characters required")
    ),
    newPassword: z.optional(
      z.string().regex(/^$|^.{6,}$/, "Minimum of 6 characters required")
    ),
    role: z.enum([UserRole.ADMIN, UserRole.BUSINESS_OWNER, UserRole.USER]),
    isTwoFactorEnabled: z.optional(z.boolean()),
    image: z.optional(z.string().nullable()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (!data.password && data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, "Minimum of 6 characters required"),
});

export const ResetSchema = z.object({
  email: z.string().email("Email is required"),
});

export const LoginSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(1, "Password is required"),
  code: z.optional(z.string()),
});

export const SignupSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(6, "Minimum of 6 characters required"),
  name: z.string().min(1, "Name is required"),
});
