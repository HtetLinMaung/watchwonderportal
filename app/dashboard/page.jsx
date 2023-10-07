import Breadcrumb from "@/components/Breadcrumb";

const breadcrumbItems = [{ label: "Home" }];

export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
}
