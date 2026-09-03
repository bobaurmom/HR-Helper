# API Documentation: Candidate Form Submission Flow

This document outlines the required steps for a candidate to submit a form via the API.

### 1. Upload CV to S3
The application requires that all CVs are uploaded via a pre-signed S3 URL to ensure privacy and security.

**Step A: Request a pre-signed upload URL**
- **Endpoint**: `POST /files/presigned-url`
- **Request Body**:
  ```json
  {
    "filename": "resume.pdf",
    "filesize": 1048576 
  }
  ```
- **Response**:
  ```json
  {
    "key": "documents/123456789-resume.pdf",
    "uploadUrl": "https://s3.amazonaws.com/your-bucket/..."
  }
  ```

**Step B: Upload the file to S3**
- **Method**: `PUT`
- **URL**: Use the `uploadUrl` returned in Step A.
- **Headers**: `Content-Type: application/pdf`
- **Body**: The binary content of the file.

**Step C: Record the file in the database**
- **Endpoint**: `POST /files`
- **Request Body**:
  ```json
  {
    "key": "documents/123456789-resume.pdf"
  }
  ```
- **Response**: Returns the file record, which includes the `id` (this is your `cvFileId`).

---

### 2. Submit the Form
Once you have the `cvFileId`, submit the form responses.

- **Endpoint**: `POST /form-submissions/:formId/submit`
- **Request Body**:
  ```json
  {
    "cvFileId": 123,
    "answers": [
      { "fieldId": 1, "value": "John Doe" },
      { "fieldId": 2, "optionId": 5 }
    ]
  }
  ```
- **Success Response**: `201 Created`
- **Validation**:
  - The endpoint validates that all mandatory fields are present.
  - The system checks if the form is currently open (`isOpen: true`).
  - The submission is recorded atomically.
