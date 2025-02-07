import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { fetchColors } from "@/store/admin/color-slice";
import { fetchCategories } from "@/store/admin/category-slice";

const ProductForm = ({
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) => {
  const dispatch = useDispatch();
  const { colors } = useSelector((state) => state.adminColors);
  const { categories } = useSelector((state) => state.adminCategories);

  useEffect(() => {
    dispatch(fetchColors());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "salePrice", "totalStock"].includes(name)
        ? Number(value) || ""
        : value,
    }));
  };

  const handleColorChange = (checked, colorValue) => {
    setFormData((prev) => ({
      ...prev,
      colors: checked
        ? [...prev.colors, colorValue]
        : prev.colors.filter((c) => c !== colorValue),
    }));
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
      >
        <div className="my-4">
          <Label>Title</Label>
          <Input
            name="title"
            type="text"
            placeholder="Enter product title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div className="my-4">
          <Label>Description</Label>
          <Textarea
            name="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="my-4">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="my-4">
          <Label>Subcategory</Label>
          <Select
            value={formData.subcategory}
            onValueChange={(value) => handleChange("subcategory", value)}
            disabled={!formData.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a subcategory" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .find((category) => category.name === formData.category)
                ?.subcategories.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="my-4">
          <Label>Color</Label>
          {colors.map((color) => (
            <div key={color._id} className="flex items-center gap-2">
              <Checkbox
                checked={formData.colors.includes(color._id)}
                onCheckedChange={(checked) =>
                  handleColorChange(checked, color._id)
                }
              />
              <span>{color.name}</span>
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: color.value }}
              />
            </div>
          ))}
        </div>

        <div className="my-4">
          <Label>Price</Label>
          <Input
            name="price"
            type="tel"
            placeholder="Enter product price"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
        </div>

        <div className="my-4">
          <Label>Sales Price</Label>
          <Input
            name="salePrice"
            type="tel"
            placeholder="Enter sale price (optional)"
            value={formData.salePrice}
            onChange={(e) => handleChange("salePrice", e.target.value)}
          />
        </div>

        <div className="my-4">
          <Label>Total Stock</Label>
          <Input
            name="totalStock"
            type="tel"
            placeholder="Enter total stock"
            value={formData.totalStock}
            onChange={(e) => handleChange("totalStock", e.target.value)}
          />
        </div>

        <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
          {buttonText || "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default ProductForm;
