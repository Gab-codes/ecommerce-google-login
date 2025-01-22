export const registerFormControls = [
  {
    name: "userName",
    label: "Full name",
    placeholder: "Enter your first and last name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "unisex", label: "Unisex" },
    ],
  },
  {
    label: "Product",
    name: "product",
    componentType: "select",
    options: [
      { id: "wristwatch", label: "Wristwatch" },
      { id: "sunglasses", label: "Sunglasses" },
      { id: "perfume", label: "Perfume" },
      { id: "belts", label: "Belts" },
      { id: "armpitPurse", label: "Armpit Purse" },
      { id: "accessories", label: "Accessories" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "tel",
    placeholder: "Enter product price",
  },
  {
    label: "Sales Price",
    name: "salePrice",
    componentType: "input",
    type: "tel",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "tel",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "All Products",
    path: "/shop/listing",
  },
  {
    id: "sunglasses",
    label: "Sunglasses",
    path: "/shop/listing",
  },
  {
    id: "wristwatch",
    label: "Wristwatch",
    path: "/shop/listing",
  },
  {
    id: "perfume",
    label: "Perfume",
    path: "/shop/listing",
  },
  {
    id: "belts",
    label: "Belts",
    path: "/shop/listing",
  },
  {
    id: "armpitPurse",
    label: "Armpit Purse",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  unisex: "Unisex",
};

export const productOptionsMap = {
  wristwatch: "Wristwatch",
  sunglasses: "Sunglasses",
  perfume: "Perfume",
  belts: "Belts",
  armpitPurse: "Armpit Purse",
  accessories: "Accessories",
};

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "unisex", label: "Unisex" },
  ],
  product: [
    { id: "sunglasses", label: "Sunglasses" },
    { id: "wristwatch", label: "Wristwatch" },
    { id: "perfume", label: "Perfume" },
    { id: "belts", label: "Belts" },
    { id: "armpitPurse", label: "Armpit Purse" },
    { id: "accessories", label: "Accessories" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "State",
    name: "state",
    componentType: "input",
    type: "text",
    placeholder: "Enter your state",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "tel",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
