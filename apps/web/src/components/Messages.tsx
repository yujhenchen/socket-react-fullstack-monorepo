interface EventsProps {
  events: string[];
}

export function Messages({ events }: EventsProps) {
  return (
    <ul>
      {events.map((event, index) => (
        <li key={index}>{event}</li>
      ))}
    </ul>
  );
}
