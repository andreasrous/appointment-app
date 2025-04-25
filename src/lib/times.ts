export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  interval: number
): { id: number; time: string }[] => {
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const toTimeString = (minutes: number) => {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const result: { id: number; time: string }[] = [];
  let id = 0;
  let current = toMinutes(startTime);
  const end = toMinutes(endTime);

  while (current <= end) {
    result.push({ id: id++, time: toTimeString(current) });
    current += interval;
  }

  return result;
};
