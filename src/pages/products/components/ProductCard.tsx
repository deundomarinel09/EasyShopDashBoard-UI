import { Link } from "react-router-dom";
import { Edit, Trash, Package } from "lucide-react";

type ProductCardProps = {
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

const ProductCard = ({ product, onDelete }: ProductCardProps) => {
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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}
          >
            {product.status}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          </div>
          <p className="text-lg font-bold text-blue-600">
            ${product.price.toFixed(2)}
          </p>
        </div>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{product.inventory}</span> in stock
          </p>
          <div className="flex space-x-2">
            <Link
              to={`/products/edit/${product.id}`}
              className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-150"
              aria-label="Edit product"
            >
              <Edit className="h-5 w-5" />
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors duration-150"
              aria-label="Delete product"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
