"use client"

import React, { createContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

export const EnrolledCoursesContext = createContext();

export const EnrolledCoursesProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshEnrolledCourses = useCallback(async () => {
    setLoading(true);
    try {
      const result = await axios.get('/api/enroll-course');
      setEnrolledCourses(result.data);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshEnrolledCourses();
  }, [refreshEnrolledCourses]);

  return (
    <EnrolledCoursesContext.Provider value={{ enrolledCourses, refreshEnrolledCourses, loading }}>
      {children}
    </EnrolledCoursesContext.Provider>
  );
};
