import React from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
const paymentdue = () => {
    
  const staffData = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Manager", joined: "12 Jan 2023" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Staff", joined: "25 Feb 2024" },
  ]
  return (

 <div className=" ">

        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-xl font-semibold text-white-500 dark:text-white">Due Payments (0)</h1>

          {/* Search + Buttons */}
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 005.15-1.35z" />
                </svg>
              </span>
              <input
                className="w-64 sm:w-72 lg:w-96 pl-10 pr-4 py-2 text-sm bg-gray-900 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-skin-base focus:border-skin-base"
                placeholder="Search by name or email"
              />
            </div>

            {/* Export */}
            <button className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-600">
              Export
            </button>

            
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <Table className="min-w-full border border-gray-200  rounded-lg">
            <TableHeader className="bg-gray-800 dark:bg-gray-700">
              <TableRow>
                <TableHead className="text-gray-300 dark:text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300 dark:text-gray-300">Payment Method</TableHead>
                <TableHead className="text-gray-300 dark:text-gray-300">Order</TableHead>
                <TableHead className="text-gray-300 dark:text-gray-300">	Date & Time</TableHead>
                {/* <TableHead className="text-right text-gray-300 dark:text-gray-300">Action</TableHead> */}
              </TableRow>
            </TableHeader>

           <TableBody>
  {staffData.map((staff) => (
    <TableRow key={staff.id}>
      <TableCell className="text-gray-300 dark:text-gray-200">{staff.name}</TableCell>
      <TableCell className="text-gray-300 dark:text-gray-200">{staff.email}</TableCell>
      <TableCell className="text-gray-300 dark:text-gray-200">{staff.role}</TableCell>
      <TableCell className="text-gray-300 dark:text-gray-200">{staff.joined}</TableCell>

      {/* <TableCell className="text-right">
        <button className="text-skin-base hover:underline">Edit</button>
      </TableCell> */}
    </TableRow>
  ))}
</TableBody>

          </Table>
        </div>
      </div>)
}

export default paymentdue