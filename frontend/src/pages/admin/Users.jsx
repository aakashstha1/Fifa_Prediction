import Loader from "@/components/common/Loader";
import { Card } from "@/components/ui/card";
import { useGetUsers } from "@/hooks/users/useGetUsers";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

function Users() {
  const { data, isLoading, error } = useGetUsers();

  const users = data || [];

  // ---------------- Columns ----------------
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => (
        <span className="font-medium">{info.getValue() ?? "—"}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue() ?? "—",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (info) => {
        const role = info.getValue();
        if (!role) return "—";
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              role === "admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {role}
          </span>
        );
      },
    },
    {
      accessorKey: "correctPredictions",
      header: "Correct",
      cell: (info) => (
        <span className="text-green-600 font-semibold">
          {info.getValue() ?? 0}
        </span>
      ),
    },
    {
      accessorKey: "wrongPredictions",
      header: "Wrong",
      cell: (info) => (
        <span className="text-red-600 font-semibold">
          {info.getValue() ?? 0}
        </span>
      ),
    },
  ];

  // ---------------- Table instance ----------------
  const table = useReactTable({
    data: users,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  // ---------------- States ----------------
  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-2">
            Failed to load users
          </p>
          <p className="text-gray-400 text-sm">
            {error?.message ||
              "An unexpected error occurred. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 ">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <Card
        className="p-4 overflow-x-auto max-w-7xl mx-auto"
        role="region"
        aria-label="Users table"
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left p-3 text-gray-600 font-semibold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-8 text-center text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 text-gray-700">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default Users;
