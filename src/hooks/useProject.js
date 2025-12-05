import { useState, useEffect } from 'react';

export function useProjects() {
  const [projects, setProjects] = useState([
    {
      id: "project-1",
      name: "My First Project",
      expanded: false,
      folders: [],
      files: [
        {
          id: "file-1",
          name: "index.html",
          language: "html",
          content: "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n</body>\n</html>"
        },
        {
          id: "file-2",
          name: "style.css",
          language: "css",
          content: "body {\n  font-family: Arial;\n  padding: 20px;\n}\n\nh1 {\n  color: #007acc;\n}"
        },
        {
          id: "file-3",
          name: "script.js",
          language: "javascript",
          content: "console.log('Hello');"
        }
      ]
    }
  ]);

  const [activeProjectId, setActiveProjectId] = useState("project-1");

  // useEffect to Load projects from localStorage
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem("code-projects");
      if (savedProjects) {
        const loadedProjects = JSON.parse(savedProjects);
        setProjects(loadedProjects);
        
        if (loadedProjects.length > 0) {
          setActiveProjectId(loadedProjects[0].id);
        }
      }
    } catch(error) {
      console.error("Failed to load projects:", error);
    }
  }, []);

  return { projects, setProjects, activeProjectId, setActiveProjectId };
}