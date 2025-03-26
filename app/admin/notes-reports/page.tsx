"use client";

import { useEffect, useState } from "react";
import { NotesReportsTable } from "../components/NotesReportsTable";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface NotesReport {
  _id: string;
  noteUrl: string;
  issue: string;
  otherText?: string;
  userName: string;
  userEmail: string;
  status: string;
  createdAt: string;
}

export default function NotesReportsPage() {
  const [reports, setReports] = useState<NotesReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch("/admin/api/notes-reports", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(
            `Failed to fetch notes reports: ${response.statusText}`
          );
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setReports(data);
        } else {
          console.error("API Error: Response is not an array.");
          setReports([]);
        }
      } catch (error) {
        console.error("Failed to fetch notes reports:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId: string, status: string) => {
    try {
      const response = await fetch("/admin/api/notes-reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status }),
      });

      const result = await response.json();

      if (result.success) {
        setReports((prev) =>
          prev.map((report) =>
            report._id === reportId ? { ...report, status } : report
          )
        );
      } else {
        console.error("Failed to update report status:", result.error);
      }
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 min-w-fit">
      <h1 className="text-2xl font-bold mb-4">Notes Reports</h1>
      <Separator className="mb-6" />

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>
      ) : (
        <NotesReportsTable
          reports={reports}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
}
