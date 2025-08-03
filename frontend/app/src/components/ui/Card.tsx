import React from 'react';
import { Card } from 'flowbite-react';

const CustomCard = () => {
  return (
    <Card className="max-w-sm mx-auto my-4">
      <h5 className="text-xl font-bold">Custom Card</h5>
      <p className="text-gray-700">This is a custom card using Flowbite.</p>
    </Card>
  );
};

export default CustomCard;
