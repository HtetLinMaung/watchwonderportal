"use client";
import { handleError, httpDelete, httpGet } from "@/utils/rest-client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Swal from "sweetalert2";

const breadcrumbItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Users" },
];

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pageCounts, setPageCounts] = useState(0);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const fetchUsers = useCallback(() => {
    httpGet("/api/users", {
      params: {
        page,
        per_page: perPage,
        search,
      },
    })
      .then((res) => {
        setTotal(res.data.total);
        setPageCounts(res.data.page_counts);
        setUsers(res.data.data);
      })
      .catch((err) => {
        handleError(err, router);
      });
  }, [page, perPage, router, search]);

  useEffect(() => {
    const token = localStorage.getItem("watchwonder_token");
    if (!token) {
      router.push("/login");
    }
    fetchUsers();
  }, [page, perPage, search, router, fetchUsers]);

  const handleDelete = (user_id) => {
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        httpDelete(`/api/users/${user_id}`)
          .then((res) => {
            Swal.fire({
              text: res.data.message,
              icon: "success",
              showConfirmButton: false,
              timer: 5000,
            });
            fetchUsers();
          })
          .catch((err) => {
            handleError(err, router);
          });
      }
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb items={breadcrumbItems} />
      {/* Search Box */}
      <div className="flex mb-4 justify-between">
        <div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search users..."
            className="p-2 border rounded-lg"
          />
        </div>
        {/* Create User Button */}
        <Link href="/dashboard/users/create">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Create User
          </button>
        </Link>
      </div>
      {/* Total Rows Section */}
      <div className="my-4">
        <span className="text-gray-600 font-medium">Total Users: </span>
        <span className="text-black font-bold">{total}</span>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className=" text-left">
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.phone}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                {moment(user.created_at + "Z").format("DD/MM/YYYY hh:mm:ss a")}
              </td>
              <td className="py-2 px-4 border-b">
                <Link
                  className="text-blue-500 hover:underline"
                  href={`/dashboard/users/edit/${user.user_id}`}
                >
                  Edit
                </Link>
                {/* Add delete functionality */}
                <button
                  className="ml-2 text-red-500 hover:underline"
                  onClick={() => handleDelete(user.user_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <Pagination
        page={page}
        pageCounts={pageCounts}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
      />
    </div>
  );
}
