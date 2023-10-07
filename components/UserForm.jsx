import { useState } from "react";

function UserForm({ user = {}, onSubmit, onBackClick, disabledUsername }) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "user",
    password: user.password || "",
    profile_image: user.profile_image || "",
    file: null,
  });

  const [avatar, setAvatar] = useState(user.profile_image || "/avatar.jpeg");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setFormData((prevData) => ({
          ...prevData,
          profile_image: reader.result,
          file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full mx-auto mt-5 p-6 bg-white shadow-md rounded-lg">
      {/* <h2 className="text-2xl mb-6 text-center">User Form</h2> */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-6">
          <div className="relative">
            <img
              src={avatar}
              alt="Profile Avatar"
              className="h-24 w-24 rounded-full"
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 w-8 h-8 flex justify-center items-center">
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
              <svg
                style={{ width: "1rem" }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.952 3.04794C20.281 2.37696 19.3709 2 18.422 2C17.4731 2 16.563 2.37696 15.892 3.04794L3.94 14.9999C3.53379 15.4062 3.2482 15.9171 3.115 16.4759L2.02 21.0779C1.99035 21.2026 1.99313 21.3328 2.02807 21.456C2.06301 21.5793 2.12896 21.6916 2.21961 21.7821C2.31025 21.8727 2.42259 21.9385 2.5459 21.9733C2.66921 22.0081 2.79938 22.0107 2.924 21.9809L7.525 20.8849C8.08418 20.7519 8.59548 20.4663 9.002 20.0599L20.952 8.10994C21.623 7.43894 21.9999 6.52887 21.9999 5.57994C21.9999 4.63101 21.623 3.72095 20.952 3.04994V3.04794ZM16.952 4.10794C17.145 3.9149 17.3742 3.76177 17.6264 3.6573C17.8787 3.55282 18.149 3.49905 18.422 3.49905C18.695 3.49905 18.9653 3.55282 19.2176 3.6573C19.4698 3.76177 19.699 3.9149 19.892 4.10794C20.085 4.30099 20.2382 4.53016 20.3426 4.78239C20.4471 5.03461 20.5009 5.30494 20.5009 5.57794C20.5009 5.85095 20.4471 6.12128 20.3426 6.3735C20.2382 6.62572 20.085 6.8549 19.892 7.04794L19 7.93894L16.06 4.99994L16.952 4.10894V4.10794ZM15 6.06194L17.94 8.99994L7.94 18.9999C7.73 19.2099 7.466 19.3569 7.177 19.4259L3.761 20.2399L4.574 16.8239C4.643 16.5339 4.791 16.2699 5.001 16.0599L15 6.05994V6.06194Z"
                  fill="white"
                />
              </svg>
            </label>
          </div>
        </div>
        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="w-full p-2 border rounded-lg"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="w-full p-2 border rounded-lg"
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={disabledUsername}
              required
            />
          </div>
        </div>
        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full p-2 border rounded-lg"
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full p-2 border rounded-lg"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              className="w-full p-2 border rounded-lg"
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={(e) => {
              e.preventDefault();
              onBackClick(e);
            }}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 mr-2"
          >
            Back
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {user.user_id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
