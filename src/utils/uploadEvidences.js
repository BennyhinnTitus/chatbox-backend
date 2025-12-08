const supabase = require("../config/supabase.js");
const { randomUUID } = require("crypto");

async function uploadEvidences(files, { complaintId, evidenceIds = [] } = {}) {
  if (!complaintId) {
    throw new Error("complaintId is required to upload evidences");
  }

  const uploadedEvidences = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const providedId = evidenceIds[index];
    const fallbackId = `E-${randomUUID().split('-')[0].toUpperCase()}`;
    const evidenceId = providedId || fallbackId;

    const originalName = file.originalname || '';
    let sanitizedName = originalName
      ? originalName.replace(/[^a-zA-Z0-9._-]/g, '_')
      : '';

    if (!sanitizedName) {
      const defaultBase = `evidence_${index + 1}`;
      const extFromMime = file.mimetype && file.mimetype.includes('/')
        ? `.${file.mimetype.split('/').pop()}`
        : '';
      sanitizedName = `${defaultBase}${extFromMime}`;
    }

    const finalFileName = sanitizedName;
    const filePath = `complaints/${complaintId}/evidences/${evidenceId}/${finalFileName}`;

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    console.log("Uploaded file URL:", data.publicUrl);
    uploadedEvidences.push({ evidence_id: evidenceId });
  }

  return uploadedEvidences;
}

module.exports = { uploadEvidences };
