import { useEffect, useState } from "react";
import { fetchCategoriesData, fetchUpdateCategoryData, fetchAddCategoryData } from "../api/productApi";
import { Pencil } from "lucide-react";

type Category = {
  id: number;
  name: string;
};

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null); // track for update
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetchCategoriesData();
      const values = res.data.$values || res.data || [];
      setCategories(values);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }
  
    try {
      if (categoryId) {
        // Update existing category
        await fetchUpdateCategoryData({ id: categoryId, name: categoryName });
        setSuccess("Category updated successfully!");
      } else {
        // Add new category
        await fetchAddCategoryData({ id: 0, name: categoryName }); // id is ignored on the server
        setSuccess("Category added successfully!");
      }
  
      setCategoryName("");
      setCategoryId(null);
      loadCategories();
    } catch (err) {
      console.error(err);
      setError("Failed to save category. Please try again.");
    }
  };
  

  const handleEdit = (category: Category) => {
    setCategoryName(category.name);
    setCategoryId(category.id);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {categoryId ? "Edit Category" : "Add New Category"}
        </h1>
        <p className="text-gray-600 mb-4">
          {categoryId
            ? "Update the selected category."
            : "Create a new product category to better organize your store’s catalog."}
        </p>

        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-500 mb-2">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="category-name"
              className="block text-sm font-medium text-gray-700"
            >
              Category Name
            </label>
            <input
              id="category-name"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Condiments"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            {categoryId ? "Update Category" : "Save Category"}
          </button>
        </form>
      </div>

      {/* Category List Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Existing Categories</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500 text-left uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">{cat.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{cat.name}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Category"
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-sm text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
