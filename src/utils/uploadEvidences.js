const supabase = require("../config/supabase.js");
const { randomUUID } = require("crypto");

async function uploadEvidences(files) {
  const evidenceURLs = [];

  for (const file of files) {
    const fileExt = file.originalname.split(".").pop();
    const filePath = `${randomUUID()}.${fileExt}`;

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
    evidenceURLs.push(data.publicUrl);
  }

  return evidenceURLs;
}

module.exports = { uploadEvidences };
