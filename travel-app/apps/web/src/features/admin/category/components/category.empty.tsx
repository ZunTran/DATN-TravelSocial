export function CategoryEmpty() {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed">
      <div className="text-center">
        <p className="font-medium">
          No categories found
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Try another search or create a new category.
        </p>
      </div>
    </div>
  );
}