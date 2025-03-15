export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      hr_clients: {
        Row: {
          active_employees: number | null
          address: string | null
          city: string | null
          client_name: string
          completed_projects: number | null
          contact_person_first_name: string
          contact_person_last_name: string
          country: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          display_name: string
          email: string
          id: string
          ongoing_projects: number | null
          organization_id: string | null
          phone_number: string
          postal_code: string | null
          profit: number | null
          revenue: number | null
          state: string | null
          status: string | null
          total_projects: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          active_employees?: number | null
          address?: string | null
          city?: string | null
          client_name: string
          completed_projects?: number | null
          contact_person_first_name: string
          contact_person_last_name: string
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          display_name: string
          email: string
          id?: string
          ongoing_projects?: number | null
          organization_id?: string | null
          phone_number: string
          postal_code?: string | null
          profit?: number | null
          revenue?: number | null
          state?: string | null
          status?: string | null
          total_projects?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          active_employees?: number | null
          address?: string | null
          city?: string | null
          client_name?: string
          completed_projects?: number | null
          contact_person_first_name?: string
          contact_person_last_name?: string
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          display_name?: string
          email?: string
          id?: string
          ongoing_projects?: number | null
          organization_id?: string | null
          phone_number?: string
          postal_code?: string | null
          profit?: number | null
          revenue?: number | null
          state?: string | null
          status?: string | null
          total_projects?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_clients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "hr_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_clients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_clients_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "hr_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_departments: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_departments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_designations: {
        Row: {
          created_at: string
          department_id: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_designations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_addresses: {
        Row: {
          address_line1: string
          city: string
          country: string
          created_at: string | null
          employee_id: string | null
          id: string
          organization_id: string
          state: string
          type: string
          zip_code: string
        }
        Insert: {
          address_line1: string
          city: string
          country: string
          created_at?: string | null
          employee_id?: string | null
          id?: string
          organization_id: string
          state: string
          type: string
          zip_code: string
        }
        Update: {
          address_line1?: string
          city?: string
          country?: string
          created_at?: string | null
          employee_id?: string | null
          id?: string
          organization_id?: string
          state?: string
          type?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_addresses_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_addresses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_bank_details: {
        Row: {
          account_holder_name: string
          account_number: string
          account_type: string
          bank_name: string
          bank_phone: string | null
          branch_name: string
          created_at: string | null
          employee_id: string | null
          id: string
          country: string
          state: string
          city: string
          branch_address: string
          ifsc_code: string
          organization_id: string
          document_url: string | null
          zip_code: number
        }
        Insert: {
          account_holder_name: string
          account_number: string
          account_type: string
          bank_name: string
          bank_phone?: string | null
          branch_name: string
          created_at?: string | null
          employee_id?: string | null
          id?: string
          country: string
          state: string
          city: string
          branch_address: string
          ifsc_code: string
          organization_id: string
          document_url: string | null
          zip_code: number
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          account_type?: string
          bank_name?: string
          bank_phone?: string | null
          branch_name?: string
          created_at?: string | null
          employee_id?: string | null
          id?: string
          country: string
          state: string
          city: string
          branch_address: string
          ifsc_code?: string
          organization_id?: string
          document_url: string | null
          zip_code: number
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_bank_details_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_bank_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_documents: {
        Row: {
          category: string
          created_at: string | null
          document_type: string
          employee_id: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          organization_id: string
          status: string | null
          updated_at: string | null
          upload_date: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          document_type: string
          employee_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          organization_id: string
          status?: string | null
          updated_at?: string | null
          upload_date?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          document_type?: string
          employee_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          organization_id?: string
          status?: string | null
          updated_at?: string | null
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_education: {
        Row: {
          created_at: string | null
          document_url: string | null
          employee_id: string | null
          id: string
          institute: string | null
          organization_id: string
          type: string
          year_completed: string | null
        }
        Insert: {
          created_at?: string | null
          document_url?: string | null
          employee_id?: string | null
          id?: string
          institute?: string | null
          organization_id: string
          type: string
          year_completed?: string | null
        }
        Update: {
          created_at?: string | null
          document_url?: string | null
          employee_id?: string | null
          id?: string
          institute?: string | null
          organization_id?: string
          type?: string
          year_completed?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_education_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_education_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_emergency_contacts: {
        Row: {
          created_at: string | null
          employee_id: string
          id: string
          name: string
          organization_id: string
          phone: string
          relationship: string
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          id?: string
          name: string
          organization_id: string
          phone: string
          relationship: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          id?: string
          name?: string
          organization_id?: string
          phone?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_emergency_contacts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_emergency_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_experiences: {
        Row: {
          company: string
          created_at: string | null
          document_type: string | null
          document_url: string | null
          employee_id: string | null
          employment_type: string | null
          end_date: string | null
          id: string
          job_title: string
          location: string | null
          offer_letter_url: string | null
          payslip_1_url: string | null
          payslip_2_url: string | null
          payslip_3_url: string | null
          organization_id: string
          payslips: string[] | null
          separation_letter_url: string | null
          hike_letter_url: string | null
          start_date: string
          status: string | null
          upload_date: string | null
        }
        Insert: {
          company: string
          created_at?: string | null
          document_type?: string | null
          document_url?: string | null
          employee_id?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          job_title: string
          location?: string | null
          offer_letter_url?: string | null
          payslip_1_url: string | null
          payslip_2_url: string | null
          payslip_3_url: string | null
          organization_id: string
          payslips?: string[] | null
          separation_letter_url?: string | null
          hike_letter_url: string | null
          start_date: string
          status?: string | null
          upload_date?: string | null
        }
        Update: {
          company?: string
          created_at?: string | null
          document_type?: string | null
          document_url?: string | null
          employee_id?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          job_title?: string
          location?: string | null
          offer_letter_url?: string | null
          payslip_1_url: string | null
          payslip_2_url: string | null
          payslip_3_url: string | null
          organization_id?: string
          payslips?: string[] | null
          separation_letter_url?: string | null
          hike_letter_url: string | null
          start_date?: string
          status?: string | null
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_experiences_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_experiences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_family_details: {
        Row: {
          created_at: string | null
          employee_id: string
          id: string
          name: string
          occupation: string
          organization_id: string
          phone: string
          relationship: string
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          id?: string
          name: string
          occupation: string
          organization_id: string
          phone: string
          relationship: string
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          id?: string
          name?: string
          occupation?: string
          organization_id?: string
          phone?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_family_details_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employee_family_details_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employee_work_times: {
        Row: {
          auto_stopped: boolean | null
          created_at: string | null
          date: string
          duration_minutes: number | null
          employee_id: string
          end_time: string | null
          excess_break_minutes: number | null
          expected_coffee_duration_minutes: number | null
          expected_lunch_duration_minutes: number | null
          expected_work_hours: number | null
          id: string
          missed_breaks: string[] | null
          overtime_minutes: number | null
          pause_end_time: string | null
          pause_reason: string | null
          pause_start_time: string | null
          regular_hours_completed: boolean | null
          start_time: string
          status: string
          total_pause_duration_minutes: number | null
        }
        Insert: {
          auto_stopped?: boolean | null
          created_at?: string | null
          date: string
          duration_minutes?: number | null
          employee_id: string
          end_time?: string | null
          excess_break_minutes?: number | null
          expected_coffee_duration_minutes?: number | null
          expected_lunch_duration_minutes?: number | null
          expected_work_hours?: number | null
          id?: string
          missed_breaks?: string[] | null
          overtime_minutes?: number | null
          pause_end_time?: string | null
          pause_reason?: string | null
          pause_start_time?: string | null
          regular_hours_completed?: boolean | null
          start_time: string
          status: string
          total_pause_duration_minutes?: number | null
        }
        Update: {
          auto_stopped?: boolean | null
          created_at?: string | null
          date?: string
          duration_minutes?: number | null
          employee_id?: string
          end_time?: string | null
          excess_break_minutes?: number | null
          expected_coffee_duration_minutes?: number | null
          expected_lunch_duration_minutes?: number | null
          expected_work_hours?: number | null
          id?: string
          missed_breaks?: string[] | null
          overtime_minutes?: number | null
          pause_end_time?: string | null
          pause_reason?: string | null
          pause_start_time?: string | null
          regular_hours_completed?: boolean | null
          start_time?: string
          status?: string
          total_pause_duration_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_employee_work_times_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "hr_employees"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_employees: {
        Row: {
          aadhar_number: string | null
          aadhar_url: string | null
          blood_group: string | null
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          department_id: string | null
          designation_id: string | null
          email: string
          emergency_contacts: Json[] | null
          employee_id: string
          employment_start_date: string | null
          employment_status: string | null
          esic_number: string | null
          esic_url: string | null
          family_details: Json[] | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          marital_status: string | null
          organization_id: string
          pan_number: string | null
          pan_url: string | null
          permanent_address: Json | null
          phone: string | null
          position: string | null
          present_address: Json | null
          profile_picture_url: string | null
          role_id: string | null
          uan_number: string | null
          uan_url: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          aadhar_number?: string | null
          aadhar_url?: string | null
          blood_group?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          department_id?: string | null
          designation_id?: string | null
          email: string
          emergency_contacts?: Json[] | null
          employee_id: string
          employment_start_date?: string | null
          employment_status?: string | null
          esic_number?: string | null
          esic_url?: string | null
          family_details?: Json[] | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          marital_status?: string | null
          organization_id: string
          pan_number?: string | null
          pan_url?: string | null
          permanent_address?: Json | null
          phone?: string | null
          position?: string | null
          present_address?: Json | null
          profile_picture_url?: string | null
          role_id?: string | null
          uan_number?: string | null
          uan_url?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          aadhar_number?: string | null
          aadhar_url?: string | null
          blood_group?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          department_id?: string | null
          designation_id?: string | null
          email?: string
          emergency_contacts?: Json[] | null
          employee_id?: string
          employment_start_date?: string | null
          employment_status?: string | null
          esic_number?: string | null
          esic_url?: string | null
          family_details?: Json[] | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          marital_status?: string | null
          organization_id?: string
          pan_number?: string | null
          pan_url?: string | null
          permanent_address?: Json | null
          phone?: string | null
          position?: string | null
          present_address?: Json | null
          profile_picture_url?: string | null
          role_id?: string | null
          uan_number?: string | null
          uan_url?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_designation_id_fkey"
            columns: ["designation_id"]
            isOneToOne: false
            referencedRelation: "hr_designations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_employees_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "hr_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_organizations: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      hr_permissions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      hr_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department_id: string | null
          designation_id: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          organization_id: string | null
          phone: number | null
          role_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          designation_id?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          organization_id?: string | null
          phone?: number | null
          role_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          designation_id?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_id?: string | null
          phone?: number | null
          role_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "hr_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_profiles_designation_id_fkey"
            columns: ["designation_id"]
            isOneToOne: false
            referencedRelation: "hr_designations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "hr_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_project_employees: {
        Row: {
          assign_employee: string | null
          client_billing: number | null
          client_id: string | null
          created_at: string
          created_by: string | null
          end_date: string | null
          id: string
          organization_id: string | null
          project_id: string | null
          salary: number | null
          sow: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          assign_employee?: string | null
          client_billing?: number | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          organization_id?: string | null
          project_id?: string | null
          salary?: number | null
          sow?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          assign_employee?: string | null
          client_billing?: number | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          id?: string
          organization_id?: string | null
          project_id?: string | null
          salary?: number | null
          sow?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_project_employees_assign_employee_fkey"
            columns: ["assign_employee"]
            isOneToOne: false
            referencedRelation: "hr_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_project_employees_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "hr_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_project_employees_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "hr_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_project_employees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_project_employees_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "hr_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_project_employees_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "hr_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_projects: {
        Row: {
          attachment: string | null
          client_id: string
          created_at: string | null
          created_by: string | null
          duration: number | null
          employees_assigned: number | null
          employees_needed: number | null
          end_date: string | null
          id: string
          name: string
          organization_id: string | null
          profit: number | null
          revenue: number | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          attachment?: string | null
          client_id: string
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          employees_assigned?: number | null
          employees_needed?: number | null
          end_date?: string | null
          id?: string
          name: string
          organization_id?: string | null
          profit?: number | null
          revenue?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          attachment?: string | null
          client_id?: string
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          employees_assigned?: number | null
          employees_needed?: number | null
          end_date?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          profit?: number | null
          revenue?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "hr_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_organization"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "hr_organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_updated_by"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "hr_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string | null
          role_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string | null
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "hr_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hr_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "hr_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_roles: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      hr_job_candidates: {
        Row: {
          applied_date: string
          created_at: string
          email: string | null
          experience: string | null
          id: string
          job_id: string
          match_score: number | null
          name: string
          phone: string | null
          resume_url: string | null
          skills: string[] | null
          status: string
          updated_at: string
          current_salary: Number | null
          expected_salary: Number | null
          applied_from: string
        }
        Insert: {
          applied_date?: string
          created_at?: string
          email?: string | null
          experience?: string | null
          id?: string
          job_id: string
          match_score?: number | null
          name: string
          phone?: string | null
          resume_url?: string | null
          skills?: string[] | null
          status?: string
          updated_at?: string
          current_salary: Number | null
          expected_salary: Number | null
          applied_from: string
        }
        Update: {
          applied_date?: string
          created_at?: string
          email?: string | null
          experience?: string | null
          id?: string
          job_id?: string
          match_score?: number | null
          name?: string
          phone?: string | null
          resume_url?: string | null
          skills?: string[] | null
          status?: string
          updated_at?: string
          current_salary: Number | null
          expected_salary: Number | null
          applied_from: string
        }
        Relationships: [
          {
            foreignKeyName: "hr_job_candidates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "hr_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_jobs: {
        Row: {
          applications: number | null
          client_details: Json | null
          client_owner: string | null
          created_at: string | null
          department: string | null
          description: string | null
          description_bullets: string[] | null
          due_date: string | null
          experience: Json | null
          hiring_mode: string | null
          hr_organization_id: string | null
          id: string
          job_id: string
          job_type: string | null
          location: string[]
          posted_date: string | null
          skills: string[] | null
          status: string | null
          submission_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          applications?: number | null
          client_details?: Json | null
          client_owner?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          description_bullets?: string[] | null
          due_date?: string | null
          experience?: Json | null
          hiring_mode?: string | null
          hr_organization_id?: string | null
          id?: string
          job_id: string
          job_type?: string | null
          location?: string[]
          posted_date?: string | null
          skills?: string[] | null
          status?: string | null
          submission_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          applications?: number | null
          client_details?: Json | null
          client_owner?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          description_bullets?: string[] | null
          due_date?: string | null
          experience?: Json | null
          hiring_mode?: string | null
          hr_organization_id?: string | null
          id?: string
          job_id?: string
          job_type?: string | null
          location?: string[]
          posted_date?: string | null
          skills?: string[] | null
          status?: string | null
          submission_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      shared_jobs: {
        Row: { id: string; job_id: string; shared_at: string };
        Insert: { job_id: string };
        Update: Partial<{ job_id: string }>;
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_organization_with_superadmin: {
        Args: {
          org_name: string
          user_id: string
        }
        Returns: string
      }
      get_employee_details: {
        Args: {
          p_employee_id: string
        }
        Returns: Json
      }
      is_first_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
