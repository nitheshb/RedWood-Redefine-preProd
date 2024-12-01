import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const WeeklyExpense = () => {
  const expenses = [
    { name: 'Grocery', value: 48, color: '#6366F1' },
    { name: 'Food & Drink', value: 32, color: '#10B981' },
    { name: 'Shopping', value: 13, color: '#EF4444' },
    { name: 'Transportation', value: 7, color: '#F59E0B' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-8">Weekly Expense</h1>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={expenses}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {expenses.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <button className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        View Report
      </button>
    </div>
  );
};

export default WeeklyExpense;