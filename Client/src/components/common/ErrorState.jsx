const ErrorState = ({ message = "Something went wrong." }) => {
  return (
    <div className="rounded-3xl bg-red-50 border border-red-200 px-6 py-8 text-center">
      <h3 className="text-xl font-bold text-red-700">Error</h3>

      <p className="mt-3 text-red-600">{message}</p>
    </div>
  );
};

export default ErrorState;