"use client";
import { handleError, httpDelete, httpGet, httpPut } from "@/utils/rest-client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Swal from "sweetalert2";

const breadcrumbItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Orders" },
];

const statusColors = {
  Pending: "bg-yellow-200 text-yellow-700",
  Processing: "bg-blue-200 text-blue-700",
  Shipped: "bg-green-200 text-green-700",
  Delivered: "bg-green-500 text-white",
  Completed: "bg-green-600 text-white",
  Cancelled: "bg-red-500 text-white",
  Refunded: "bg-red-300 text-red-700",
  Failed: "bg-red-600 text-white",
  "On Hold": "bg-orange-400 text-white",
  Backordered: "bg-yellow-400 text-yellow-700",
  Returned: "bg-purple-200 text-purple-700",
};

const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Completed",
  "Cancelled",
  "Refunded",
  "Failed",
  "On Hold",
  "Backordered",
  "Returned",
];

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pageCounts, setPageCounts] = useState(0);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const fetchOrders = useCallback(() => {
    httpGet("/api/orders", {
      params: {
        page,
        per_page: perPage,
        search,
      },
    })
      .then((res) => {
        setTotal(res.data.total);
        setPageCounts(res.data.page_counts);
        setOrders(res.data.data);
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
    fetchOrders();
  }, [page, perPage, search, router, fetchOrders]);

  const handleStatusChange = (orderId, newStatus) => {
    httpPut(`/api/orders/${orderId}`, { status: newStatus })
      .then(() => {
        fetchOrders();
      })
      .catch((err) => handleError(err, router));
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
            placeholder="Search orders..."
            className="p-2 border rounded-lg"
          />
        </div>
        {/* Create User Button */}
        {/* <Link href="/dashboard/orders/create">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Create Order
          </button>
        </Link> */}
      </div>
      {/* Total Rows Section */}
      <div className="my-4">
        <span className="text-gray-600 font-medium">Total Orders: </span>
        <span className="text-black font-bold">{total}</span>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className=" text-left">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Items</th>
            <th className="py-2 px-4 border-b">Total</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Note</th>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                <Link
                  className="text-blue-500 hover:underline"
                  href={`/dashboard/orders/${order.order_id}`}
                >
                  {order.order_id}
                </Link>
              </td>
              <td className="py-2 px-4 border-b">{order.item_counts}</td>
              <td className="py-2 px-4 border-b">{order.order_total}</td>
              <td className="py-2 px-4 border-b">{`${order.home_address}, ${order.street_address}, ${order.township}, ${order.ward}, ${order.city}, ${order.state}, ${order.postal_code}, ${order.country}`}</td>
              <td className="py-2 px-4 border-b">{order.note}</td>
              <td className="py-2 px-4 border-b">
                {moment(order.created_at + "Z").format("DD/MM/YYYY hh:mm:ss a")}
              </td>
              <td className="py-2 px-4 border-b">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.order_id, e.target.value)
                  }
                  className={`border rounded-lg p-1 ${
                    statusColors[order.status]
                  }`}
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
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
