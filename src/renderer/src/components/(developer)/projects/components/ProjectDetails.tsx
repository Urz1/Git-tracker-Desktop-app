'use client';
import React, { useState } from 'react';
import { Button } from '@renderer/components/ui/button';
import { CustomProgress } from '@renderer/components/ui/custom-progress';

interface TeamMember {
  id: string;
  name: string;
  username: string;
  role: string;
  avatar: string;
  skills: string[];
}

interface ProjectDetailsProps {
  project: {
    title: string;
    description: string;
    createdDate: string;
    deadline: string;
    progress: number;
    hoursWorked: string;
    sessions: number;
    totalCommits: number;
    latestCommit: string;
    overdueDays: number;
    deadlineDate: string;
    tasks: {
      todo: number;
      inProgress: number;
      pending: number;
      done: number;
    };
  };
  teamMembers: TeamMember[];
  onClose: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, teamMembers, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'commits' | 'analytics'>('overview');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Progress Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Progress</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{project.progress}% Completed</div>
            </div>

            {/* Hours Worked Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">Tracked</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{project.hoursWorked}</div>
              <div className="text-sm text-gray-600">{project.sessions} sessions</div>
            </div>

            {/* Commits Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Git</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{project.totalCommits} Total commits</div>
              <div className="text-sm text-gray-600">Latest: {project.latestCommit}</div>
            </div>

            {/* Overdue Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Deadline</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{project.overdueDays} Days Overdue</div>
              <div className="text-sm text-gray-600">Deadline: {project.deadlineDate}</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'tasks', label: `Tasks (${project.tasks.todo + project.tasks.inProgress + project.tasks.pending + project.tasks.done})` },
              { key: 'commits', label: `Commits (${project.totalCommits})` },
              { key: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Detail Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Project Detail</h3>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-xs text-gray-500">Created</span>
                    <div className="text-sm font-medium text-gray-900">{project.createdDate}</div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Deadline</span>
                    <div className="text-sm font-medium text-gray-900">{project.deadline}</div>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Report
                </Button>
              </div>

              {/* Team Members Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                </div>

                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{member.name}</span>
                          <span className="text-sm text-gray-500">@{member.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {member.role}
                          </span>
                          <div className="flex gap-1">
                            {member.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {member.skills.length > 3 && (
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                +{member.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              {/* Task Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-700">{project.tasks.todo}</div>
                  <div className="text-sm text-gray-600">To do</div>
                </div>

                <div className="bg-yellow-100 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-yellow-700">{project.tasks.inProgress}</div>
                  <div className="text-sm text-yellow-700">In progress</div>
                </div>

                <div className="bg-green-100 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-green-700">{project.tasks.pending}</div>
                  <div className="text-sm text-green-700">Pending</div>
                </div>

                <div className="bg-green-100 rounded-xl p-4 text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-green-700">{project.tasks.done}</div>
                  <div className="text-sm text-green-700">Done</div>
                </div>
              </div>

              {/* Project Tasks */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>All tasks</option>
                      <option>To do</option>
                      <option>In progress</option>
                      <option>Pending</option>
                      <option>Done</option>
                    </select>
                  </div>
                </div>

                {/* Sample Tasks */}
                <div className="space-y-3">
                  {[
                    {
                      title: "Implement user authentication system",
                      description: "Create login, registration, and password reset functionality with JWT tokens",
                      status: "Pending",
                      assignedTo: "Nebiyu Musbah",
                      createdDate: "1/5/2024",
                      dueDate: "1/10/2024"
                    },
                    {
                      title: "Design responsive navigation component",
                      description: "Create mobile-friendly navigation with collapsible menu and accessibility features",
                      status: "In Progress",
                      assignedTo: "Abebe Bikila",
                      createdDate: "1/5/2024",
                      dueDate: "1/10/2024",
                      action: "Mark as done"
                    },
                    {
                      title: "Integrate analytics dashboard",
                      description: "Add Chart.js integration for data visualization with real-time updates",
                      status: "To Do",
                      assignedTo: "Tariku Gemeda",
                      createdDate: "1/5/2024",
                      dueDate: "1/10/2024",
                      action: "Start Task"
                    }
                  ].map((task, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Assigned to: {task.assignedTo}</span>
                            <span>Created: {task.createdDate}</span>
                            <span>Due: {task.dueDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            task.status === 'Pending' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            task.status === 'To Do' ? 'bg-gray-100 text-gray-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.status}
                          </span>
                          {task.action && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              {task.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commits' && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Commits</h3>
              <div className="space-y-3">
                {[
                  { hash: "a1b2c3d", message: "Fix authentication bug", author: "Nebiyu Musbah", time: "2 hours ago" },
                  { hash: "e4f5g6h", message: "Update navigation styles", author: "Abebe Bikila", time: "1 day ago" },
                  { hash: "i7j8k9l", message: "Add dark mode toggle", author: "Bacha Debela", time: "3 days ago" }
                ].map((commit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-sm text-gray-900">{commit.hash}</div>
                      <div className="text-sm text-gray-600">{commit.message}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{commit.author}</div>
                      <div className="text-xs text-gray-500">{commit.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Time Tracking</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Total Hours</span>
                      <span className="font-medium text-blue-900">{project.hoursWorked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Sessions</span>
                      <span className="font-medium text-blue-900">{project.sessions}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Progress Overview</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Completion</span>
                      <span className="font-medium text-green-900">{project.progress}%</span>
                    </div>
                    <CustomProgress value={project.progress} className="h-2" barClassName="bg-green-500" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails; 