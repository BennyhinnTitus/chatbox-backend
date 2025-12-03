const complaint = 
{
  "submittedBy": {
    "$oid": "692d616b8628aa9bd86dc923"
  },
  "name": "Wilson",
  "designation": "Officer",
  "department": "Airforce",
  "location": "Madurai",
  "complaintType": "Data Breach",
  "incidentDate": "2025-11-07",
  "incidentTime": "12:43",
  "description": "Unauthorized access detected in secure communication logs.",
  "suspectedSource": "Sai Mohana Ram D",
  "evidences": [
    "https://your-storage.com/uploads/file1.png",
    "https://your-storage.com/uploads/file2.pdf"
  ],
  "status": "Pending",
  "assignedOfficer": null,
  "priority": "Medium",
  "trackingId": "CMP-1764606648089",
  "lastUpdated": {
    "$date": "2025-12-01T16:30:48.094Z"
  },
  "createdAt": {
    "$date": "2025-12-01T16:30:48.098Z"
  },
  "updatedAt": {
    "$date": "2025-12-01T16:30:48.098Z"
  },
  "__v": 0
}

const oldComplaint = {
  "_id": {
    "$oid": "6929e01e1fe96faa98cb4c48"
  },
  "complaint_id": "CMP-20251130-0001",
  "evidences": [
    {
      "evidence_id": "E-001"
    },
    {
      "evidence_id": "E-002"
    },
    {
      "evidence_id": "E-003"
    }
  ],
  "ai_module_status": "queued",
  "filescanner_module_status": "queued",
  "reported_at": "ISODate('2025-11-30T06:00:00Z')",
  "reporter_user_id": "USR0001",
  "status": "open",
  "form_data": "comment\": \"whatever user submits during the complaint booking [key: value]",
  "complaintType": "Data Breach",
  "description": "bla bla bla",
  "incidentDate": "2025-11-07",
  "incidentTime": "12:43",
  "reporter_details": {
    "name": "Wilson",
    "role": "Retired officer",
    "rank": "Airforce Officer",
    "department": "Airforce",
    "location": "Madurai"
  },
  "submitStamp": "ISODate('2025-12-01T10:51:23.425+00:00')",
  "suspectedSource": "Trust me bro"
}