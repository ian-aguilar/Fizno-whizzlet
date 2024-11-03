import Image from "next/image";
import Tooltip from "@/components/tooltip";
import { useRouter } from "next/navigation";
import { Content } from "./homepage-table";

interface HomepageTableItemProps {
  category: Content;
  onCheckboxChange: (id: number, checked: boolean) => void;
  isSelected: boolean;
}

export default function HomepageTableItem({
  category,
  onCheckboxChange,
  isSelected,
}: HomepageTableItemProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(category.id, e.target.checked);
  };
  const router = useRouter();
  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <Image
            src={category.image}
            alt=""
            sizes="100wvh"
            height={60}
            width={150}
          />
        </div>
      </td>{" "}
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className=" font-bold text-primaryMain">{category.title}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        {/* Menu button */}

        <button
          className="ms-2 bg-primaryMain text-white p-1 hover:bg-blueTwo rounded-md shadow"
          onClick={() =>
            router.push(`/edit-homepage-content?id=${category.id}`)
          }
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button className="ms-2 bg-primaryMain text-white p-1 hover:bg-blueTwo rounded-md shadow">
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 1.75V3h5.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75Zm-6.5 0V3h5V1.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25ZM4.997 6.178a.75.75 0 1 0-1.493.144L4.916 20.92a1.75 1.75 0 0 0 1.742 1.58h10.684a1.75 1.75 0 0 0 1.742-1.581l1.413-14.597a.75.75 0 0 0-1.494-.144l-1.412 14.596a.25.25 0 0 1-.249.226H6.658a.25.25 0 0 1-.249-.226L4.997 6.178Z"></path>
            <path d="M9.206 7.501a.75.75 0 0 1 .793.705l.5 8.5A.75.75 0 1 1 9 16.794l-.5-8.5a.75.75 0 0 1 .705-.793Zm6.293.793A.75.75 0 1 0 14 8.206l-.5 8.5a.75.75 0 0 0 1.498.088l.5-8.5Z"></path>
          </svg>
        </button>
      </td>
    </tr>
  );
}
