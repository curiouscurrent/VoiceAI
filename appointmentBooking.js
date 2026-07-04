appointment_date = $input.first().json.body.args.appointment_date;
appointment_time = $input.first().json.body.args.appointment_time;
timeZone = $input.first().json.body.args.timeZone;

function convertToStartTime(appointment_date, appointment_time, timeZone) {
  const [year, month, day] = appointment_date.split("-").map(Number);
  const [hour, minute] = appointment_time.split(":").map(Number);

  // 1) Base UTC instant
  const baseUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0);

  // 2) Get local representation of that instant in the target timezone
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  const parts = fmt.formatToParts(new Date(baseUtcMs));
  const partsMap = Object.fromEntries(parts.map(p => [p.type, p.value]));

  const formattedYear = Number(partsMap.year);
  const formattedMonth = Number(partsMap.month);
  const formattedDay = Number(partsMap.day);
  const formattedHour = Number(partsMap.hour);
  const formattedMinute = Number(partsMap.minute);
  const formattedSecond = Number(partsMap.second);

  // 3) Compute timezone offset
  const formattedUtcMs = Date.UTC(
    formattedYear,
    formattedMonth - 1,
    formattedDay,
    formattedHour,
    formattedMinute,
    formattedSecond
  );
  const offsetMinutes = Math.round((formattedUtcMs - baseUtcMs) / 60000);

  // 4) Build offset string
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, "0");
  const offsetMins = String(absOffset % 60).padStart(2, "0");
  const offsetStr = `${sign}${offsetHours}:${offsetMins}`;

  // 5) Build final ISO string
  const pad = (n) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00${offsetStr}`;
}

return [{
  appointment_start: convertToStartTime(appointment_date, appointment_time, timeZone)
}];
