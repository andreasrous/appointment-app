"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";

import { Employee } from "@prisma/client";
import { EmployeeSchema } from "@/schemas";
import { addEmployee, deleteEmployee } from "@/actions/employee";

import { Loader2, Trash2 } from "lucide-react";

import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface TeamFormProps {
  employees: Employee[] | null;
}

interface EmployeeItem {
  id: string;
  name: string;
}

export const TeamForm = ({ employees: initialEmployees }: TeamFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const form = useForm<z.infer<typeof EmployeeSchema>>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (initialEmployees?.length) {
      const mapped = initialEmployees.map((emp) => ({
        id: emp.id,
        name: emp.name,
      }));
      setEmployees(mapped);
    }
  }, [initialEmployees]);

  const handleAdd = (values: z.infer<typeof EmployeeSchema>) => {
    setIsAdding(true);

    startTransition(async () => {
      const data = await addEmployee(values);

      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        toast.success(data.success);
        setEmployees((prev) => [...prev, { id: data.id, name: data.name }]);
        form.reset();
      }

      setIsAdding(false);
    });
  };

  const handleDelete = async (
    id: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setDeletingId(id);

    startTransition(async () => {
      const data = await deleteEmployee(id);

      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        toast.success(data.success);
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      }

      setDeletingId(null);
    });
  };

  return (
    <div className="flex w-full h-full flex-1 items-center justify-center">
      <Card className="w-full max-w-lg min-h-[672px] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl">Manage Team</CardTitle>
          <CardDescription>
            Quickly add or remove employees from your business.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleAdd)}>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Type employee name..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  {isAdding && <Loader2 className="size-4 animate-spin" />}
                  Add
                </Button>
              </div>
              {employees.length > 0 ? (
                <ul className="space-y-3 overflow-y-auto">
                  {employees.map((employee) => (
                    <li
                      key={employee.id}
                      className="flex justify-between items-center border rounded-lg px-4 py-2 shadow-xs"
                    >
                      <span className="text-sm">{employee.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDelete(employee.id, e)}
                        disabled={deletingId === employee.id}
                      >
                        {deletingId === employee.id ? (
                          <Loader2 className="size-4 animate-spin text-muted-foreground" />
                        ) : (
                          <Trash2 className="size-4 text-destructive" />
                        )}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-[488px] flex items-center justify-center border dark:border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    No employees added yet.
                  </p>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
