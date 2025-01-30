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

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddParentCategory = async () => {
    if (!parentCategory.trim()) {
      toast.error("Parent category cannot be empty");
      return;
    }

    try {
      await dispatch(addCategory(parentCategory)).unwrap();
      setParentCategory("");
      toast.success("Parent category added!");
      dispatch(fetchCategories());
    } catch (error) {
      toast.error("Error adding category.");
    }
  };

  const handleAddSubCategory = async () => {
    if (!selectedParent || !subCategory.trim()) {
      toast.error("Please select a parent and enter a subcategory name.");
      return;
    }

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
      toast.error("Error adding subcategory.");
    }
  };

  const handleDeleteParentCategory = async (category) => {
    try {
      await dispatch(deleteCategory(category)).unwrap();
      toast.success("Parent category deleted!");
      dispatch(fetchCategories());
    } catch (error) {
      toast.error("Error deleting category.");
    }
  };

  const handleDeleteSubCategory = async (parentName, subcategoryName) => {
    try {
      await dispatch(
        deleteSubcategory({ parentName, subcategoryName })
      ).unwrap();
      toast.success("Subcategory deleted!");
      dispatch(fetchCategories());
    } catch (error) {
      toast.error("Error deleting subcategory.");
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
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Parent Category"}
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
                {console.log(categories)}
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category.name}>
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
              disabled={!selectedParent || isLoading}
            >
              {isLoading ? "Adding..." : "Add Subcategory"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Display Categories List */}
      <Card className="max-w-[92.5vw] sm:max-w-full">
        <CardHeader className="font-semibold">Categories List</CardHeader>
        <CardContent>
          {categories.length === 0 ? (
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
                <TableBody>
                  {categories.map((parent, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold">
                        {parent.name}
                      </TableCell>
                      <TableCell>
                        {parent.subcategories?.map((sub, idx) => (
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
                              className="text-red-500 text-xs ml-2"
                            >
                              Delete
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
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;
