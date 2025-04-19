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

export default function Calendar() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const eventModal = createEventModalPlugin();
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const calendar = useNextCalendarApp({
    views: [viewDay, viewWeek, viewMonthGrid, viewMonthAgenda],
    defaultView: viewWeek.name,
    events: [
      {
        id: 1,
        title: "Coffee with John",
        start: "2025-05-01",
        end: "2025-05-01",
      },
      {
        id: 2,
        title: "Breakfast with Sam",
        description: "Discuss the new project",
        location: "Starbucks",
        start: "2025-04-29 05:00",
        end: "2025-04-29 06:00",
      },
      {
        id: 3,
        title: "Gym",
        start: "2025-04-27 06:00",
        end: "2025-04-27 07:00",
      },
      {
        id: 4,
        title: "Media fasting",
        start: "2025-05-01",
        end: "2025-05-03",
      },
      {
        id: 5,
        title: "Some appointment",
        people: ["John"],
        start: "2025-05-03 03:00",
        end: "2025-05-03 04:30",
      },
      {
        id: 6,
        title: "Other appointment",
        people: ["Susan", "Mike"],
        start: "2025-05-03 03:00",
        end: "2025-05-03 04:00",
      },
    ],
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
