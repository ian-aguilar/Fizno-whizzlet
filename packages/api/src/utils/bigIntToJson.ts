/* eslint-disable prettier/prettier */
import JSONbig from "json-bigint";
export const bigIntToJson = (data: any) => {
    const updatedData = data.map(item => {
        const stringify = JSONbig.stringify(item);
        return JSON.parse(stringify);
    });
    return updatedData;
};
