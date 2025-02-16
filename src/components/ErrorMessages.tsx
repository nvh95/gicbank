import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type MessageType = {
  id: string;
  text: string;
};

type ErrorMessagesProps = {
  messages: MessageType[];
};

export default function ErrorMessages({ messages }: ErrorMessagesProps) {
  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={clsx(
            "flex items-center px-4 py-3 rounded border",
            "bg-red-100 border-red-400 text-red-700"
          )}
        >
          <ExclamationCircleIcon className="h-5 w-5 mr-2" />
          <span>{message.text}</span>
        </div>
      ))}
    </div>
  );
}
