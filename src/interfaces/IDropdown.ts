export type OptionItem = {
  value: string;
  label: string;
};

export interface IDropDownProps {
  data: OptionItem[];
  onChange: (item: OptionItem) => void;
  placeholder: string;
}