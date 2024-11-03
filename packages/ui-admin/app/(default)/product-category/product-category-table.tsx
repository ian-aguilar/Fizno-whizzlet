import { useItemSelection } from "@/components/utils/use-item-selection";
import MultiselectDropdown from "@/components/common/multiselect/page";
import SelectComponent from "@/components/common/select/page";
import { useRouter } from "next/navigation";
import ProductCategoryTableItem from "./product-category-table-item";
import GradientCircularProgress from "@/app/loader/loader";

export interface Category {
  id: number;
  image: any;
  name: any;
  description: any;
  count: any;
  type: any;
  usageLimit: string;
  slug: string;
  expiryDate: string;
  parent: number;
}

export default function ProductCategoryTable({
  categories,
  handleRowPerPageChange,
  rowPerPageValue,
  handleSearch,
  loading,
  snackbar,
  setSnackbar,
}: {
  categories: Category[];
  handleRowPerPageChange: (value: number) => void;
  rowPerPageValue: number;
  handleSearch: (value: string) => void;
  loading: boolean;
  setSnackbar: (e: any) => void;
  snackbar: any;
}) {
  const {
    selectedItems,
    isAllSelected,
    handleCheckboxChange,
    handleSelectAllChange,
  } = useItemSelection(categories);
  return (
    <>
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
        <div className="py-4">
          {/* Table */}

          <div className="flex justify-between mb-4 px-4">
            <div className="flex items-center">
              {" "}
              <div className="flex items-center mr-4 ">
                <span>Show </span>
                <select
                  value={rowPerPageValue.toString()}
                  className="w-20 mx-2 dark:bg-[rgb(18,18,18)] dark:border-slate-700 h-9"
                  onChange={(event) => {
                    const selectedValue = event.target.value; // Access the selected value from event.target.value
                    handleRowPerPageChange(Number(selectedValue));
                  }}
                >
                  <option>10</option>
                  <option>25</option>
                  <option>50</option> <option>100</option>
                </select>
                <span>Entries</span>
              </div>
            </div>
            <div className="">
              <input
                type="text"
                className="h-9 px-2 rounded-sm border border-slate-200 dark:bg-[rgb(18,18,18)] dark:border-slate-700"
                placeholder="search"
                onChange={(event: any) => {
                  const searchValue = event.target.value;
                  handleSearch(searchValue);
                }}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-slate-300">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">ID</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Image</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Name</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Description</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Slug</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-center">Parent</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-center">Count</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Actions</div>
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                {loading && <GradientCircularProgress />}
                {categories.map((category) => (
                  <ProductCategoryTableItem
                    snackbar={snackbar}
                    setSnackbar={setSnackbar}
                    key={category.id}
                    category={category}
                    onCheckboxChange={handleCheckboxChange}
                    isSelected={selectedItems.includes(category.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
