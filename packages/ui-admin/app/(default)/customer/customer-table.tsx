import { useItemSelection } from "@/components/utils/use-item-selection";
import CustomerTableItem from "./customer-table-item";
import GradientCircularProgress from "@/app/loader/loader";
import RoundedLoader from "@/components/common/loader/roundedLoader";

export interface Customer {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

export default function CustomerTable({
  customers,
  isLoading,
  pageSize,
  setPageSize,
  snackbar,
  setSnackbar,
}: {
  customers: Customer[];
  isLoading: boolean;
  setPageSize: (value: number) => void;
  pageSize: number;
  setSnackbar: (e: any) => void;
  snackbar: any;
}) {
  const { selectedItems, handleCheckboxChange } = useItemSelection(customers);
  return (
    <>
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 relative">
        <div className="py-4">
          {/* Table */}
          <div className="flex justify-between mb-4 px-4">
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <span>Show </span>
                <select
                  value={pageSize}
                  className="w-20 mx-2 dark:bg-[rgb(18,18,18)] dark:border-slate-700 h-9"
                  onChange={(event: any) => {
                    setPageSize(event.target.value);
                  }}
                >
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
                <span>Entries</span>
              </div>
            </div>

            <div>
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
                    <div className="font-semibold text-left">Username</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Name</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Email</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Role</div>
                  </th>
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Actions</div>
                  </th>
                </tr>
              </thead>
              <div className="mx-auto w-full text-center">
                {" "}
                {isLoading && <RoundedLoader />}
              </div>
              <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                {customers.map((customer) => (
                  <CustomerTableItem
                    key={customer.id}
                    customer={customer}
                    onCheckboxChange={handleCheckboxChange}
                    isSelected={selectedItems.includes(customer.id)}
                    snackbar={snackbar}
                    setSnackbar={setSnackbar}
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
