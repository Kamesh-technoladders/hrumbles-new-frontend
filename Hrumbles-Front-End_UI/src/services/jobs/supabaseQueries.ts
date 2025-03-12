
import { supabase } from "@/integrations/supabase/client";

// Basic query functions for hr_jobs table
export const fetchAllJobs = async () => {
  const { data, error } = await supabase
    .from("hr_jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }

  return { data, error };
};

export const fetchJobsByType = async (jobType: string) => {
  const { data, error } = await supabase
    .from("hr_jobs")
    .select("*")
    .eq("job_type_category", jobType)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching ${jobType} jobs:`, error);
    throw error;
  }

  return { data, error };
};

export const fetchJobById = async (id: string) => {
  const { data, error } = await supabase
    .from("hr_jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching job:", error);
    throw error;
  }

  return { data, error };
};

export const insertJob = async (jobData: Record<string, any>) => {
  const { data, error } = await supabase
    .from("hr_jobs")
    .insert(jobData)
    .select("*")
    .single();

  if (error) {
    console.error("Error creating job:", error);
    throw error;
  }

  return { data, error };
};

export const updateJobRecord = async (id: string, jobData: Record<string, any>) => {
  const { data, error } = await supabase
    .from("hr_jobs")
    .update(jobData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating job:", error);
    throw error;
  }

  return { data, error };
};

export const updateJobStatusRecord = async (jobId: string, status: string) => {
  const { data, error } = await supabase
    .from("hr_jobs")
    .update({ status })
    .eq("id", jobId)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating job status:", error);
    throw error;
  }

  return { data, error };
};

export const deleteJobRecord = async (id: string) => {
  const { error } = await supabase
    .from("hr_jobs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting job:", error);
    throw error;
  }

  return { error };
};
