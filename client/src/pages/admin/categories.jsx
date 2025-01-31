import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addCategory,
  addSubcategory,
  deleteCategory,
  deleteSubcategory,
  fetchCategories,
} from "@/store/admin/category-slice";

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { categories, isLoading } = useSelector(
    (state) => state.adminCategories
  );

  const [parentCategory, setParentCategory] = useState("");
  const [selectedParent, setSelectedParent] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [loadingActions, setLoadingActions] = useState({
    parent: false,
    subcategory: false,
    deleteParent: null,
    deleteSubcategory: null,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddParentCategory = async () => {
    if (!parentCategory.trim()) {
      toast.error("Parent category cannot be empty");
      return;
    }
    setLoadingActions((prevState) => ({ ...prevState, parent: true }));
    try {
      await dispatch(addCategory(parentCategory)).unwrap();
      setParentCategory("");
      toast.success("Parent category added!");
    } catch (error) {
      toast.error("Category already exists or an error occurred.");
    } finally {
      setLoadingActions((prevState) => ({ ...prevState, parent: false }));
    }
  };

  const handleAddSubCategory = async () => {
    if (!selectedParent || !subCategory.trim()) {
      toast.error("Please select a parent and enter a subcategory name.");
      return;
    }
    setLoadingActions((prevState) => ({ ...prevState, subcategory: true }));
    try {
      await dispatch(
        addSubcategory({
          parentName: selectedParent,
          subcategoryName: subCategory,
        })
      ).unwrap();
      setSubCategory("");
      toast.success("Subcategory added!");
      dispatch(fetchCategories());
    } catch (error) {
      toast.error("Subcategory already exists or an error occurred.");
    } finally {
      setLoadingActions((prevState) => ({ ...prevState, subcategory: false }));
    }
  };

  const handleDeleteParentCategory = async (category) => {
    setLoadingActions((prevState) => ({
      ...prevState,
      deleteParent: category,
    }));
    try {
      await dispatch(deleteCategory(category)).unwrap();
      toast.success("Parent category deleted!");
    } catch (error) {
      toast.error("Error deleting category.");
    } finally {
      setLoadingActions((prevState) => ({
        ...prevState,
        deleteParent: null,
      }));
    }
  };

  const handleDeleteSubCategory = async (parentName, subcategoryName) => {
    setLoadingActions((prevState) => ({
      ...prevState,
      deleteSubcategory: subcategoryName,
    }));
    try {
      await dispatch(
        deleteSubcategory({ parentName, subcategoryName })
      ).unwrap();
      toast.success("Subcategory deleted!");
    } catch (error) {
      toast.error("Error deleting subcategory.");
    } finally {
      setLoadingActions((prevState) => ({
        ...prevState,
        deleteSubcategory: null,
      }));
    }
  };

  return (
    <div className="sm:p-2 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Product Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Parent Category Input */}
        <Card className="mb-4">
          <CardHeader className="font-semibold">Add Parent Category</CardHeader>
          <CardContent>
            <Input
              type="text"
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              placeholder="Enter parent category"
              className="mb-2"
            />
            <Button
              onClick={handleAddParentCategory}
              className="w-full"
              disabled={loadingActions.parent}
              aria-label="Add Parent Category"
            >
              {loadingActions.parent ? "Adding..." : "Add Parent Category"}
            </Button>
          </CardContent>
        </Card>

        {/* Subcategory Input */}
        <Card className="mb-4">
          <CardHeader className="font-semibold">Add Subcategory</CardHeader>
          <CardContent>
            <Select value={selectedParent} onValueChange={setSelectedParent}>
              <SelectTrigger>
                <SelectValue placeholder="Select Parent Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder="Enter subcategory"
              className="mt-2"
            />
            <Button
              onClick={handleAddSubCategory}
              className="mt-2 w-full"
              disabled={
                !selectedParent ||
                !subCategory.trim() ||
                loadingActions.subcategory
              }
              aria-label="Add Subcategory"
            >
              {loadingActions.subcategory ? "Adding..." : "Add Subcategory"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Display Categories List */}
      <Card className="max-w-[92.5vw] sm:max-w-full">
        <CardHeader className="font-semibold">Categories List</CardHeader>
        <CardContent>
          {categories.length === 0 && isLoading ? (
            <p>Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">No categories added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Parent Category</TableHead>
                    <TableHead className="w-1/3">Subcategories</TableHead>
                    <TableHead className="text-center w-1/3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                {Array.isArray(categories) && categories.length > 0 ? (
                  <TableBody>
                    {categories.map((parent) => (
                      <TableRow key={parent.name}>
                        <TableCell className="font-semibold">
                          {parent.name}
                        </TableCell>
                        <TableCell>
                          {Array.isArray(parent.subcategories) &&
                            parent.subcategories.map((sub, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center"
                              >
                                {sub}
                                <Button
                                  onClick={() =>
                                    handleDeleteSubCategory(parent.name, sub)
                                  }
                                  variant="ghost"
                                  className="text-red-500 text-sm sm:text-xs ml-2"
                                  disabled={
                                    loadingActions.deleteSubcategory === sub
                                  }
                                >
                                  {loadingActions.deleteSubcategory === sub
                                    ? "Deleting..."
                                    : "Delete"}
                                </Button>
                              </div>
                            ))}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            onClick={() =>
                              handleDeleteParentCategory(parent.name)
                            }
                            variant="ghost"
                            className="text-red-500"
                            disabled={
                              loadingActions.deleteParent === parent.name
                            }
                          >
                            {loadingActions.deleteParent === parent.name
                              ? "Deleting..."
                              : "Delete"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                ) : (
                  <p className="text-gray-500">No categories added yet.</p>
                )}
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;
