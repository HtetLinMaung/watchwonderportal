"use client";
import UserForm from "@/components/UserForm";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpPost, uploadFile } from "@/utils/rest-client";
import { useEffect } from "react";
import Swal from "sweetalert2";

const breadcrumbItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Users", href: "/dashboard/users" },
  { label: "User Form" },
];

export default function UserCreateForm() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("watchwonder_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const createUser = async (data) => {
    console.log(data);
    try {
      let res = null;
      if (data.file) {
        res = await uploadFile("/api/image/upload", data.file);
        data.profile_image = res.data.url;
      }

      delete data.file;
      res = await httpPost("/api/users", data);
      Swal.fire({
        icon: "success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      router.push("/dashboard/users");
    } catch (err) {
      handleError(err, router);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-4">
      <Breadcrumb items={breadcrumbItems} />
      <UserForm onSubmit={createUser} onBackClick={handleBackClick} />
    </div>
  );
}
