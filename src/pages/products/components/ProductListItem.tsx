import { Link } from "react-router-dom";
import { Edit, Trash, Package } from "lucide-react";

type ProductListItemProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    inventory: number;
    status: string;
    image: string;
  };
  onDelete: () => void;
};

const ProductListItem = ({ product, onDelete }: ProductListItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Package className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {product.name}
            </div>
            <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">
              {product.description}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.category}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          ${product.price.toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.inventory}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}
        >
          {product.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-3">
          <Link
            to={`/products/edit/${product.id}`}
            className="text-blue-600 hover:text-blue-900"
            aria-label="Edit product"
          >
            <Edit className="h-5 w-5" />
          </Link>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
            aria-label="Delete product"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductListItem;
