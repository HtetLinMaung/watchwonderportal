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
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Items" },
];

export default function OrderItemsList({ params }) {
  const order_id = params.order_id;
  const [orderItems, setOrderItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [pageCounts, setPageCounts] = useState(0);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const fetchOrderItems = useCallback(() => {
    httpGet("/api/order-items", {
      params: {
        page,
        per_page: perPage,
        search,
        order_id,
      },
    })
      .then((res) => {
        setTotal(res.data.total);
        setPageCounts(res.data.page_counts);
        setOrderItems(res.data.data);
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
    fetchOrderItems();
  }, [page, perPage, search, router, fetchOrderItems]);

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
            placeholder="Search items..."
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
        <span className="text-gray-600 font-medium">Total Items: </span>
        <span className="text-black font-bold">{total}</span>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className=" text-left">
            <th className="py-2 px-4 border-b">Brand</th>
            <th className="py-2 px-4 border-b">Model</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Time</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((orderItem) => (
            <tr key={orderItem.order_item_id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{orderItem.brand}</td>
              <td className="py-2 px-4 border-b">{orderItem.model}</td>
              <td className="py-2 px-4 border-b">{orderItem.quantity}</td>
              <td className="py-2 px-4 border-b">{orderItem.price}</td>
              <td className="py-2 px-4 border-b">{orderItem.amount}</td>
              <td className="py-2 px-4 border-b">
                {moment(orderItem.created_at + "Z").format(
                  "DD/MM/YYYY hh:mm:ss a"
                )}
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
