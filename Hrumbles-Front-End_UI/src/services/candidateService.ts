
import { supabase } from "@/integrations/supabase/client";
import { CandidateStatus } from "@/lib/types";

export interface HrJobCandidate {
  id: string;
  job_id: string;
  name: string;
  status: CandidateStatus;
  experience: string | null;
  match_score: number | null;
  applied_date: string;
  skills: string[] | null;
  email: string | null;
  phone: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
  // Additional fields
  metadata: Record<string, any> | null;
  skill_ratings: Array<{name: string, rating: number}> | null;
}

export interface CandidateData {
  id: string;
  name: string;
  status: CandidateStatus;
  experience: string;
  matchScore: number;
  appliedDate: string;
  skills: string[];
  email?: string;
  phone?: string;
  resumeUrl?: string;
  // Additional fields
  metadata?: Record<string, any>;
  skillRatings?: Array<{name: string, rating: number}>;
}

// Map database candidate to application candidate model
export const mapDbCandidateToData = (candidate: HrJobCandidate): CandidateData => {
  return {
    id: candidate.id,
    name: candidate.name,
    status: candidate.status,
    experience: candidate.experience || "",
    matchScore: candidate.match_score || 0,
    appliedDate: candidate.applied_date,
    skills: candidate.skills || [],
    email: candidate.email || undefined,
    phone: candidate.phone || undefined,
    resumeUrl: candidate.resume_url || undefined,
    metadata: candidate.metadata || undefined,
    skillRatings: candidate.skill_ratings || undefined
  };
};

// Map application candidate model to database candidate
export const mapCandidateToDbData = (candidate: CandidateData): Partial<HrJobCandidate> => {
  return {
    name: candidate.name,
    status: candidate.status,
    experience: candidate.experience || null,
    match_score: candidate.matchScore,
    applied_date: candidate.appliedDate,
    skills: candidate.skills || [],
    email: candidate.email || null,
    phone: candidate.phone || null,
    resume_url: candidate.resumeUrl || null,
    metadata: candidate.metadata || null,
    skill_ratings: candidate.skillRatings || null
  };
};

// Get all candidates for a job
export const getCandidatesByJobId = async (jobId: string): Promise<CandidateData[]> => {
  try {
    // Using raw SQL query since the table isn't in the TypeScript types yet
    const { data, error } = await supabase
      .from('hr_job_candidates')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching candidates:", error);
      throw error;
    }

    return (data || []).map(mapDbCandidateToData);
  } catch (error) {
    console.error(`Failed to fetch candidates for job ${jobId}:`, error);
    throw error;
  }
};

// Create a new candidate
export const createCandidate = async (jobId: string, candidate: CandidateData): Promise<CandidateData> => {
  try {
    const dbCandidate = mapCandidateToDbData(candidate);
    
    // Using raw SQL query since the table isn't in the TypeScript types yet
    const { data, error } = await supabase
      .from('hr_job_candidates')
      .insert({
        ...dbCandidate,
        job_id: jobId,
        name: candidate.name // Ensure name is included
      })
      .select('*')
      .single();

    if (error) {
      console.error("Error creating candidate:", error);
      throw error;
    }

    return mapDbCandidateToData(data as HrJobCandidate);
  } catch (error) {
    console.error(`Failed to create candidate for job ${jobId}:`, error);
    throw error;
  }
};

// Update a candidate
export const updateCandidate = async (id: string, candidate: CandidateData): Promise<CandidateData> => {
  try {
    const dbCandidate = mapCandidateToDbData(candidate);
    
    // Using raw SQL query since the table isn't in the TypeScript types yet
    const { data, error } = await supabase
      .from('hr_job_candidates')
      .update(dbCandidate)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error("Error updating candidate:", error);
      throw error;
    }

    return mapDbCandidateToData(data as HrJobCandidate);
  } catch (error) {
    console.error(`Failed to update candidate with ID ${id}:`, error);
    throw error;
  }
};

// Update candidate status
export const updateCandidateStatus = async (id: string, status: CandidateStatus): Promise<void> => {
  try {
    const { error } = await supabase
      .from('hr_job_candidates')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error("Error updating candidate status:", error);
      throw error;
    }
  } catch (error) {
    console.error(`Failed to update status for candidate with ID ${id}:`, error);
    throw error;
  }
};

// Delete a candidate
export const deleteCandidate = async (id: string): Promise<void> => {
  try {
    // Using raw SQL query since the table isn't in the TypeScript types yet
    const { error } = await supabase
      .from('hr_job_candidates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting candidate:", error);
      throw error;
    }
  } catch (error) {
    console.error(`Failed to delete candidate with ID ${id}:`, error);
    throw error;
  }
};
