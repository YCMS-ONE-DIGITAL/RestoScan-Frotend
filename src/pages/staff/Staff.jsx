import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import StaffForm from "./StaffAddEditForm";
import { useQuery, useQueryClient,useMutation } from "@tanstack/react-query";
import api from "@/api/api";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import ConfirmBox from "../../components/ConfirmBox";

const Staff = () => {
  const qc = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);

  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // FETCH STAFF LIST
  const { data: staffData = [], isLoading, isError } = useQuery({
    queryKey: ["staff-list"],
    queryFn: async () => {
      const res = await api.get("restaurant/staff/all");
      return res.data?.data || [];
    },
  });


  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/restaurant/staff/delete/${id}`),
    onSuccess: () => {
qc.invalidateQueries({ queryKey: ["staff-list"] });
      toast.success("Staff Deleted Successfully ")

    },
    onError:()=>{
      toast.error("Failed to delete deleted")
    }
  });

  // OPEN ADD FORM
  const openForm = (id = null) => {
    setSelectedStaffId(id);
    setIsFormOpen(true);
  };

  // CLOSE FORM
  const closeForm = () => {
    setSelectedStaffId(null);
    setIsFormOpen(false);
    qc.invalidateQueries(["staff-list"]);
  };

  // LOADING UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 text-white">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading staff details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-400 mt-10">
        Failed to load staff data.
        <Button className="mt-4" onClick={() => qc.invalidateQueries(["staff-list"])}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Staff</h1>

        <Button
          onClick={() => openForm()}
         className="font-semibold"
        >
                    <Plus className="w-5 h-5 mr-2" />

          Add Member
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-200 rounded-lg">
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="text-gray-300">Sr. No.</TableHead>
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Phone</TableHead>
              <TableHead className="text-gray-300">Role</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {staffData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-4">
                  No staff found.
                </TableCell>
              </TableRow>
            ) : (
              staffData.map((staff,i) => (
                <TableRow key={staff.id}>
                  <TableCell className="text-gray-300">{i+1}</TableCell>
                  <TableCell className="text-gray-300">{staff.name}</TableCell>
                  <TableCell className="text-gray-300">{staff.email}</TableCell>
                  <TableCell className="text-gray-300">{staff.phone}</TableCell>
                  <TableCell className="text-gray-300">{staff.role}</TableCell>

                  <TableCell className="destructive flex gap-4">
                    <Button
                      className=" bg-white text-gray-800 "
                      onClick={() => openForm(staff.id)}
                    >
                                        <Edit className="w-4 h-4 " /> 

                    </Button>

                    
                <Button
                    variant="destructive"
                    className=""
                    onClick={() => {
                      setDeleteId(staff.id);
                      setConfirmOpen(true);
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <StaffForm
          staffId={selectedStaffId}
          onClose={closeForm}
        />
      )}

      <ConfirmBox
              open={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              title="Delete Staff ?"
              message={
                deleteId
                  ? `Are you sure you want to delete "${staffData.find(staff => staff.id === deleteId)?.name || ""}"?`
                  : ""
              }
              onConfirm={() => {
                deleteMutation.mutate(deleteId);
                setConfirmOpen(false);
              }}
            />
    </div>
  );
};

export default Staff;
