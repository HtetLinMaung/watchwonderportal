// components/Breadcrumb.js
function Breadcrumb({ items }) {
  return (
    <nav className="text-gray-500 text-sm mb-6">
      {items.map((item, index) => (
        <span key={item.label}>
          {index > 0 && " > "}
          {item.href ? (
            <a href={item.href} className="text-blue-500 hover:underline">
              {item.label}
            </a>
          ) : (
            item.label
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumb;
