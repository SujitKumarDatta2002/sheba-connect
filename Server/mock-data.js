// Mock data for immediate API testing
const mockServices = [
  {
    _id: "60f7b3b3b3b3b3b3b3b3",
    id: "60f7b3b3b3b3b3b3b3b3",
    name: "Service 1",
    description: "This is first service available for users",
    category: "General",
    prerequisites: ["Basic Training", "ID Verification"],
    documentsRequired: ["ID Proof", "Address Proof"],
    savedBy: ["60f7b3b3b3b3b3b3b3b4"],
    createdAt: new Date("2024-01-15T10:30:00.000Z")
  },
  {
    _id: "60f7b3b3b3b3b3b3b3b5",
    id: "60f7b3b3b3b3b3b3b3b5",
    name: "Service 2",
    description: "Second service with advanced features",
    category: "Advanced",
    prerequisites: ["Service 1 Completion"],
    documentsRequired: ["Certificate of Completion"],
    savedBy: [],
    createdAt: new Date("2024-01-15T10:31:00.000Z")
  },
  {
    _id: "60f7b3b3b3b3b3b3b3b6",
    id: "60f7b3b3b3b3b3b3b3b6",
    name: "Service 3",
    description: "Third service for specialized needs",
    category: "Specialized",
    prerequisites: ["Background Check", "Service 2 Completion"],
    documentsRequired: ["Background Check Report"],
    savedBy: [],
    createdAt: new Date("2024-01-15T10:32:00.000Z")
  }
];

const mockComplaints = [
  {
    _id: "60f7b3b3b3b3b3b3b3b7",
    id: "60f7b3b3b3b3b3b3b3b7",
    user: "60f7b3b3b3b3b3b3b4",
    subject: "Complaint History 1",
    description: "This is first complaint from user",
    status: "Demoted",
    priority: "Medium",
    createdAt: new Date("2026-01-03T00:00:00.000Z"),
    updatedAt: new Date("2026-01-03T00:00:00.000Z")
  },
  {
    _id: "60f7b3b3b3b3b3b3b3b8",
    id: "60f7b3b3b3b3b3b3b3b8",
    user: "60f7b3b3b3b3b3b3b4",
    subject: "Complaint History 2",
    description: "Second complaint regarding service issues",
    status: "In Progress",
    priority: "High",
    createdAt: new Date("2026-05-20T00:00:00.000Z"),
    updatedAt: new Date("2026-05-20T00:00:00.000Z")
  },
  {
    _id: "60f7b3b3b3b3b3b3b3b9",
    id: "60f7b3b3b3b3b3b3b3b9",
    user: "60f7b3b3b3b3b3b3b4",
    subject: "Complaint History 3",
    description: "Third complaint about document processing",
    status: "Demoted",
    priority: "Low",
    createdAt: new Date("2026-09-25T00:00:00.000Z"),
    updatedAt: new Date("2026-09-25T00:00:00.000Z")
  }
];

const mockWarnings = [
  {
    type: "Warning",
    id: "warning-1",
    message: "Missing prerequisite: Basic Training for Service 1",
    serviceName: "Service 1"
  },
  {
    type: "Alert", 
    id: "alert-1",
    message: "Missing document: ID Proof for Service 1",
    serviceName: "Service 1"
  }
];

module.exports = {
  mockServices,
  mockComplaints,
  mockWarnings
};
