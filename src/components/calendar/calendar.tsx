"use client";

import { useNextCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  viewDay,
  viewMonthAgenda,
  viewMonthGrid,
  viewWeek,
} from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createEventsServicePlugin } from "@schedule-x/events-service";

import "@schedule-x/theme-default/dist/index.css";
import "@/styles/schedule-x-theme.css";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

type CalendarProps = {
  initialEvents: {
    id: string | number;
    title: string;
    description: string | undefined;
    location: string | undefined;
    start: string;
    end: string;
  }[];
};

export default function Calendar({ initialEvents }: CalendarProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const eventModal = createEventModalPlugin();
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const calendar = useNextCalendarApp({
    views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
    defaultView: viewWeek.name,
    events: initialEvents,
    plugins: [eventsService, eventModal],
    callbacks: {
      onRender: () => {
        eventsService.getAll();
      },
    },
    isDark,
  });

  useEffect(() => {
    calendar?.setTheme(resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme, calendar]);

  return (
    <div className="h-full">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}
