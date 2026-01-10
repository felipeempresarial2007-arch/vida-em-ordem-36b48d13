import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getMissionForDay, getStageForDay, MissionTemplate } from '@/lib/missions';
import { toast } from 'sonner';

interface ChallengeProgress {
  currentDay: number;
  currentStage: string;
  startedAt: string;
  completedAt: string | null;
}

interface UserProfile {
  fullName: string | null;
  onboardingCompleted: boolean;
}

interface DailyMission {
  id: string;
  dayNumber: number;
  stage: string;
  title: string;
  description: string;
  checklist: boolean[];
  completed: boolean;
  reflection: string | null;
  imageUrl: string | null;
  completedAt: string | null;
}

export function useChallengeProgress() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ChallengeProgress | null>(null);
  const [todayMission, setTodayMission] = useState<DailyMission | null>(null);
  const [missionTemplate, setMissionTemplate] = useState<MissionTemplate | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, onboarding_completed')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile({
          fullName: profileData.full_name,
          onboardingCompleted: profileData.onboarding_completed ?? false,
        });
      }

      // Fetch challenge progress
      const { data: progressData, error: progressError } = await supabase
        .from('challenge_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        throw progressError;
      }

      if (progressData) {
        setProgress({
          currentDay: progressData.current_day,
          currentStage: progressData.current_stage,
          startedAt: progressData.started_at,
          completedAt: progressData.completed_at,
        });

        // Check if new user (day 1 with no completed missions)
        const hasNoCompletedMissions = !progressData.completed_at && progressData.current_day === 1;
        const needsOnboarding = hasNoCompletedMissions && !(profileData?.onboarding_completed);
        setIsNewUser(needsOnboarding);

        // Fetch today's mission
        const { data: missionData, error: missionError } = await supabase
          .from('daily_missions')
          .select('*')
          .eq('user_id', user.id)
          .eq('day_number', progressData.current_day)
          .single();

        if (missionError && missionError.code !== 'PGRST116') {
          throw missionError;
        }

        const template = getMissionForDay(progressData.current_day);
        setMissionTemplate(template || null);

        if (missionData) {
          const checklistArray = Array.isArray(missionData.checklist) 
            ? missionData.checklist as boolean[]
            : new Array(template?.checklist.length || 0).fill(false);

          setTodayMission({
            id: missionData.id,
            dayNumber: missionData.day_number,
            stage: missionData.stage,
            title: missionData.title,
            description: missionData.description,
            checklist: checklistArray,
            completed: missionData.completed,
            reflection: missionData.reflection,
            imageUrl: missionData.image_url,
            completedAt: missionData.completed_at,
          });
        } else if (template) {
          // Create today's mission
          const { data: newMission, error: createError } = await supabase
            .from('daily_missions')
            .insert({
              user_id: user.id,
              day_number: progressData.current_day,
              stage: template.stage,
              title: template.title,
              description: template.description,
              checklist: new Array(template.checklist.length).fill(false),
            })
            .select()
            .single();

          if (createError) throw createError;

          if (newMission) {
            setTodayMission({
              id: newMission.id,
              dayNumber: newMission.day_number,
              stage: newMission.stage,
              title: newMission.title,
              description: newMission.description,
              checklist: new Array(template.checklist.length).fill(false),
              completed: false,
              reflection: null,
              imageUrl: null,
              completedAt: null,
            });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Erro ao carregar progresso');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  const updateChecklist = async (index: number, checked: boolean) => {
    if (!todayMission || !user) return;

    const newChecklist = [...todayMission.checklist];
    newChecklist[index] = checked;

    setTodayMission({ ...todayMission, checklist: newChecklist });

    try {
      await supabase
        .from('daily_missions')
        .update({ checklist: newChecklist })
        .eq('id', todayMission.id);
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };

  const updateReflection = async (reflection: string) => {
    if (!todayMission || !user) return;

    setTodayMission({ ...todayMission, reflection });

    try {
      await supabase
        .from('daily_missions')
        .update({ reflection })
        .eq('id', todayMission.id);
    } catch (error) {
      console.error('Error updating reflection:', error);
    }
  };

  const completeMission = async () => {
    if (!todayMission || !progress || !user) return;

    try {
      // Mark mission as completed
      await supabase
        .from('daily_missions')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', todayMission.id);

      // Advance to next day
      const nextDay = progress.currentDay + 1;
      const nextStage = getStageForDay(nextDay);
      const isCompleted = nextDay > 30;

      await supabase
        .from('challenge_progress')
        .update({
          current_day: isCompleted ? 30 : nextDay,
          current_stage: nextStage,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq('user_id', user.id);

      toast.success('Missão concluída! 🎉');
      
      // Refresh data
      await fetchProgress();
    } catch (error) {
      console.error('Error completing mission:', error);
      toast.error('Erro ao concluir missão');
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('user_id', user.id);
      
      setIsNewUser(false);
      setProfile(prev => prev ? { ...prev, onboardingCompleted: true } : null);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return {
    loading,
    progress,
    todayMission,
    missionTemplate,
    profile,
    isNewUser,
    updateChecklist,
    updateReflection,
    completeMission,
    completeOnboarding,
    refetch: fetchProgress,
  };
}
