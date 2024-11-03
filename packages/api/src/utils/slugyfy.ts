/* eslint-disable prettier/prettier */
export const slugify = (text: string) => {
    const slug = text
        .toLowerCase()
        .replace(/[\d]/g, "")
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return slug;
};
