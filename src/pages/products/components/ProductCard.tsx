import React from "react";
import { Link } from "react-router-dom";
import { Edit, Trash, Package } from "lucide-react";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image: string;
  };
  onDelete: () => void;
  categoryNames: string[];
};

const ProductCard = React.memo(({ product, onDelete }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        {product.image ? (
          <img
            src={`https://wyzlpxshonuzitdcgdoe.supabase.co/storage/v1/object/public/product-images//${product.image.replace(/^product-images\//, '')}`}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {/* Removed status badge */}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </h3>
            <p className={`text-sm mb-1 ${product.category ? 'text-gray-500' : 'text-red-500'}`}>
              {product.category || "Uncategorized"}
            </p>
          </div>
          <p className="text-lg font-bold text-blue-600">
            ₱{product.price.toFixed(2)}
          </p>
        </div>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{product.stock}</span> in stock
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
}, areEqual);

// Updated equality check to remove status from comparison
function areEqual(prevProps: ProductCardProps, nextProps: ProductCardProps) {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.name === nextProps.product.name &&
    prevProps.product.image === nextProps.product.image &&
    prevProps.product.stock === nextProps.product.stock
  );
}

export default ProductCard;
