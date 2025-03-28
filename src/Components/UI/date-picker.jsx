import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import PropTypes from 'prop-types';

export const CustomDatePicker = ({ selectedDate, onChange }) => {
  return (
    <div className="py-4 border rounded-lg bg-white w-full mx-auto flex justify-center">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onChange}
        className="p-2 text-gray-900"
        modifiersClassNames={{
          selected: 'bg-blue-500 text-white rounded-full',
          today: 'font-bold text-blue-700',
        }}
        classNames={{
          caption: 'text-lg font-semibold text-center mb-2',
          nav_button: 'hover:bg-gray-200 rounded-full p-2',
          head_cell: 'uppercase text-gray-500 text-sm',
          row: 'flex justify-center',
          cell: 'p-2 cursor-pointer hover:bg-blue-100 rounded-md',
        }}
      />
    </div>
  );
};
CustomDatePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date), // Ensure selectedDate is a Date object
  onChange: PropTypes.func.isRequired, // onChange should be a function
};

export default CustomDatePicker;
