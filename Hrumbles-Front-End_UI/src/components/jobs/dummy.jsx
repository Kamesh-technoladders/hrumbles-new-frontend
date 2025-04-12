import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
 
function ResumeAnalysisModal({ jobId, onClose, setError, onAnalysisComplete = () => {}, initialData }) {
  const [resumeText, setResumeText] = useState(initialData?.resume_text || '');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(initialData || null);
  const [updatedSkills, setUpdatedSkills] = useState(initialData?.matched_skills || []);
  const [candidateId, setCandidateId] = useState(initialData?.candidate_id || null);
  const [candidateName, setCandidateName] = useState(initialData?.candidate_name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [github, setGithub] = useState(initialData?.github || '');
  const [linkedin, setLinkedin] = useState(initialData?.linkedin || '');
  const [isRevalidated, setIsRevalidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
 
  // Gemini setup
  const geminiApiKey = 'AIzaSyCPKQst10C4qlQ8hPinNI3LANSVPEuwGN4';
  const geminiModel = 'gemini-1.5-pro';
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: geminiModel });
 
  useEffect(() => {
    const getJobDescription = async () => {
      if (!jobId) {
        setError('Please select a job first.');
        return;
      }
      try {
        const { data, error } = await supabase
          .from('hr_jobs')
          .select('description')
          .eq('id', jobId)
          .single();
        if (error) throw error;
        if (!data?.description) throw new Error('Job description not found.');
        setJobDescription(data.description);
      } catch (err) {
        setError('Error loading job description: ' + err.message);
      }
    };
    getJobDescription();
  }, [jobId, setError]);
 
  const cleanResponse = (text) => {
    const jsonMatch = text.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error('No valid JSON found in response');
    return jsonMatch[0];
  };
 
  const analyzeResume = async () => {
    if (!jobDescription || !resumeText) {
      setError('Please provide both job description and resume.');
      return;
    }
 
    setIsLoading(true);
    const newCandidateId = candidateId || uuidv4();
    setCandidateId(newCandidateId);
 
    try {
      const prompt = `
        Analyze this resume against the job description and return ONLY a valid JSON response with:
        - overall_match_score (percentage, 0-100)
        - matched_skills (array of objects with:
            requirement (detailed, e.g., "Python for automation"),
            matched ('yes', 'partial', 'no'),
            details (specific evidence from resume or "Not mentioned" if absent))
        - summary (short plain text summary)
        - companies (array of company names found in the resume)
        - missing_or_weak_areas (array of strings listing gaps)
        - top_skills (array of candidate's strongest skills)
        - development_gaps (array of skills needing improvement)
        - additional_certifications (array of strings listing certifications not required by JD)
        - section_wise_scoring (object with main sections, each containing submenus:
            {
              section (string),
              weightage (percentage),
              submenus (array of { submenu (string), weightage (percentage of section), score (out of 10), weighted_score (calculated), remarks (string) })
            })
        - candidate_name (string, extracted from resume or "Unknown" if not found)
        - email (string, extracted from resume or "" if not found)
        - github (string, extracted from resume or "" if not found)
        - linkedin (string, extracted from resume or "" if not found)
 
        Job Description: ${jobDescription}
        Resume: ${resumeText}
 
        Structure section_wise_scoring with main sections and submenus:
        - Technical Skills (weightage: 40%, submenus: Core Skills 60%, Tools 40%)
        - Work Experience (weightage: 30%, submenus: Relevant Experience 70%, Duration 30%)
        - Projects (weightage: 15%, submenus: Personal Projects 50%, Professional Projects 50%)
        - Education (weightage: 10%, submenus: Degree, Certifications; weightage depends on JD:
          - If JD requires a specific certification: Degree 30%, Certifications 70%
          - If JD does not require a certification: Degree 50%, Certifications 50%)
        - Achievements (weightage: 5%, submenus: Awards 50%, Recognitions 50%)
        - Soft Skills (weightage: 5%, submenus: Leadership 50%, Communication 50%)
 
        Scoring Guidelines:
        - 'yes' (8-10/10): Clear evidence of the skill matching the JD.
        - 'partial' (4-7/10): Implied or indirect evidence.
        - 'no' (0-3/10): No evidence.
        - Infer skills from context (e.g., "Python used in automation tasks" matches "Python for automation").
        - Calculate overall_match_score as the sum of each section's weighted contribution:
          - section_score = sum(submenu.weightage * submenu.score) / 100
          - overall_match_score = sum(section.weightage * section_score) / 100
 
        For companies:
      - Extract company names, designations, and years from work experience sections.
      - If designation is not explicitly mentioned, use "-".
      - If years are not specified (e.g., "2019 - 2022"), use "-".
      - Example: "Senior Developer at TCS, 2019 - 2022" becomes { "name": "TCS", "designation": "Senior Developer", "years": "2019 - 2022" }
 
        Use symbols: ✅ for 'yes', ⚠️ for 'partial', ❌ for 'no'. Return ONLY the JSON object.
      `;
 
      const result = await model.generateContent(prompt);
      const cleanedText = cleanResponse(result.response.text());
      const parsedResult = JSON.parse(cleanedText);
 
      // Normalize company names
      const normalizeCompanyName = (name) => {
        const lowerName = name.toLowerCase().trim();
        if (lowerName === "infosys" || lowerName === "infosys ltd") return "Infosys";
        if (lowerName === "infosys infotech") return "Infosys Infotech";
        return name.trim();
      };
 
      const companyData = parsedResult.companies.map(company => ({
        name: normalizeCompanyName(company.name),
        designation: company.designation || '-',
        years: company.years || '-',
      }));
 
      const uniqueCompanies = Array.from(
        new Map(companyData.map(item => [item.name, item])).values()
      ); // Deduplicate by name, keeping latest designation/years
     
      setAnalysisResult({...parsedResult, companies: uniqueCompanies});
      setUpdatedSkills(parsedResult.matched_skills || []);
      setCandidateName(parsedResult.candidate_name || 'Unknown');
      setEmail(parsedResult.email || '');
      setGithub(parsedResult.github || '');
      setLinkedin(parsedResult.linkedin || '');
      const saved = await saveData(resumeText, { ...parsedResult, companies: uniqueCompanies }, newCandidateId, true);
      if (saved) {
        onAnalysisComplete({
          job_id: jobId,
          candidate_id: newCandidateId,
          candidate_name: parsedResult.candidate_name,
          overall_score: parsedResult.overall_match_score,
        });
        setIsAnalysisComplete(true);
      }
      setShowResults(false);
    } catch (err) {
      setError('Error analyzing resume: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };
 
  const saveData = async (resumeText, result, candidateId, isInitial = false) => {
    try {
      if (isInitial && result.email) {
        const { data: existing } = await supabase
          .from('resume_analysis')
          .select('candidate_id')
          .eq('email', result.email)
          .single();
        if (existing) {
          setError('Candidate with this email already exists.');
          return false;
        }
      }
 
      // Validate required fields
      if (!jobId || !candidateId) {
        throw new Error('Missing required fields: job_id or candidate_id');
      }
 
      // Step 1: Prepare resume_analysis payload (no companies field)
      const resumePayload = {
        job_id: jobId,
        candidate_id: candidateId,
        resume_text: resumeText || null,
        overall_score: Math.round(result.overall_match_score),
        matched_skills: result.matched_skills ? JSON.parse(JSON.stringify(result.matched_skills)) : null,
        summary: result.summary || null,
        missing_or_weak_areas: Array.isArray(result.missing_or_weak_areas) ? result.missing_or_weak_areas : [],
        top_skills: Array.isArray(result.top_skills) ? result.top_skills : [],
        development_gaps: Array.isArray(result.development_gaps) ? result.development_gaps : [],
        additional_certifications: Array.isArray(result.additional_certifications) ? result.additional_certifications : [],
        section_wise_scoring: result.section_wise_scoring ? JSON.parse(JSON.stringify(result.section_wise_scoring)) : {},
        candidate_name: result.candidate_name || 'Unknown',
        email: result.email || '',
        github: result.github || '',
        linkedin: result.linkedin || '',
        updated_at: new Date().toISOString(),
      };
 
      console.log('Saving to Supabase - Resume Analysis Payload:', JSON.stringify(resumePayload, null, 2));
 
      // Step 2: Upsert resume_analysis
      const { error: resumeError } = await supabase
        .from('resume_analysis')
        .upsert(resumePayload, { onConflict: ['job_id', 'candidate_id'] });
 
      if (resumeError) {
        console.error('Supabase Resume Error:', JSON.stringify(resumeError, null, 2));
        throw new Error(`Resume upsert failed: ${resumeError.message}`);
      }
 
      // Step 3: Save and check company associations in candidate_companies
      if (result.companies && Array.isArray(result.companies)) {
        const companyEntries = [];
        for (const company of result.companies) {
          const { data: existingCompany, error: companyError } = await supabase
            .from('companies')
            .select('id')
            .eq('name', company.name)
            .single();
 
          if (companyError && companyError.code !== 'PGRST116') {
            console.error('Supabase Company Error:', JSON.stringify(companyError, null, 2));
            throw new Error(`Company query failed: ${companyError.message}`);
          }
 
          let companyId;
          if (existingCompany) {
            companyId = existingCompany.id;
          } else {
            const { data: newCompany, error: insertError } = await supabase
              .from('companies')
              .insert({ name: company.name })
              .select('id')
              .single();
            if (insertError) {
              console.error('Supabase Company Insert Error:', JSON.stringify(insertError, null, 2));
              throw new Error(`Company insert failed: ${insertError.message}`);
            }
            companyId = newCompany.id;
          }
 
          companyEntries.push({
            candidate_id: candidateId,
            job_id: jobId,
            company_id: companyId,
            designation: company.designation || '-',
            years: company.years || '-',
          });
        }
 
        if (companyEntries.length > 0) {
          const { error: linkError } = await supabase
            .from('candidate_companies')
            .upsert(companyEntries, { onConflict: ['candidate_id', 'job_id', 'company_id'] });
 
          if (linkError) {
            console.error('Supabase Candidate Companies Error:', JSON.stringify(linkError, null, 2));
            throw new Error(`Candidate companies upsert failed: ${linkError.message}`);
          }
 
          // Step 4: Verify saved company data
          const { data: savedCompanies, error: fetchError } = await supabase
            .from('candidate_companies')
            .select('company_id, designation, years, companies (name)')
            .eq('candidate_id', candidateId)
            .eq('job_id', jobId);
 
          if (fetchError) {
            console.error('Supabase Fetch Error:', JSON.stringify(fetchError, null, 2));
            throw new Error(`Failed to verify company data: ${fetchError.message}`);
          }
 
          console.log('Verified Saved Companies:', JSON.stringify(savedCompanies, null, 2));
        }
      }
 
      return true;
    } catch (err) {
      setError(`Error saving data: ${err.message || 'Unknown error'}`);
      console.error('Caught Error:', JSON.stringify(err, null, 2));
      return false;
    }
  };
 
  const updateSkillLocally = (index, newStatus) => {
    const newSkills = [...updatedSkills];
    newSkills[index].matched = newStatus;
    if (newStatus !== 'no') delete newSkills[index].question;
    setUpdatedSkills(newSkills);
  };
 
  const revalidateSkills = async () => {
    setIsLoading(true);
    try {
      const prompt = `
        Recalculate scores based ONLY on the provided updated skills and initial section-wise scores. Do NOT re-analyze the resume or job description. Return ONLY a valid JSON response with:
        - overall_match_score (percentage, 0-100)
        - section_wise_scoring (object with main sections, each containing submenus:
            {
              section (string),
              weightage (percentage),
              submenus (array of { submenu (string), weightage (percentage of section), score (out of 10), weighted_score (calculated), remarks (string) })
            })
 
        Updated Skills: ${JSON.stringify(updatedSkills)}
        Initial Section-wise Scoring: ${JSON.stringify(analysisResult.section_wise_scoring)}
 
        Scoring Rules:
        - 'yes' = 10/10
        - 'partial' = 5/10
        - 'no' = 0/10
 
        Structure section_wise_scoring:
        - Technical Skills (weightage: 40%, submenus: Core Skills 60%, Tools 40%)
        - Work Experience (weightage: 30%, submenus: Relevant Experience 70%, Duration 30%)
        - Projects (weightage: 15%, submenus: Personal Projects 50%, Professional Projects 50%)
        - Education (weightage: 10%, submenus: Degree 50%, Certifications 50%)
        - Achievements (weightage: 5%, submenus: Awards 50%, Recognitions 50%)
 
        Skill-to-Submenu Mapping:
        - Core Skills: "Python for automation", "Bash for automation", "PowerShell for automation", "Ansible for automation", "Familiarity with scripting languages like JavaScript", "Experience with REST APIs", "Experience with AI integrated workflows"
        - Tools: "Familiarity with Jenkins", "Familiarity with Selenium", "Knowledge on containerization", "VMware VRO experience"
        - Relevant Experience: "RPA Automation experience", "Event, Incident and IT Process Automations experience", "Linux/Windows system administration experience"
        - Duration: "Linux/Windows system administration experience" (for 5+ years)
        - Professional Projects: "RPA Automation experience", "Event, Incident and IT Process Automations experience"
 
        Instructions:
        - Start with the initial section_wise_scoring scores.
        - Update ONLY the submenus affected by the updated skills:
          - For each submenu, calculate the new score as the average of the mapped skills' scores (10 for 'yes', 5 for 'partial', 0 for 'no').
          - If a submenu has no mapped skills updated, retain its initial score and remarks.
        - Recalculate weighted_score = submenu.weightage * score / 100 for each submenu.
        - Compute section_score = sum(submenu.weightage * submenu.score) / 100 for each section.
        - Compute overall_match_score = sum(section.weightage * section_score) / 100.
        - Total weightage of main sections must sum to 100%.
 
        Return ONLY the JSON object.
      `;
 
      const result = await model.generateContent(prompt);
      const cleanedText = cleanResponse(result.response.text());
      const updatedScores = JSON.parse(cleanedText);
 
      console.log('Updated Scores from Gemini:', updatedScores);
 
      const updatedResult = {
        ...analysisResult,
        overall_match_score: Math.round(updatedScores.overall_match_score),
        section_wise_scoring: updatedScores.section_wise_scoring,
        matched_skills: updatedSkills,
      };
 
      if (!jobId || !candidateId) {
        throw new Error('Missing required fields: job_id or candidate_id');
      }
 
      setAnalysisResult(updatedResult);
      setIsRevalidated(true);
      const saved = await saveData(resumeText, updatedResult, candidateId, false);
      if (saved) {
        onAnalysisComplete({
          job_id: jobId,
          candidate_id: candidateId,
          candidate_name: candidateName,
          overall_score: updatedResult.overall_match_score,
        });
      }
      setShowResults(false);
    } catch (err) {
      setError('Error re-evaluating scores: ' + err.message);
 
      const updatedScoring = { ...analysisResult.section_wise_scoring };
      const skillMap = {
        "Core Skills": ["Python for automation", "Bash for automation", "PowerShell for automation", "Ansible for automation", "Familiarity with scripting languages like JavaScript", "Experience with REST APIs", "Experience with AI integrated workflows"],
        "Tools": ["Familiarity with Jenkins", "Familiarity with Selenium", "Knowledge on containerization", "VMware VRO experience"],
        "Relevant Experience": ["RPA Automation experience", "Event, Incident and IT Process Automations experience", "Linux/Windows system administration experience"],
        "Duration": ["Linux/Windows system administration experience"],
        "Professional Projects": ["RPA Automation experience", "Event, Incident and IT Process Automations experience"],
      };
 
      Object.keys(skillMap).forEach(submenu => {
        const mappedSkills = skillMap[submenu];
        const relevantSkills = updatedSkills.filter(skill => mappedSkills.includes(skill.requirement));
        if (relevantSkills.length > 0) {
          const avgScore = relevantSkills.reduce((sum, skill) => sum + (skill.matched === 'yes' ? 10 : skill.matched === 'partial' ? 5 : 0), 0) / relevantSkills.length;
          const section = Object.keys(updatedScoring).find(sec => updatedScoring[sec].submenus.some(sub => sub.submenu === submenu));
          const submenuObj = updatedScoring[section].submenus.find(sub => sub.submenu === submenu);
          submenuObj.score = avgScore;
          submenuObj.weighted_score = (submenuObj.weightage * avgScore) / 100;
        }
      });
 
      const overallMatchScore = Object.values(updatedScoring).reduce((total, section) => {
        const sectionScore = section.submenus.reduce((sum, submenu) => sum + submenu.weighted_score, 0);
        return total + (sectionScore * section.weightage) / 100;
      }, 0);
 
      const updatedResultFallback = {
        ...analysisResult,
        overall_match_score: Math.round(overallMatchScore),
        section_wise_scoring: updatedScoring,
        matched_skills: updatedSkills,
      };
 
      setAnalysisResult(updatedResultFallback);
      setIsRevalidated(true);
      const saved = await saveData(resumeText, updatedResultFallback, candidateId, false);
      if (saved) {
        onAnalysisComplete({
          job_id: jobId,
          candidate_id: candidateId,
          candidate_name: candidateName,
          overall_score: updatedResultFallback.overall_match_score,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <Modal isOpen={true} onRequestClose={onClose} style={{ content: { maxWidth: '900px', margin: 'auto' } }}>
      <h2>Resume Analysis</h2>
      <textarea
        placeholder="Paste your resume here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        rows={10}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <div>
        <button onClick={analyzeResume} disabled={isLoading} style={{ marginRight: '10px' }}>
          {isLoading ? 'Loading...' : 'Analyze'}
        </button>
        <button onClick={onClose}>Close</button>
      </div>
      {isLoading && <p>Loading...</p>}
      {analysisResult && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setShowResults(!showResults)} style={{ marginBottom: '10px' }}>
            {showResults ? 'Hide Results' : '👁️ View Results'}
          </button>
          {showResults && (
            <>
              <h3>Candidate: {candidateName}</h3>
              <p><strong>Email:</strong> {email || 'Not provided'}</p>
              <p><strong>GitHub:</strong> {github || 'Not provided'}</p>
              <p><strong>LinkedIn:</strong> {linkedin || 'Not provided'}</p>
              <h3>✅ Overall Match Score: {analysisResult.overall_match_score} / 100 ({analysisResult.overall_match_score}%)</h3>
              <h4>🔑 Matched Skills & Experiences</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Requirement</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Matched?</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Details from Resume</th>
                    {!isRevalidated && <th style={{ border: '1px solid #ddd', padding: '8px' }}>Update</th>}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(updatedSkills) && updatedSkills.length > 0 ? (
                    updatedSkills.map((skill, idx) => (
                      <tr key={idx}>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{skill.requirement}</td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                          {skill.matched === 'yes' ? '✅' : skill.matched === 'partial' ? '⚠️ (Partial)' : '❌'}
                        </td>
                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>{skill.details}</td>
                        {!isRevalidated && (
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                            <div>
                              <button
                                onClick={() => updateSkillLocally(idx, 'no')}
                                style={{ marginRight: '5px', background: skill.matched === 'no' ? '#ddd' : '' }}
                              >
                                No
                              </button>
                              <button
                                onClick={() => updateSkillLocally(idx, 'partial')}
                                style={{ marginRight: '5px', background: skill.matched === 'partial' ? '#ddd' : '' }}
                              >
                                Partial
                              </button>
                              <button
                                onClick={() => updateSkillLocally(idx, 'yes')}
                                style={{ background: skill.matched === 'yes' ? '#ddd' : '' }}
                              >
                                Full
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isRevalidated ? 3 : 4} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                        No skills data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
 
              <h4>⚠️ Missing or Weak Areas</h4>
              <ul>
                {Array.isArray(analysisResult.missing_or_weak_areas) && analysisResult.missing_or_weak_areas.length > 0
                  ? analysisResult.missing_or_weak_areas.map((area, idx) => <li key={idx}>{area}</li>)
                  : <li>No data</li>}
              </ul>
              <h4>🏷️ Top Skills</h4>
              <ul>
                {Array.isArray(analysisResult.top_skills) && analysisResult.top_skills.length > 0
                  ? analysisResult.top_skills.map((skill, idx) => <li key={idx}>{skill}</li>)
                  : <li>No data</li>}
              </ul>
              <h4>📜 Additional Certifications (Not Required by JD)</h4>
              {Array.isArray(analysisResult.additional_certifications) && analysisResult.additional_certifications.length > 0 ? (
                <ul>{analysisResult.additional_certifications.map((cert, idx) => <li key={idx}>{cert}</li>)}</ul>
              ) : (
                <p>None listed</p>
              )}
              <h4>⚠️ Development Gaps</h4>
              <ul>
                {Array.isArray(analysisResult.development_gaps) && analysisResult.development_gaps.length > 0
                  ? analysisResult.development_gaps.map((gap, idx) => <li key={idx}>{gap}</li>)
                  : <li>No data</li>}
              </ul>
              <h4>📊 Section-wise Scoring Rubric</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Section / Submenu</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Weightage</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Score (/10)</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Weighted Score</th>
                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisResult.section_wise_scoring && Object.keys(analysisResult.section_wise_scoring).length > 0 ? (
                    Object.values(analysisResult.section_wise_scoring).map((section, sectionIdx) => (
                      <React.Fragment key={sectionIdx}>
                        <tr style={{ background: '#f0f0f0', fontWeight: 'bold' }}>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{section.section}</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>{section.weightage}%</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>-</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>-</td>
                          <td style={{ border: '1px solid #ddd', padding: '8px' }}>-</td>
                        </tr>
                        {Array.isArray(section.submenus) && section.submenus.length > 0 ? (
                          section.submenus.map((submenu, submenuIdx) => (
                            <tr key={`${sectionIdx}-${submenuIdx}`}>
                              <td style={{ border: '1px solid #ddd', padding: '8px', paddingLeft: '20px' }}>{submenu.submenu}</td>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{submenu.weightage}%</td>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{submenu.score}</td>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{submenu.weighted_score}</td>
                              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{submenu.remarks}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                              No submenu data
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                        No scoring data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <h4>🧾 Summary</h4>
              <p>{analysisResult.summary || 'No summary available'}</p>
              {!isRevalidated && (
                <button onClick={revalidateSkills} disabled={isLoading} style={{ marginTop: '10px' }}>
                  {isLoading ? 'Loading...' : 'Revalidate'}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
 
export default ResumeAnalysisModal;