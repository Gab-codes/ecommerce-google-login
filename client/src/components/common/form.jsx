import PropTypes from "prop-types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  function renderFormElement(control) {
    const value = formData[control.name] || "";
    const isPasswordField = control.type === "password";
    const inputType =
      isPasswordField && passwordVisible ? "text" : control.type;

    switch (control.componentType) {
      case "input":
        return (
          <div className="relative">
            <Input
              name={control.name}
              placeholder={control.placeholder}
              id={control.name}
              type={inputType}
              value={value}
              onChange={(e) =>
                setFormData({ ...formData, [control.name]: e.target.value })
              }
            />
            {isPasswordField && (
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setPasswordVisible((prev) => !prev)}
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            )}
          </div>
        );
      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) =>
              setFormData({ ...formData, [control.name]: val })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={control.label} />
            </SelectTrigger>
            <SelectContent>
              {control.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "textarea":
        return (
          <Textarea
            name={control.name}
            placeholder={control.placeholder}
            id={control.id}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [control.name]: e.target.value })
            }
          />
        );
      default:
        return (
          <Input
            name={control.name}
            placeholder={control.placeholder}
            id={control.name}
            type={control.type}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [control.name]: e.target.value })
            }
          />
        );
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((control) => (
          <div className="grid w-full gap-1.5" key={control.name}>
            <Label>{control.label}</Label>
            {renderFormElement(control)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

CommonForm.propTypes = {
  formControls: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      componentType: PropTypes.oneOf(["input", "select", "textarea"])
        .isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  isBtnDisabled: PropTypes.bool,
};

export default CommonForm;
