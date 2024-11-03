import { useItemSelection } from "@/components/utils/use-item-selection";
import MultiselectDropdown from "@/components/common/multiselect/page";
import SelectComponent from "@/components/common/select/page";
import { useRouter } from "next/navigation";
import ProductAttributesTableItem from "./product-category-table-item";

export interface Attribute {
  attribute_id: number;
  details: any[];
  attribute_orderby: string;
  attribute_name: string;
  attribute_label: string;
}

export default function ProductAttributesTable({
  attributes,
}: {
  attributes: Attribute[];
}) {
  const {
    selectedItems,
    isAllSelected,
    handleCheckboxChange,
    handleSelectAllChange,
  } = useItemSelection(attributes);
  const categoriesArray = [
    { cat: "ATV", key: "ATV" },
    { cat: "Dirt Bike", key: "Dirt Bike" },
    { cat: "Motorcycle", key: "Motorcycle" },
    { cat: "Other", key: "Other" },
    { cat: "Toys & Hobbies", key: "Toys & Hobbies" },
    { cat: "Uncategorized", key: "Uncategorized" },
    { cat: "Utility ATV", key: "Utility ATV" },
    { cat: "UTV", key: "UTV" },
  ];
  const conditionArray = [
    { cat: "NEW", key: "NEW" },
    { cat: "OPEN BOX", key: "NEW - OPEN BOX" },
    { cat: "USED", key: "USED" },
    { cat: "REPAIR", key: "USED - PARTS/REPAIR" },
  ];
  const productArray = [
    { cat: "simple_product", key: "Simple Product" },
    { cat: "variable_product", key: "Variable Product" },
    { cat: "external_product", key: "External/Affliate Product" },
    { cat: "REPAIR", key: "USED - PARTS/REPAIR" },
  ];
  const router = useRouter();
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
                <select className="w-20 mx-2 dark:bg-[rgb(18,18,18)] dark:border-slate-700 h-9">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option> <option>100</option>
                </select>
                <span>Entries</span>
              </div>
              {/* <select className="w-64 mx-2 dark:bg-[rgb(18,18,18)] dark:border-slate-700 h-9">
                <option>Show All Types</option>
                <option>Percentage discount</option>
                <option>Fixed product discount</option>
              </select> */}
            </div>

            <div className="">
              <input
                type="text"
                className="h-9 px-2 rounded-sm border border-slate-200 dark:bg-[rgb(18,18,18)] dark:border-slate-700"
                placeholder="search"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full dark:text-slate-300">
              {/* Table header */}
              <thead className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Name</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Slug</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Order by</div>
                  </th>

                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Terms</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Actions</div>
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                {attributes?.map((attribute) => (
                  <ProductAttributesTableItem
                    key={attribute.attribute_id}
                    attribute={attribute}
                    onCheckboxChange={handleCheckboxChange}
                    isSelected={selectedItems.includes(attribute.attribute_id)}
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
