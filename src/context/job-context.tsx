'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { Job } from '@/lib/dummy-data';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, onSnapshot, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './auth-context';

interface JobContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'creatorId'>) => Promise<void>;
  updateJob: (job: Job) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  appliedJobs: string[];
  applyForJob: (jobId: string) => void;
  isApplied: (jobId: string) => boolean;
  bookmarkedJobs: string[];
  toggleBookmark: (jobId: string) => void;
  isBookmarked: (jobId: string) => boolean;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jobsCollection = collection(db, "jobs");
    const unsubscribe = onSnapshot(jobsCollection, (snapshot) => {
        const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
        setJobs(jobsData);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching jobs: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubUser = onSnapshot(doc(db, "users", user.id), (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setAppliedJobs(userData.appliedJobs || []);
          setBookmarkedJobs(userData.bookmarkedJobs || []);
        }
      });
      return () => unsubUser();
    } else {
      setAppliedJobs([]);
      setBookmarkedJobs([]);
    }
  }, [user]);

  const addJob = async (job: Omit<Job, 'id' | 'creatorId'>) => {
    if (!user) {
        throw new Error('User must be logged in to add a job.');
    }
    const newJob = { ...job, creatorId: user.id };
    const docRef = await addDoc(collection(db, 'jobs'), newJob);
    // State update is handled by the onSnapshot listener
  };

  const updateJob = async (updatedJob: Job) => {
    const jobRef = doc(db, 'jobs', updatedJob.id);
    await updateDoc(jobRef, updatedJob);
    // State update is handled by the onSnapshot listener
  };

  const deleteJob = async (jobId: string) => {
    const jobRef = doc(db, 'jobs', jobId);
    await deleteDoc(jobRef);
    // State update is handled by the onSnapshot listener
  };

  const updateUserJobs = async (field: 'appliedJobs' | 'bookmarkedJobs', newJobs: string[]) => {
      if (user) {
          const userRef = doc(db, "users", user.id);
          await setDoc(userRef, { [field]: newJobs }, { merge: true });
      }
  }

  const applyForJob = (jobId: string) => {
    if (!appliedJobs.includes(jobId)) {
        const newApplied = [...appliedJobs, jobId];
        setAppliedJobs(newApplied);
        updateUserJobs('appliedJobs', newApplied);
    }
  };

  const toggleBookmark = (jobId: string) => {
    const newBookmarked = bookmarkedJobs.includes(jobId)
      ? bookmarkedJobs.filter(id => id !== jobId)
      : [...bookmarkedJobs, jobId];
    setBookmarkedJobs(newBookmarked);
    updateUserJobs('bookmarkedJobs', newBookmarked);
  };

  const isApplied = (jobId: string) => appliedJobs.includes(jobId);
  const isBookmarked = (jobId: string) => bookmarkedJobs.includes(jobId);

  return (
    <JobContext.Provider value={{ jobs, addJob, updateJob, deleteJob, appliedJobs, applyForJob, isApplied, bookmarkedJobs, toggleBookmark, isBookmarked }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobStore = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobStore must be used within a JobProvider');
  }
  return context;
};
