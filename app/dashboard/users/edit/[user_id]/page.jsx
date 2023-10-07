"use client";
import UserForm from "@/components/UserForm";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpGet, httpPut, uploadFile } from "@/utils/rest-client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { server_domain } from "@/constants";

export default function UserEditForm({ params }) {
  const [user, setUser] = useState({});
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Users", href: "/dashboard/users" },
    { label: params.user_id },
  ];
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("watchwonder_token");
    if (!token) {
      router.push("/login");
    }
    httpGet(`/api/users/${params.user_id}`)
      .then((res) => {
        if (res.data.data.profile_image) {
          res.data.data.profile_image = `${server_domain}${res.data.data.profile_image}`;
        }
        setUser(res.data.data);
      })
      .catch((err) => {
        handleError(err, router);
      });
  }, [router, params.user_id]);

  const updateUser = async (data) => {
    console.log(data);
    try {
      let res = null;
      if (data.file) {
        res = await uploadFile("/api/image/upload", data.file);
        data.profile_image = res.data.url;
      }

      delete data.file;
      if (data.profile_image) {
        data.profile_image = data.profile_image.replace(server_domain, "");
      }
      res = await httpPut(`/api/users/${params.user_id}`, data);
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
      {Object.keys(user).length ? (
        <UserForm
          onSubmit={updateUser}
          onBackClick={handleBackClick}
          user={{ ...user }}
          disabledUsername={true}
        />
      ) : null}
    </div>
  );
}
