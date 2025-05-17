import { Link } from "react-router-dom";
import { Edit, Trash, Package } from "lucide-react";

type ProductListItemProps = {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
    unit: string; // ← Add this line
  };
  onDelete: () => void;
  categoryNames: string[];
};

const ProductListItem = ({ product, onDelete }: ProductListItemProps) => {
  const imageUrl = product.image
    ? `https://wyzlpxshonuzitdcgdoe.supabase.co/storage/v1/object/public/product-images/${product.image.replace(
        /^product-images\//,
        ""
      )}`
    : null;

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden bg-gray-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="lazy"
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
          ₱{product.price.toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.stock}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.unit}</div>
      </td>
      {/* Removed status column */}
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
