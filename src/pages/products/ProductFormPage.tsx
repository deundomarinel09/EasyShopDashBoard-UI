import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import CreatableSelect from "react-select/creatable";

import {
  fetchListProductByIdData,
  fetchCategoriesData,
  fetchUpdateProductData,
  fetchAddProductData,
  fetchUnitsData,
} from "../api/productApi";

const uomOptions = [
  "kg",
  "g",
  "mg",
  "lb",
  "oz",
  "L",
  "mL",
  "gal",
  "fl oz",
  "pc",
  "dozen",
  "pack",
];

type Attribute = {
  name: string;
  value: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  weight: number;
  uom: string;
  image: string;
  attributes: Attribute[];
  stock: number;
  unit: string;
};

type Categories = {
  id: number;
  name: string;
};
type Units = {
  id: number;
  name: string;
};

type CategoryResponse = {
  $values: Categories[];
};

type UnitsResponse = {
  $values: Units[];
};

const ProductFormPage = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const navigate = useNavigate();
  const [productData, setProduct] = useState<Product | null>(null);
  const [CategoriesData, setCategories] = useState<Categories[] | null>(null);
  const [UnitsData, setUnits] = useState<Units[] | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && numericId) {
      const loadProducts = async () => {
        try {
          const response = await fetchListProductByIdData(numericId);
          const fetchedProduct = response.data || null;
          setProduct(fetchedProduct);

          // Populate form here directly
          if (fetchedProduct) {
            setFormData({
              name: fetchedProduct.name,
              description: fetchedProduct.description,
              price: fetchedProduct.price.toString(),
              category: fetchedProduct.category || "",
              inventory: fetchedProduct.stock.toString(),
              unit: fetchedProduct.unit || "",
              weight: fetchedProduct.weight || "",
              uom: fetchedProduct.uom || "",
              image: fetchedProduct.image || "",
            });
          }
        } catch (error: any) {
          alert(`Error fetching product: ${error.message}`);
        }
      };

      loadProducts();
    }
  }, [isEditMode, numericId]);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const response = await fetchUnitsData();
        const fetchedUnits = (response.data as UnitsResponse)?.$values || [];
        setUnits(fetchedUnits);
      } catch (error: any) {
        alert(`Error fetching units: ${error.message}`);
      }
    };

    loadUnits();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategoriesData(); // Corrected
        const fetchedCategories =
          (response.data as CategoryResponse)?.$values || [];
        setCategories(fetchedCategories);
      } catch (error: any) {
        alert(`Error fetching categories: ${error.message}`);
      }
    };

    loadCategories();
  }, []);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  // Load product data if in edit mode
  useEffect(() => {
    if (isEditMode && productData) {
      setFormData({
        name: productData.name,
        description: productData.description,
        price: productData?.price?.toString(),
        category: productData.category || "",
        inventory: productData?.stock?.toString(),
        unit: productData.unit || "",
        weight: productData?.weight?.toString(),
        uom: productData?.uom || "",
        image: productData.image || "",
      });
    }
  }, [numericId, isEditMode, productData]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inventory: "",
    unit: "",
    weight: "",
    uom: "",
    image: "",
  });
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) < 0
    ) {
      newErrors.price =
        "Price must be a valid number greater than or equal to 0";
    }

    if (!formData.inventory.trim()) {
      newErrors.inventory = "Inventory quantity is required";
    } else if (
      isNaN(parseInt(formData.inventory)) ||
      parseInt(formData.inventory) < 0
    ) {
      newErrors.inventory =
        "Inventory must be a valid number greater than or equal to 0";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.unit.trim()) {
      newErrors.unit = "Unit of Measurement is required";
    }

    // NEW: Image required if adding product (not editing)
    if (!isEditMode && !imageFile) {
      newErrors.image = "Product image is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      if (isEditMode) {
        await handleUpdateProduct(); // Save product
      } else {
        await handleAddProduct();
        // await fetchCreateProductData(newProduct);
      }
      navigate("/products");
    } catch (error: any) {
      alert("Error saving product: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.name.trim());
      form.append("description", formData.description.trim());
      form.append("price", formData.price);
      form.append("stock", formData.inventory);
      form.append("unit", formData.unit);
      form.append("category", formData.category);
      form.append("weight", formData.weight.trim());
      form.append("uom", formData.uom);
      form.append("createDate", new Date().toISOString());
      form.append("image", formData.name.trim().replace(/\s+/g, ""));

      if (imageFile) {
        form.append("imageFile", imageFile);
      }
      const response = await fetchAddProductData(form);
      alert("Product added successfully!");
    } catch (error: any) {
      alert("Error adding product: " + error.message);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const form = new FormData();
      form.append("id", numericId.toString());
      form.append("name", formData.name.trim());
      form.append("description", formData.description.trim());
      form.append("price", formData.price);
      form.append("stock", formData.inventory);
      form.append("unit", formData.unit);
      form.append("category", formData.category);
      form.append("weight", formData.weight.trim());
      form.append("uom", formData.uom);
      form.append("createDate", new Date().toISOString());
      form.append("image", formData.name.trim().replace(/\s+/g, ""));

      if (imageFile) {
        form.append("imageFile", imageFile);
      }

      const response = await fetchUpdateProductData(form);

      alert("Product updated successfully!");
    } catch (error: any) {
      alert("Error updating product: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/products")}
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-gray-500">
              {isEditMode
                ? "Update product information"
                : "Create a new product in your catalog"}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/products"
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="product-form"
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSaving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Product
              </>
            )}
          </button>
        </div>
      </div>

      <form
        id="product-form"
        onSubmit={handleSubmit}
        className="space-y-8"
        encType="multipart/form-data"
      >
        <div className="bg-slate-200 shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.name
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Image<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
                {/* Image Preview */}
                {(imageFile || formData.image) && (
                  <img
                    src={
                      imageFile
                        ? URL.createObjectURL(imageFile) // If new image is uploaded
                        : `https://wyzlpxshonuzitdcgdoe.supabase.co/storage/v1/object/public/product-images//${formData.image.replace(
                            /^product-images\//,
                            ""
                          )}` // If image is fetched from the existing product
                    }
                    alt="Product Preview"
                    className="mt-2 h-40 object-contain border rounded"
                  />
                )}
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price (₱) <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₱</span>
                  </div>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`block w-full pl-7 pr-12 rounded-md ${
                      errors.price
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="inventory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="inventory"
                  id="inventory"
                  min="0"
                  value={formData.inventory}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.inventory
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
                {errors.inventory && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.inventory}
                  </p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Unit of Measurement <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  id="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.unit
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                >
                  <option value="">-- Select Unit --</option>
                  {UnitsData?.map((unit) => (
                    <option key={unit.id} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
                )}
              </div>
<div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:col-span-3">
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700"
                >
                  Weight <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm"></span>
                  </div>
                  <input
                    type="text"
                    name="weight"
                    id="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className={`block w-full pl-7 pr-12 rounded-md ${
                      errors.price
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="uom"
                  className="block text-sm font-medium text-gray-700"
                >
                  Weight UOM <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    name="uom"
                    id="uom"
                    value={formData.uom}
                    onChange={handleChange}
                    className={`block w-full pl-3 pr-12 rounded-md ${
                      errors.uom
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  >
                    <option value="" disabled>
                      Select unit
                    </option>
                    {uomOptions.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.uom && (
                  <p className="mt-1 text-sm text-red-600">{errors.uom}</p>
                )}
              </div>
</div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <CreatableSelect
                  name="category"
                  id="category"
                  value={
                    formData.category
                      ? { label: formData.category, value: formData.category }
                      : null
                  }
                  onChange={(selectedOption) => {
                    handleChange({
                      target: {
                        name: "category",
                        value: selectedOption?.value ?? "",
                      },
                    } as React.ChangeEvent<HTMLSelectElement>);
                  }}
                  options={CategoriesData?.map((category) => ({
                    label: category.name.toUpperCase(),
                    value: category.name.toUpperCase(),
                  }))}
                  classNamePrefix="react-select"
                  className={`mt-1`}
                  isClearable
                  placeholder="Select or type a category"
                  menuPortalTarget={document.body}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: errors.category ? "#f87171" : "#d1d5db", // Tailwind red-400 or gray-300
                      boxShadow: state.isFocused
                        ? errors.category
                          ? "0 0 0 1px #ef4444" // red-500 focus ring
                          : "0 0 0 1px #3b82f6" // blue-500 focus ring
                        : null,
                      "&:hover": {
                        borderColor: state.isFocused
                          ? errors.category
                            ? "#ef4444"
                            : "#3b82f6"
                          : base.borderColor,
                      },
                      borderRadius: "0.375rem", // rounded-md
                    }),
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
