import React, { useState } from "react";
import SwitchComponent from "./switchComponent";
import InputComponent from "@/components/common/inputField/page";

export default function Capabilities() {
  const [capabilities, setCapabilities] = useState<boolean>(true);

  const productArray = [
    { id: "1", label: "Manage Products" },
    { id: "2", label: "Add Products" },
    { id: "3", label: "Publish Products" },
    { id: "4", label: "Edit Live Products" },
    { id: "5", label: "Auto Publish Live Products" },
    { id: "6", label: "Delete Products" },
  ];
  const typesArray = [
    { id: "1", label: "Simple" },
    { id: "2", label: "Variable" },
    { id: "3", label: "Grouped" },
    { id: "4", label: "External/Affiliate" },
    { id: "5", label: "Virtual" },
    { id: "6", label: "Downloadable" },
  ];
  const panelsArray = [
    { id: "1", label: "Inventory" },
    { id: "2", label: "Shipping" },
    { id: "3", label: "Taxes" },
    { id: "4", label: "Linked" },
    { id: "5", label: "Attributes" },
    { id: "6", label: "Advanced" },
    { id: "7", label: "Catalog" },
  ];
  const sectionsArray = [
    { id: "1", label: "Featured Image" },
    { id: "2", label: "Gallery Image" },
    { id: "3", label: "Category" },
    { id: "4", label: "Add Category" },
    { id: "5", label: "Conditions" },
    { id: "6", label: "Add Conditions" },
    { id: "7", label: "Tags" },
    { id: "8", label: "Add-ons" },
    { id: "9", label: "Toolset Fields" },
    { id: "10", label: "ACF Fields" },
    { id: "11", label: "Location" },
  ];
  const insightsArray = [
    { id: "1", label: "Add Attribute" },
    { id: "2", label: "Add Attribute Term" },
    { id: "3", label: "Rich Editor" },
    { id: "4", label: "Featured Product" },
    { id: "5", label: "Duplicate Product" },
    { id: "6", label: "Import" },
    { id: "7", label: "Export" },
    { id: "8", label: "Quick Edit" },

    { id: "9", label: "Bulk Edit" },
    { id: "10", label: "Stock Manager" },
  ];
  const fieldsArray = [
    { id: "1", label: "SKU" },
    { id: "2", label: "Price" },
    { id: "3", label: "Sale Price" },
    { id: "4", label: "Sale Schedule" },
    { id: "5", label: "Short Description" },
    { id: "6", label: "Description" },
  ];
  const withdrawalArray = [
    { id: "1", label: "Withdrawal Request" },
    { id: "2", label: "Transactions" },
    { id: "3", label: "Transaction Details" },
  ];
  const articleArray = [
    { id: "1", label: "Manage Articles" },
    { id: "2", label: "Add Articles" },
    { id: "3", label: "Publish Articles" },
    { id: "4", label: "Edit Live Articles" },
    { id: "5", label: "Auto Publish Live Articles" },
    { id: "6", label: "Delete Articles" },
  ];
  const couponsArray = [
    { id: "1", label: "Manage Coupons" },
    { id: "2", label: "Add Coupons" },
    { id: "3", label: "Publish Coupons" },
    { id: "4", label: "Edit Live Coupons" },
    { id: "5", label: "Auto Publish Live Coupons" },
    { id: "6", label: "Delete Coupons" },
    { id: "7", label: "Allow Free Shipping" },
  ];
  const ordersArray = [
    { id: "1", label: "View Orders" },
    { id: "2", label: "Status Update" },
    { id: "3", label: "View Details" },
    { id: "4", label: "Add/Edit Order" },
    { id: "5", label: "Delete Order" },
    { id: "6", label: "View Comments" },
    { id: "7", label: "Submit Comments" },
    { id: "8", label: "Export CSV" },

    { id: "9", label: "View Commision" },
  ];
  const customersArray = [
    { id: "1", label: "Manage Customers" },
    { id: "2", label: "Add Customer" },
    { id: "3", label: "View Customer" },
    { id: "4", label: "Edit Customer" },
    { id: "5", label: "Delete Customer" },
    { id: "6", label: "View Customer Orders" },
    { id: "7", label: "View Customer Name" },
    { id: "8", label: "View Customer Email" },

    { id: "9", label: "Billing Address" },
    { id: "10", label: "Shipping Address" },
  ];
  const settingsArray = [
    { id: "1", label: "Store Settings" },
    { id: "2", label: "Capability Controller" },
    { id: "3", label: "Store Branding" },
    { id: "4", label: "Location" },
    { id: "5", label: "Shipping" },
    { id: "6", label: "Payment" },
    { id: "7", label: "SEO" },
    { id: "8", label: "Policies" },
    { id: "9", label: "Customer Support" },
    { id: "10", label: "Store Hours" },
    { id: "11", label: "Vacation" },
  ];
  const settingsInsideArray = [
    { id: "1", label: "Logo" },
    { id: "2", label: "Banner" },
    { id: "3", label: "Name" },
    { id: "4", label: "Description" },
    { id: "5", label: "Phone" },
  ];
  const profileArray = [
    { id: "1", label: "Profile" },
    { id: "2", label: "Address" },
    { id: "3", label: "Social" },
    { id: "4", label: "Verification" },
    { id: "5", label: "Membership" },
  ];
  return (
    <>
      <div className="">
        <div className="flex">
          <div className="w-6/12">
            <div className="">
              <h5 className="text-primaryMain font-bold text-lg">Products</h5>
              <ul className="p-0">
                {productArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Types</h5>
              <ul className="p-0">
                {typesArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Panels</h5>
              <ul className="p-0">
                {panelsArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Sections</h5>
              <ul className="p-0">
                {sectionsArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Insights</h5>
              <ul className="p-0">
                {insightsArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Fields</h5>
              <ul className="p-0">
                {fieldsArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Fields</h5>
              <div className="w-96"></div>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Settings</h5>
              <ul className="p-0">
                {settingsArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">
                Settings Inside
              </h5>
              <ul className="p-0">
                {settingsInsideArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Profile</h5>
              <ul className="p-0">
                {profileArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">
                Chat Module
              </h5>
              <ul className="p-0">
                <li>
                  <SwitchComponent
                    label="Chat Module"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className="w-6/12">
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Access</h5>
              <ul className="p-0">
                <li>
                  <SwitchComponent
                    label="Backend Access (wp-admin)"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Withdrawal</h5>
              <ul className="p-0">
                {withdrawalArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">
                Integrations
              </h5>
              <h5 className="text-primaryMain font-bold text-lg">Articles</h5>

              <ul className="p-0">
                {articleArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Coupons</h5>

              <ul className="p-0">
                {couponsArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Orders</h5>

              <ul className="p-0">
                {ordersArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Customers</h5>

              <ul className="p-0">
                {customersArray.map((item, index) => (
                  <>
                    {" "}
                    <li key={index}>
                      <SwitchComponent
                        label={item.label}
                        capabilities={capabilities}
                        setCapabilities={setCapabilities}
                      />
                    </li>
                  </>
                ))}
                <li className="w-96">
                  <InputComponent
                    label="Customer Limit"
                    className="font-semibold"
                  />
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Reports</h5>

              <ul className="p-0">
                <li>
                  <SwitchComponent
                    label="View Reports"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">
                Shipping Tracking
              </h5>

              <ul className="p-0">
                <li>
                  <SwitchComponent
                    label="Allow"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Notice</h5>

              <ul className="p-0">
                <li>
                  <SwitchComponent
                    label="Notice"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
                <li>
                  <SwitchComponent
                    label="Topic Reply"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">
                Notification
              </h5>

              <ul className="p-0">
                <li>
                  <SwitchComponent
                    label="Notification"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
                <li>
                  <SwitchComponent
                    label="Direct Message"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
                <li>
                  <SwitchComponent
                    label="Knowledgebase"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">
                Group & Staffs
              </h5>

              <ul className="p-0">
                <li>
                  <SwitchComponent
                    label="Manage Group"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
                <li>
                  <SwitchComponent
                    label="Message Managers"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
                <li>
                  <SwitchComponent
                    label="Manage Staff"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
                <li className="w-96">
                  <InputComponent label="Staff Limit" />
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <h5 className="text-primaryMain font-bold text-lg">Analytics</h5>

              <ul className="p-0">
                <li>
                  <SwitchComponent
                    label="Analytics"
                    capabilities={capabilities}
                    setCapabilities={setCapabilities}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
