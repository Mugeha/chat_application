interface Props {
  message: string;
  fromSelf: boolean;
}

const MessageBubble = ({ message, fromSelf }: Props) => {
  return (
    <div
      className={`p-2 rounded-md max-w-sm break-words ${
        fromSelf ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
      }`}
    >
      {message}
    </div>
  );
};

export default MessageBubble;
