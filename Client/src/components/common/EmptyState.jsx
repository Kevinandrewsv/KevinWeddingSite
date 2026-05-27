const EmptyState = ({
  title = "No data found",
  message = "There is nothing to show right now.",
}) => {
  return (
    <div className="rounded-3xl bg-white border border-rose-100 shadow-sm p-10 text-center">
      <h3 className="text-2xl font-semibold text-rose-800">{title}</h3>

      <p className="mt-3 text-gray-600">{message}</p>
    </div>
  );
};

export default EmptyState;