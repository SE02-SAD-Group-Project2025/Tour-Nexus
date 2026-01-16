import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

export default function mediaUpload(file) {
    return new Promise((resolve, reject) => {
        if (!url || !key) {
            reject("Supabase env vars are missing");
            return;
        }

        if (file == null) {
            reject("file is null");
            return;
        }

        const timestamp = new Date().getTime();
        const fileName = timestamp + file.name;

        supabase.storage.from("images").upload(fileName, file, {
            upsert: false,
            cacheControl: "3600"
        }).then(() => {
            const publicUrl = supabase.storage.from("images").getPublicUrl(fileName);
            resolve(publicUrl.data.publicUrl);
        }).catch((error) => {
            reject(error);
        });
    });
}
    
