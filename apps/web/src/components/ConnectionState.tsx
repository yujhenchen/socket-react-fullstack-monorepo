interface ConnectionStateProps {
  isConnected: boolean;
}

export function ConnectionState({ isConnected }: ConnectionStateProps) {
  return (
    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      Is Connected:{" "}
      <span className="font-normal text-gray-700 dark:text-gray-400 whitespace-pre">
        {isConnected.toString()}
      </span>
    </h5>
  );
}
