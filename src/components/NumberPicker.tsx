import { Button } from "primereact/button";

interface NumberPickerProps {
  min: number;
  max: number;
  value: number | null;
  onChange: (value: number | null) => void;
};

const NumberPicker = ({ min, max, value, onChange }: NumberPickerProps) => {
  const handleClick = (num: number) => {
    if (num === value) {
      onChange(null);
    } else {
      onChange(num);
    }
  };

  return (
    <div className="grid gap-0 mx-1">
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
        <Button
          className="p-0 w-2rem border-noround h-2rem justify-content-center align-items-center"
          label={String(num)}
          key={num}
          severity={(num===value? undefined :"secondary")}
          onClick={() => handleClick(num)}
          outlined={num !== value}
        />
      ))}
    </div>
  );
};

export default NumberPicker;
