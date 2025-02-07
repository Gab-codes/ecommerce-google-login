import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchColors, addColor, deleteColor } from "@/store/admin/color-slice";
import colornames from "colornames";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const AdminColors = () => {
  const dispatch = useDispatch();
  const { colors, isLoading } = useSelector((state) => state.adminColors);
  const [colorName, setColorName] = useState("");
  const [colorValue, setColorValue] = useState("#000000");
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    dispatch(fetchColors());
  }, [dispatch]);

  // Handle Color Name Input
  const handleColorNameChange = (e) => {
    const name = e.target.value;
    setColorName(name);

    const hex = colornames(name);
    if (hex) {
      setColorValue(hex);
    }
  };

  // Add Color
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!colorName.trim()) {
      toast.error("Please enter a valid color name.");
      return;
    }

    try {
      await dispatch(addColor({ colorName, colorValue })).unwrap();
      toast.success(`${colorName} added successfully!`);
      setColorName("");
      setColorValue("#000000");
    } catch (error) {
      toast.error("Failed to add color. Possible duplicate name");
    }
  };

  // Select / Deselect All Colors
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedColors(colors.map((color) => color._id));
    } else {
      setSelectedColors([]);
    }
  };

  // Handle Individual Color Selection
  const handleColorSelect = (id, checked) => {
    setSelectedColors((prev) =>
      checked ? [...prev, id] : prev.filter((c) => c !== id)
    );
  };

  // Delete Selected Colors
  const handleDeleteSelected = async () => {
    if (selectedColors.length === 0) {
      toast.error("No colors selected for deletion.");
      return;
    }

    try {
      await Promise.all(selectedColors.map((id) => dispatch(deleteColor(id))));
      setSelectedColors([]);
      toast.success("Selected colors deleted.");
    } catch (error) {
      toast.error("Failed to delete colors.");
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-bold text-foreground pb-5">
        Products Colors
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="container shadow-md mx-auto border p-3 rounded-md flex flex-col gap-5">
          <Label className="font-semibold text-lg">Enter Color</Label>
          <div className="flex items-center gap-3">
            <Input
              className="w-full sm:w-1/2"
              placeholder="Red, Blue, SkyBlue, etc..."
              value={colorName}
              onChange={handleColorNameChange}
            />
            <div className="relative">
              <input
                type="color"
                value={colorValue}
                onChange={(e) => setColorValue(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                className="w-10 h-10 rounded-full border border-gray-300 "
                style={{ backgroundColor: colorValue }}
              />
            </div>
          </div>

          <Button className="max-w-fit" type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Color"}
          </Button>
        </div>
      </form>

      {/* Color List */}
      {colors.length > 0 && (
        <div className="mt-5 border p-3 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <Label className="font-semibold text-lg">Added Colors</Label>
            <div className="flex gap-2 items-center">
              <Checkbox
                checked={
                  selectedColors.length === colors.length && colors.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span>Select All</span>
              <Button
                className="bg-red-500 text-white px-3 py-1 ml-2"
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </Button>
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {colors.map((color) => (
              <li
                key={color._id}
                className="flex items-center justify-between border p-2 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedColors.includes(color._id)}
                    onCheckedChange={(checked) =>
                      handleColorSelect(color._id, checked)
                    }
                  />
                  <div
                    className="w-8 h-8 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.value }}
                  />
                  <span>{color.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminColors;
