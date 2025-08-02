import React from 'react';
import { FloatingLabel } from 'flowbite-react';

const ScheduleForm = () => {
  return (
    <div>
      <FloatingLabel variant="outlined" label="Event Name" type="text" className="form-input" />
      <FloatingLabel variant="outlined" label="Date" type="date" className="form-input" />
      <FloatingLabel variant="outlined" label="Time" type="time" className="form-input" />
    </div>
  );
};

export default ScheduleForm;
