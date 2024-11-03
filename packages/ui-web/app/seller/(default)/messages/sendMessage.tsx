/* eslint-disable @typescript-eslint/no-explicit-any */
import SingleUploadComponent from "@/components/common/fileUpload/singleFileUpload";
import InputComponent from "@/components/common/inputField/page";
import TextEditor from "@/components/common/textEditor/page";
import React, { useEffect, useRef, useState } from "react";
import RecipientDropdown from "./recipientDropdown";
import { UserApi } from "@fizno/api-client/src/apis/UserApi";
import { sendToUserType } from "@fizno/api-client/src/models/messageTypes";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorText from "@/components/common/errorText";
import { TabType } from "./page";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  globalCacheStateSelector,
  setIsLoading,
} from "@/redux/slices/globaCache.slice";
import { decodeHtmlEntities } from "@/utils/commonFunction";
import { ButtonLoader } from "@/components/common/loader/buttonLoader";

type newMessageType = {
  subject: string;
  message: string;
  sendTo: number;
};

interface SendMessageI {
  handleTabs: (arg: TabType) => void;
}

export default function SendMessage({ handleTabs }: SendMessageI) {
  /**
   * refs
   */
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * redux
   */

  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(globalCacheStateSelector);

  /**
   * state management
   */

  const [inputValue, setInputValue] = useState<sendToUserType>({
    displayName: "",
    id: 0,
    userEmail: "",
    userName: "",
    userStatus: 0,
  });
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [sentToUsers, setSendToUsers] = useState<sendToUserType[]>([]);
  const [fileData, setFileData] = useState<File | null>(null);
  const [searchText, setSearchText] = useState<string>("");

  /**
   * formik
   */

  const formik = useFormik<newMessageType>({
    initialValues: {
      subject: "",
      message: "",
      sendTo: 0,
    },
    validationSchema: Yup.object({
      subject: Yup.string().required("Subject is required."),
      message: Yup.string(),
      sendTo: Yup.number().required("To user is required."),
    }),
    onSubmit: (value: newMessageType) => {
      handleSendNewMessage(value);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchText(e.target.value);
    e.target.value === "" &&
      setInputValue({
        displayName: "",
        id: 0,
        userEmail: "",
        userName: "",
        userStatus: 0,
      });
    setShowSearchDropdown(inputValue !== "");
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setShowSearchDropdown(false);
    }
  };

  const handleUserSelect = (user: sendToUserType) => {
    setInputValue(user);
    setSearchText("");
    formik.setFieldValue("sendTo", user.id);
    setShowSearchDropdown(false);
  };

  console.log({ inputValue });

  /**
   * handle send new message
   */
  const handleSendNewMessage = async (values: newMessageType) => {
    const payload = {
      sendTo: values.sendTo,
      message: values.message,
      subject: values.subject,
      fileData,
    };
    dispatch(setIsLoading(true));
    const response = await UserApi.sendNewMessage(payload);
    if (response.remote === "success") {
      handleTabs("messageBox");
      dispatch(setIsLoading(false));
    } else {
      dispatch(setIsLoading(false));
    }
  };

  /**
   * handle fetch send to users
   */
  const handleFetchSendToUsers = async () => {
    const response = await UserApi.getSendToUsersAPI();

    if (response.remote === "success") {
      setSendToUsers(response.data.data);
    }
  };

  useEffect(() => {
    handleFetchSendToUsers();
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className="py-3 px-3 mb-4 bg-white shadow-lg border border-slate-200">
        <h4 className="text-slate-950 font-semibold text-xl my-2">
          Send Message
        </h4>
        <div className="mt-3 relative">
          <InputComponent
            label="To:"
            className=""
            onChange={handleInputChange}
            value={searchText || decodeHtmlEntities(inputValue.displayName)}
          />
          {showSearchDropdown ? (
            <RecipientDropdown
              searchText={searchText}
              userList={sentToUsers}
              onUserSelect={handleUserSelect}
            />
          ) : null}
          {formik.touched.sendTo && formik.errors.sendTo && (
            <ErrorText>{formik.errors.sendTo}</ErrorText>
          )}
        </div>
        <div className="mt-3">
          <InputComponent
            label="Subject:"
            {...formik.getFieldProps("subject")}
          />
          {formik.touched.subject && formik.errors.subject && (
            <ErrorText>{formik.errors.subject}</ErrorText>
          )}
        </div>
        <div className="mt-3">
          <TextEditor
            label="Message:"
            className=""
            value={formik.values.message}
            onChange={(vl) => formik.setFieldValue("message", vl)}
          />
          {formik.touched.message && formik.errors.message && (
            <ErrorText>{formik.errors.message}</ErrorText>
          )}
        </div>
        <div className="mt-5 send_message_upload">
          <SingleUploadComponent
            type=""
            handleImageChange={(e) => {
              if (e.target.files) {
                setFileData(e?.target?.files[0]);
              }
            }}
            component={{
              isUploaded: fileData ? true : false,
              item: fileData,
            }}
          />
        </div>
        <div className="mt-3">
          <button
            disabled={isLoading}
            onClick={() => formik.handleSubmit()}
            className="btn relative bg-primaryMain  hover:bg-blueTwo text-white"
          >
            {isLoading && (
              <>
                <span className="absolute left-[7%] top-[35%]">
                  <ButtonLoader />
                </span>
              </>
            )}
            <span className="hidden xs:block">Save Message</span>
          </button>
        </div>
      </div>
    </>
  );
}
