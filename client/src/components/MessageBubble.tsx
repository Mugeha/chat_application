interface Props {
  message: string;
  fromSelf: boolean;
  avatar?: string;
  time?: string;
}

const MessageBubble = ({ message, fromSelf, avatar, time }: Props) => {
  return (
    <div className={`flex items-end ${fromSelf ? 'justify-end' : 'justify-start'}`}>
      {!fromSelf && avatar && (
        <img
          src={avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}
      <div>
        <div
          className={`p-2 rounded-lg max-w-xs break-words ${
            fromSelf ? 'bg-blue-100' : 'bg-gray-200'
          }`}
        >
          <p>{message}</p>
        </div>
        {time && (
          <span className="text-xs text-gray-500 mt-1 block text-right">
            {time}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
