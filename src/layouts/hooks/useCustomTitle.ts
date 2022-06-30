import React, { useContext } from 'react';

export type CustomTitleData = {
  title?: string;
  subTitle?: string;
};

export const CustomTitleContext = React.createContext(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (title: CustomTitleData) => {
    return;
  },
);

export const useCustomTitle = () => {
  return useContext(CustomTitleContext);
};
