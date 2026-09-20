import { Calendar, Check, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MdWallet } from "react-icons/md";

interface PendingProps {
  message?: string;
}

export function ConfirmComponent({ message }: PendingProps) {
  return (
    <Card className="w-full max-w-sm bg-emerald-200">
      <CardContent className="flex items-center p-6">
        <div className="flex items-center justify-center bg-black rounded-full mr-4">
          <Check className=" h-6 w-6 text-white" />
        </div>
        <span className="text-lg font-medium">{message}</span>
      </CardContent>
    </Card>
  );
}

export function PendingComponent({ message }: PendingProps) {
  return (
    <Card className="w-full max-w-sm bg-emerald-200">
      <CardContent className="flex items-center p-6">
        <div className="flex items-center justify-center bg-black rounded-full mr-4">
          <Clock className=" h-6 w-6 text-white" />
        </div>
        <span className="text-lg font-medium text-black">{message}</span>
      </CardContent>
    </Card>
  );
}

export function EventScheduledComponent() {
  return (
    <Card className="w-full max-w-sm bg-emerald-200">
      <CardContent className="flex items-center p-6">
        <div className="flex items-center justify-center bg-black rounded-full mr-4">
          <Calendar className=" h-6 w-6 text-white rounded-[50%] p-1 bg-black" />
        </div>
        <span className="text-lg font-medium text-black">Event Scheduled</span>
      </CardContent>
    </Card>
  );
}

interface Event {
  id: string;
  summary: string;
  htmlLink: string;
  start: string;
  end: string;
}

export const EventList: React.FC<{ events: Event[] }> = ({ events }) => {
  if (!events || events.length === 0) {
    return <p className="text-gray-500">No events found.</p>;
  }

  return (
    <div className="ml-3 space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center border border-gray-200"
        >
          {/* Left Side: Event Name + Link */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {event.summary}
            </h3>
            <a
              href={event.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 text-sm hover:underline"
            >
              View on Google Calendar
            </a>
          </div>

          {/* Right Side: Start & End Time */}
          <div className="text-right text-sm text-gray-600">
            <p>
              <strong>Start:</strong> {new Date(event.start).toLocaleString()}
            </p>
            <p>
              <strong>End:</strong> {new Date(event.end).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
