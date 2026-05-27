const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="text-center py-10">
      <div className="mx-auto h-10 w-10 rounded-full border-4 border-rose-100 border-t-rose-700 animate-spin" />

      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;