"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadScorer } from "@/lib/api/scorers";
import { uploadImage } from "@/lib/api/image";
import Image from "next/image";
import { Upload } from "lucide-react";

export default function AddScorer() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    exam: "",
    score: "",
    year: "",
  });

  const [preview, setPreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);
      setError(null);

      let imageUrl = "";
      let publicId = "";

      if (selectedImageFile) {
        const uploadResult = await uploadImage(selectedImageFile, {
          folder: "benzene-plus-academy/scorers",
        });

        imageUrl =
          uploadResult?.data?.secure_url || uploadResult?.data?.url || "";

        publicId = uploadResult?.data?.publicId || "";
      }

      await uploadScorer({
        name: form.name,
        exam: form.exam,
        score: Number(form.score),
        year: Number(form.year),
        image: imageUrl,
        imagePublicId: publicId,
      });

      router.push("/admin/scores");
    } catch (err) {
      setError(err.message || "Failed to add scorer");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-5 px-4">
      <h1 className="text-3xl font-bold mb-8">Add New Scorer</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white border rounded-2xl p-6 shadow-sm"
      >
        <div>
          <label className="block mb-2 font-medium">Name</label>

          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Student name"
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Exam</label>

          <input
            type="text"
            name="exam"
            required
            value={form.exam}
            onChange={handleChange}
            placeholder="JAMB, WAEC..."
            className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Score</label>

            <input
              type="number"
              name="score"
              required
              value={form.score}
              onChange={handleChange}
              placeholder="320"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Year</label>

            <input
              type="number"
              name="year"
              required
              value={form.year}
              onChange={handleChange}
              placeholder="2025"
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label className="block mb-3 font-medium">Student Photo</label>

          <div className="space-y-4">
            <div className="relative w-full h-[320px] rounded-2xl border overflow-hidden bg-gray-100">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Selected
                </div>
              )}
            </div>

            <label className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl cursor-pointer hover:opacity-90">
              <Upload className="w-4 h-4" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
        >
          {uploading ? "Adding..." : "Add Scorer"}
        </button>
      </form>
    </div>
  );
}
