import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// ✅ AUTH — Signup
app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: "Signup successful", data });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ AUTH — Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: "Logged in successfully", data });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ DATABASE — Create User
app.post("/add-user", async (req, res) => {
    try {
        const { name, number, age } = req.body;
        if (!name || !number || !age) {
            return res.status(400).json({ error: "Name, number, and age are required" });
        }

        const { data, error } = await supabase
            .from("users")
            .insert([{ name, number, age }])
            .select();

        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: "User added successfully", data });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ DATABASE — Get All Users
app.get("/users", async (req, res) => {
    try {
        const { data, error } = await supabase.from("users").select("*");
        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ STORAGE — Upload File
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const { data, error } = await supabase.storage
            .from("my-bucket")
            .upload(`uploads/${Date.now()}-${file.originalname}`, file.buffer, {
                contentType: file.mimetype,
            });

        if (error) return res.status(400).json({ error: error.message });

        res.json({ message: "File uploaded successfully", path: data.path });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ STORAGE — List Files
app.get("/files", async (req, res) => {
    try {
        const { data, error } = await supabase.storage.from("my-bucket").list("uploads");
        if (error) return res.status(400).json({ error: error.message });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ STORAGE — Delete File
app.delete("/files/:fileName", async (req, res) => {
    try {
        const { fileName } = req.params;
        const { data, error } = await supabase.storage.from("my-bucket").remove([`uploads/${fileName}`]);
        if (error) return res.status(400).json({ error: error.message });
        res.json({ message: "File deleted successfully", deleted: data });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ STORAGE — Get Public URL
app.get("/files/url/:fileName", async (req, res) => {
    try {
        const fileName = decodeURIComponent(req.params.fileName);
        const path = fileName.startsWith("uploads/") ? fileName : `uploads/${fileName}`;
        const { data } = supabase.storage.from("my-bucket").getPublicUrl(path);
        res.json({ publicUrl: data.publicUrl });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ STORAGE — Rename/Move File
app.post("/files/rename", async (req, res) => {
    try {
        const { oldName, newName } = req.body;
        if (!oldName || !newName) {
            return res.status(400).json({ error: "Old name and new name are required" });
        }

        // Copy old file to new file path
        const { error: copyError } = await supabase
            .storage
            .from("my-bucket")
            .copy(`uploads/${oldName}`, `uploads/${newName}`);
        if (copyError) return res.status(400).json({ error: copyError.message });

        // Remove old file
        const { error: deleteError } = await supabase
            .storage
            .from("my-bucket")
            .remove([`uploads/${oldName}`]);
        if (deleteError) return res.status(400).json({ error: deleteError.message });

        res.json({ message: "File renamed/moved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Root endpoint
app.get("/", (req, res) => {
    res.send("use this link to access the actual project link : => https://delicate-fudge-4564d9.netlify.app/login");
});

// Start server
app.listen(process.env.PORT || 4000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 4000}`);
});
