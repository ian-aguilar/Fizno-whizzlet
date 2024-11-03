/* eslint-disable prettier/prettier */
import { StaticImageData } from "next/image";
import { useItemSelection } from "@/components/utils/use-item-selection";
import ProductTableItem from "./product-table-item";
import SearchSingleSelect from "@/components/common/select/searchableSingleSelect";
import { useRouter } from "next/navigation";
import { AuthApi } from "@fizno/api-client/src/apis/AuthApi";
import { useEffect, useState } from "react";
import { categoriesService } from "@fizno/api-client/src/apis/catergory";

export interface Product {
  id: number;
  image: StaticImageData;
  name: string;
  stock: number;
  price: string;
  taxonomies: any;
  views: number;
  status: string;
  date: string;
}

// Move static arrays to constants if they are used across components
// const categoriesArray = [
//   { value: "ATV", label: "ATV" },
//   { value: "Dirt Bike", label: "Dirt Bike" },
//   { value: "Motorcycle", label: "Motorcycle" },
//   { value: "Other", label: "Other" },
//   { value: "Toys & Hobbies", label: "Toys & Hobbies" },
//   { value: "Uncategorized", label: "Uncategorized" },
//   { value: "Utility ATV", label: "Utility ATV" },
//   { value: "UTV", label: "UTV" },
// ];

// const conditionArray = [
//   { value: "NEW", label: "NEW" },
//   { value: "OPEN BOX", label: "NEW - OPEN BOX" },
//   { value: "USED", label: "USED" },
//   { value: "REPAIR", label: "USED - PARTS/REPAIR" },
// ];

// const productArray = [
//   { value: "simple_product", label: "Simple Product" },
//   { value: "variable_product", label: "Variable Product" },
//   { value: "external_product", label: "External/Affiliate Product" },
// ];

export default function ProductTable({
  products,
  setPageSize,
  query,
  setQuery,
  snackbar,
  setSnackbar,
}: {
  products: Product[];
  setPageSize: (data: any) => void;
  query: { seller: string; category: string; condition: string };
  setQuery: (data: any) => void;
  snackbar: any;
  setSnackbar: (e: any) => void;
}) {
  const [vendors, setVendors] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [conditions, setConditions] = useState<any>([]);
  const [productsArray, setProductsArray] = useState<any>([ { value: 2, label: "simple", count: 30311 },
    { value: 4, label: "variable", count: 236 },]);

  const {
    selectedItems,
    isAllSelected,
    handleCheckboxChange,
    handleSelectAllChange,
  } = useItemSelection(products);

  const router = useRouter();
  const fetchVendor = async () => {
    const response = await AuthApi.getAllVendorsForFilter();
    if (response.remote === "success") {
      const transformedVendors = response.data.data?.map(
        (vendor: { id: any; user_login: any; display_name: any }) => ({
          value: vendor.id,
          label: vendor.display_name,
        }),
      );
      setVendors(transformedVendors);
    }
  };

  const fetchCatgories = async () => {
    const response = await categoriesService.getParentCategory();
    console.log({ response });
    if (response.remote === "success") {
      setCategories(response.data);
    }
  };
  const fetchConditions = async () => {
    const response = await categoriesService.getAllConditions();
    console.log({ response });
    if (response.remote === "success") {
      setConditions(response.data);
    }
  };
  // const fetchProducts = async () => {
  //   const response = await categoriesService.getAllProductTypes();
  //   console.log({ response }, "type");
  //   if (response.remote === "success") {
  //     setProductsArray(response.data);
  //   }
  // };

  useEffect(() => {
    fetchVendor();
    fetchCatgories();
    fetchConditions();
    // fetchProducts();
  }, []);
  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
      <header className="px-5 py-2">{/* Optional header text */}</header>

      <div>
        {/* Filters */}
        <div className="flex justify-between mb-4 px-4">
          <div className="flex items-center w-7/12">
            <div className="mr-3">
              <SearchSingleSelect
                className="mr-3 w-48"
                Options={categories}
                onChange={(e) => setQuery({ ...query, category: e.value })}
                value={undefined}
                name={""}
                onBlur={function (e: any): void {}}
                label="Category"
              />
            </div>
            <div className="mr-3">
              <SearchSingleSelect
                className="mr-3 w-48"
                Options={conditions}
                onChange={(e) => setQuery({ ...query, condition: e.value })}
                value={undefined}
                name={""}
                onBlur={function (e: any): void {}}
                label="Condition"
              />
            </div>
            <div className="mr-3">
              <SearchSingleSelect
                className="mr-3 w-48"
                Options={productsArray}
                onChange={function (data: any): void {}}
                value={undefined}
                name={""}
                onBlur={function (e: any): void {}}
                label="Product"
              />
            </div>
            <div className="mr-3">
              <SearchSingleSelect
                className="mr-3 w-48"
                Options={vendors}
                onChange={(e) => setQuery({ ...query, seller: e.value })}
                value={undefined}
                name={""}
                onBlur={function (e: any): void {}}
                label="Vendor"
              />
            </div>
          </div>
          <div className="flex items-center">
            {/* <button
              className="btn bg-primaryMain hover:bg-blueTwo text-white"
              onClick={() => router.push("/add-products")}
            >
              Add
            </button> */}
          </div>
        </div>

        {/* Table Options */}
        <div className="flex justify-between mb-4 px-4">
          <div className="flex items-center">
            <span>Show</span>
            <select
              className="w-20 mx-2 dark:bg-[rgb(18,18,18)] dark:border-slate-700 h-9"
              onChange={(event: any) => {
                setPageSize(event.target.value);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>Entries</span>
          </div>
          <div>
            <input
              type="text"
              className="h-9 px-2 rounded-sm border border-slate-200 dark:bg-[rgb(18,18,18)] dark:border-slate-700"
              placeholder="search"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <label className="inline-flex">
                      <span className="sr-only">Select all</span>
                      <input
                        className="form-checkbox"
                        type="checkbox"
                        onChange={handleSelectAllChange}
                        checked={isAllSelected}
                      />
                    </label>
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Image</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 w-52">
                  <div className="font-semibold text-left">Name</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Status</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Stock</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Price</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-center">Taxonomies</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold">Views</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-center">Date</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
              {products.map((product) => (
                <ProductTableItem
                  key={product.id}
                  product={product}
                  onCheckboxChange={handleCheckboxChange}
                  isSelected={selectedItems.includes(product.id)}
                  snackbar={snackbar}
                  setSnackbar={setSnackbar}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
